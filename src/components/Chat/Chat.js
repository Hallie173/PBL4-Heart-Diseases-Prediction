import React, { useState, useEffect, useRef } from "react";
import { db } from "../../setup/firebase";
import { ref, onValue, push, set, remove } from "firebase/database";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faPaperclip,
  faPhone,
  faSearch,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { getUserByIDs } from "../../services/userService";
import { Skeleton } from "@mui/material";
import Peer from "simple-peer";
import { v4 as uuidv4 } from "uuid";

function Chat() {
  const user = useSelector((state) => state.user) || {};
  const userId = user.account?.id;

  // chat state
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState({});
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // webRTC state
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callInfo, setCallInfo] = useState(null); // Lưu thông tin cuộc gọi
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [callPending, setCallPending] = useState(false);
  const callTimeout = useRef(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getLastTimestamp = (messagesObj) => {
    const msgs = Object.values(messagesObj);
    if (msgs.length === 0) return 0;
    return Math.max(...msgs.map((msg) => msg.timestamp || 0));
  };

  // Lấy danh sách các channel mà user đang tham gia
  useEffect(() => {
    if (!userId) return;

    setLoadingChannels(true);
    const channelsRef = ref(db, "channels");
    onValue(channelsRef, async (snapshot) => {
      const data = snapshot.val() || {};

      const myChannels = Object.entries(data)
        .filter(([_, value]) => value.members && value.members[userId])
        .map(([key, value]) => ({
          id: key,
          ...value,
          lastTimestamp: getLastTimestamp(value.messages || {}),
        }));

      // Sắp xếp các channel theo thời gian giảm dần
      myChannels.sort((a, b) => b.lastTimestamp - a.lastTimestamp);

      // Trích xuất danh sách partnerId (chỉ có 1 người còn lại trong channel 2 người)
      const partnerIds = myChannels.map((ch) => {
        const memberIds = Object.keys(ch.members || {});
        return memberIds.find((id) => id !== userId);
      });

      // Gọi API backend để lấy thông tin của các partner đó
      try {
        const res = await getUserByIDs(partnerIds);
        if (res && res.EC === 0) {
          // Gắn thông tin partner vào channel (dựa vào thứ tự sau khi sort)
          const enrichedChannels = myChannels.map((ch, idx) => ({
            ...ch,
            partnerInfo: res.DT.find((user) => user._id === partnerIds[idx]),
          }));

          setChannels(enrichedChannels);
        } else {
          console.log("call api failed");
        }
      } catch (err) {
        console.error("Failed to fetch partner info:", err);
      }
    });
    setLoadingChannels(false);
  }, [userId]);

  // Lấy tin nhắn của channel được chọn
  useEffect(() => {
    if (!selectedChannel) return;
    setLoadingMessages(true);
    const messagesRef = ref(db, `channels/${selectedChannel.id}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const msgList = Object.entries(data)
        .map(([id, val]) => ({ id, ...val }))
        .sort((a, b) => a.timestamp - b.timestamp);
      setMessages(msgList);
    });
    setLoadingMessages(false);
  }, [selectedChannel]);

  const handleSend = async () => {
    if (!text.trim() || !selectedChannel.id) return;
    const newMsg = {
      sender: userId,
      text,
      timestamp: Date.now(),
    };
    await push(ref(db, `channels/${selectedChannel.id}/messages`), newMsg);
    setText("");
  };

  // Gửi cuộc gọi đi
  const startCall = async (isVideoCall) => {
    if (!selectedChannel?.id) return;

    const calleeId = Object.keys(selectedChannel.members).find(
      (id) => id !== userId
    );
    const callRef = ref(db, `calls/${selectedChannel.id}`);

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: isVideoCall,
        audio: true,
      });

      console.log("🎥 Got local stream:", localStream);
      console.log("🎥 Video tracks:", localStream.getVideoTracks());
      console.log("🎥 Audio tracks:", localStream.getAudioTracks());

      setIsCameraOn(isVideoCall);
      setIsMicOn(true);
      setStream(localStream);

      // Debug: Kiểm tra video ref
      console.log("🎥 myVideoRef.current:", myVideoRef.current);

      // Đợi một chút để React re-render
      setTimeout(() => {
        if (myVideoRef.current) {
          console.log("🎥 Setting srcObject to local video");
          myVideoRef.current.srcObject = localStream;

          // Force play
          myVideoRef.current.play().catch((e) => {
            console.error("Error playing local video:", e);
          });

          console.log(
            "🎥 Local video srcObject set:",
            myVideoRef.current.srcObject
          );
        } else {
          console.error("🎥 myVideoRef.current is null!");
        }
      }, 100);

      const p = new Peer({
        initiator: true,
        trickle: false,
        stream: localStream,
      });
      setPeer(p);

      p.on("signal", (data) => {
        set(callRef, {
          callerId: userId,
          calleeId,
          signal: data,
          status: "calling",
          timestamp: Date.now(),
        });
      });

      // Lắng nghe phản hồi từ callee
      const responseRef = ref(db, `calls/${selectedChannel.id}`);
      const unsubscribeResponse = onValue(responseRef, (snapshot) => {
        const callData = snapshot.val();
        if (
          callData &&
          callData.status === "accepted" &&
          callData.responseSignal
        ) {
          if (p && !p.destroyed) {
            p.signal(callData.responseSignal);
            clearTimeout(callTimeout.current);
            setCallPending(false);
            unsubscribeResponse();
          }
        } else if (callData && callData.status === "rejected") {
          endCall();
          unsubscribeResponse();
        }
      });

      p.on("stream", (remoteStream) => {
        console.log("🎥 Got remote stream:", remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch((e) => {
            console.error("Error playing remote video:", e);
          });
        }
      });

      p.on("error", (err) => {
        console.error("Peer connection error:", err);
        endCall();
      });

      setInCall(true);
      setCallPending(true);

      callTimeout.current = setTimeout(() => {
        unsubscribeResponse();
        endCall();
        setCallPending(false);
      }, 30000);

      window.currentCallUnsubscribe = unsubscribeResponse;
    } catch (error) {
      console.error("Failed to start call:", error);
      alert("Không thể truy cập camera/microphone");
    }
  };

  // Lắng nghe cuộc gọi đến
  useEffect(() => {
    if (!userId || !selectedChannel?.id) return;

    const callRef = ref(db, `calls/${selectedChannel.id}`);

    const unsubscribe = onValue(callRef, async (snapshot) => {
      const callData = snapshot.val();

      // Chỉ hiển thị incoming call nếu:
      // 1. Có data
      // 2. User này là người được gọi
      // 3. Trạng thái đang gọi
      // 4. Chưa trong cuộc gọi khác
      if (
        callData &&
        callData.calleeId === userId &&
        callData.status === "calling" &&
        !inCall &&
        !callPending
      ) {
        setCallInfo(callData);
      }
    });

    return () => unsubscribe();
  }, [selectedChannel, userId, inCall, callPending]);

  // Chấp nhận cuộc gọi
  const acceptCall = async () => {
    if (!callInfo) return;

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log("🎥 Got local stream (accept):", localStream);
      console.log("🎥 Video tracks (accept):", localStream.getVideoTracks());

      setStream(localStream);

      // Debug: Kiểm tra video ref
      console.log("🎥 myVideoRef.current (accept):", myVideoRef.current);

      // Đợi một chút để React re-render
      setTimeout(() => {
        if (myVideoRef.current) {
          console.log("🎥 Setting srcObject to local video (accept)");
          myVideoRef.current.srcObject = localStream;

          // Force play
          myVideoRef.current.play().catch((e) => {
            console.error("Error playing local video:", e);
          });

          console.log(
            "🎥 Local video srcObject set (accept):",
            myVideoRef.current.srcObject
          );
        } else {
          console.error("🎥 myVideoRef.current is null! (accept)");
        }
      }, 100);

      const p = new Peer({
        initiator: false,
        trickle: false,
        stream: localStream,
      });
      setPeer(p);

      p.on("signal", (signal) => {
        set(ref(db, `calls/${selectedChannel.id}`), {
          ...callInfo,
          status: "accepted",
          responseSignal: signal,
          timestamp: Date.now(),
        });
      });

      p.signal(callInfo.signal);

      p.on("stream", (remoteStream) => {
        console.log("🎥 Got remote stream (accept):", remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch((e) => {
            console.error("Error playing remote video:", e);
          });
        }
      });

      p.on("error", (err) => {
        console.error("Peer connection error:", err);
        endCall();
      });

      setInCall(true);
      setCallInfo(null);
    } catch (error) {
      console.error("Failed to accept call:", error);
      alert("Không thể truy cập camera/microphone");
      rejectCall();
    }
  };

  // Từ chối cuộc gọi
  const rejectCall = () => {
    if (!selectedChannel?.id) return;

    set(ref(db, `calls/${selectedChannel.id}/status`), "rejected");
    setCallInfo(null);
  };

  // Kết thúc cuộc gọi
  const endCall = () => {
    // Cleanup Firebase listener nếu có
    if (window.currentCallUnsubscribe) {
      window.currentCallUnsubscribe();
      window.currentCallUnsubscribe = null;
    }

    // Xóa call data trên Firebase
    if (selectedChannel?.id) {
      remove(ref(db, `calls/${selectedChannel.id}`)).catch((error) => {
        console.error("Failed to remove call data:", error);
      });
    }

    // Cleanup peer connection
    if (peer && !peer.destroyed) {
      peer.destroy();
    }

    // Cleanup media stream
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    // Cleanup video elements
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Reset states
    setPeer(null);
    setStream(null);
    setInCall(false);
    setCallInfo(null);
    setCallPending(false);

    if (callTimeout.current) {
      clearTimeout(callTimeout.current);
      callTimeout.current = null;
    }
  };

  // Hàm toggle microphone
  const toggleMicrophone = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
      console.log("🎤 Microphone:", !isMicOn ? "ON" : "OFF");
    }
  };

  // Hàm toggle camera
  const toggleCamera = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      const newCameraState = !isCameraOn;

      videoTracks.forEach((track) => {
        track.enabled = newCameraState;
      });

      if (newCameraState && myVideoRef.current) {
        // Gán lại srcObject để đảm bảo phần tử video được cập nhật
        myVideoRef.current.srcObject = stream;
        myVideoRef.current.play().catch((e) => {
          console.error("Lỗi phát video cục bộ sau khi bật/tắt:", e);
        });
      }

      setIsCameraOn(newCameraState);
      console.log("📹 Camera:", newCameraState ? "BẬT" : "TẮT");
    }
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  return (
    <div className="container-fluid h-100 my-3">
      <div className="row justify-content-center h-100">
        {/* CHANNEL LIST */}
        <div className="col-md-4 col-xl-3 chat">
          <div className="card mb-sm-3 mb-md-0 contacts_card">
            <div className="card-header">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <div className="input-group-prepend">
                  <span className="input-group-text search_btn py-3">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body contacts_body">
              <ul className="contacts">
                {!loadingChannels ? (
                  <>
                    {channels.map((channel) => (
                      <li
                        key={channel.id}
                        className={`user-item ${
                          selectedChannel?.id === channel.id ? "active" : ""
                        }`}
                        onClick={() => setSelectedChannel(channel)}
                      >
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src={channel.partnerInfo.avatar}
                              className="rounded-circle user_img"
                            />
                            <span className="online_icon"></span>
                          </div>
                          <div className="user_info">
                            <span>{channel.partnerInfo.username}</span>
                            <p>{channel.partnerInfo.username} is online</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </>
                ) : (
                  // Hiển thị skeleton loading giả lập 3 dòng user
                  <>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                      <li
                        key={i}
                        className="user-item d-flex bd-highlight align-items-center mb-2"
                      >
                        <div className="img_cont">
                          <Skeleton
                            variant="circular"
                            width={40}
                            height={40}
                            animation="wave"
                          />
                        </div>
                        <div className="user_info ms-3" style={{ flex: 1 }}>
                          <Skeleton
                            variant="text"
                            width="60%"
                            height={20}
                            animation="wave"
                          />
                          <Skeleton
                            variant="text"
                            width="40%"
                            height={15}
                            animation="wave"
                          />
                        </div>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* CHAT BOX */}
        <div className="col-md-8 col-xl-6 chat">
          <div className="card">
            <div className="card-header msg_head">
              <div class="d-flex bd-highlight justify-content-between align-items-center">
                <div class="d-flex align-items-center justify-content-center">
                  <div class="img_cont">
                    <img
                      src={selectedChannel?.partnerInfo?.avatar}
                      class="rounded-circle user_img"
                    />
                    <span class="online_icon"></span>
                  </div>
                  <div class="user_info">
                    <span>
                      {selectedChannel?.partnerInfo?.username ||
                        "Chọn người để chat"}
                    </span>
                    <p></p>
                  </div>
                </div>
                <div className="video_cam">
                  <span
                    className="mx-2"
                    role="button"
                    onClick={() => startCall(false)}
                    title="Gọi thoại"
                  >
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  <span
                    className="mx-2"
                    role="button"
                    onClick={() => startCall(true)}
                    title="Gọi video"
                  >
                    <FontAwesomeIcon icon={faVideo} />
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body msg_card_body">
              {loadingMessages ? (
                // Hiển thị 3 tin nhắn giả lập khi đang tải
                <>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((idx) => (
                    <div
                      key={idx}
                      className={
                        idx % 2 == 0
                          ? "d-flex mb-4 justify-content-end"
                          : "d-flex mb-4 justify-content-start"
                      }
                    >
                      <div className="img_cont_msg">
                        <Skeleton variant="circular" width={40} height={40} />
                      </div>
                      <div
                        className="msg_cotainer"
                        style={{
                          marginLeft: "10px",
                          maxWidth: "60%",
                          width: "fit-content",
                        }}
                      >
                        <Skeleton variant="text" width={180} height={20} />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`d-flex mb-4 ${
                      msg.sender === userId
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}
                  >
                    {msg.sender !== userId && (
                      <div className="img_cont_msg">
                        <img
                          src={selectedChannel?.partnerInfo?.avatar}
                          className="rounded-circle user_img_msg"
                        />
                      </div>
                    )}

                    <div
                      className={
                        msg.sender === userId
                          ? "msg_cotainer_send"
                          : "msg_cotainer"
                      }
                    >
                      {msg.text}
                      <span className="msg_time">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="card-footer">
              <div className="input-group">
                <div className="input-group-append">
                  <span className="input-group-text attach_btn">
                    <FontAwesomeIcon
                      icon={faPaperclip}
                      className="plus-circle-icon mx-2 my-3"
                    />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control type_msg"
                  placeholder="Nhập tin nhắn..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <div className="input-group-append" onClick={handleSend}>
                  <span className="input-group-text send_btn">
                    <FontAwesomeIcon
                      icon={faLocationArrow}
                      size="2x"
                      className="plus-circle-icon mx-2 my-2"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị màn hình chờ khi đang gọi */}
        {callPending && (
          <div className="incoming-call-overlay">
            <div className="incoming-call-box">
              <h5>
                Đang chờ {selectedChannel?.partnerInfo?.username || "người lạ"}{" "}
                chấp nhận cuộc gọi...
              </h5>
              <div className="incoming-call-actions mt-3">
                <button className="btn btn-danger" onClick={endCall}>
                  Hủy cuộc gọi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Màn hình hiển thị khi có cuộc gọi đến */}
        {callInfo && (
          <div className="incoming-call-overlay">
            <div className="incoming-call-box">
              <h5>
                Cuộc gọi đến từ{" "}
                {selectedChannel?.partnerInfo?.username || "người lạ"}
              </h5>
              <div className="incoming-call-actions mt-3">
                <button className="btn btn-success me-2" onClick={acceptCall}>
                  Chấp nhận
                </button>
                <button className="btn btn-danger" onClick={rejectCall}>
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Giao diện gọi video */}
        {inCall && (
          <div className="video-call-overlay">
            <div className="video-container">
              {/* Video của người khác (remote) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                muted={false}
                className="remote-video"
                onLoadedMetadata={() => console.log("🎥 Remote video loaded")}
                onError={(e) => console.error("🎥 Remote video error:", e)}
              />

              {/* Video của bản thân (local) */}
              {isCameraOn ? (
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted={true}
                  playsInline
                  className="local-video"
                  onLoadedMetadata={() => console.log("🎥 Local video loaded")}
                  onError={(e) => console.error("🎥 Local video error:", e)}
                  style={{
                    display: "block",
                    backgroundColor: "#000",
                    border: "2px solid red",
                  }}
                />
              ) : (
                <img
                  src={user?.account?.avatar}
                  className="rounded-circle user_img_msg"
                />
              )}

              {/* Debug info */}
              {/* <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: "10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                }}
              >
                <div>
                  Local stream: {stream ? "Available" : "Not available"}
                </div>
                <div>
                  Local video ref:{" "}
                  {myVideoRef.current ? "Available" : "Not available"}
                </div>
                <div>In call: {inCall ? "Yes" : "No"}</div>
              </div> */}

              {/* Nút kết thúc cuộc gọi */}
              <div className="call-controls">
                <button
                  className="btn btn-secondary toggle-camera-btn"
                  onClick={toggleCamera}
                >
                  {isCameraOn ? "Tắt Camera" : "Bật Camera"}
                </button>
                <button
                  className="btn btn-danger end-call-btn"
                  onClick={endCall}
                >
                  Kết thúc cuộc gọi
                </button>
                <button
                  className="btn btn-secondary toggle-mic-btn"
                  onClick={toggleMicrophone}
                >
                  {isMicOn ? "Tắt Mic" : "Bật Mic"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

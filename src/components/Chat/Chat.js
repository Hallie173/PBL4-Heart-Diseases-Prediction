import React, { useState, useEffect, useRef } from "react";
import { db } from "../../setup/firebase";
import { ref, onValue, push, set, remove } from "firebase/database";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faLocationArrow,
  faMicrophone,
  faMicrophoneSlash,
  faPaperclip,
  faPhone,
  faPhoneAlt,
  faSearch,
  faVideo,
  faVideoCamera,
  faVideoSlash,
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
  const [isRemoteCameraOn, setIsRemoteCameraOn] = useState(true);
  const activeStreams = useRef([]);

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

  // const sendControlSignal = (type, value) => {
  //   if (!selectedChannel?.id) return;

  //   const controlRef = ref(db, `calls/${selectedChannel.id}/controls`);
  //   const controlData = {
  //     type, // 'camera' hoặc 'microphone'
  //     value, // true/false
  //     timestamp: Date.now(),
  //     from: userId,
  //   };

  //   safeFirebaseSet(controlRef, controlData);
  // };

  useEffect(() => {
    if (!selectedChannel?.id || !inCall) return;

    const controlRef = ref(db, `calls/${selectedChannel.id}/controls`);
    const unsubscribe = onValue(controlRef, (snapshot) => {
      const controlData = snapshot.val();
      if (controlData && controlData.from !== userId) {
        if (controlData.type === "camera") {
          setIsRemoteCameraOn(controlData.value);
        }
      }
    });

    return () => unsubscribe();
  }, [selectedChannel?.id, inCall, userId]);

  // Helper function để clean dữ liệu Firebase
  const cleanFirebaseData = (obj) => {
    if (obj === null || obj === undefined) {
      return null;
    }

    if (Array.isArray(obj)) {
      return obj
        .map(cleanFirebaseData)
        .filter((item) => item !== null && item !== undefined);
    }

    if (typeof obj === "object") {
      const cleaned = {};
      Object.keys(obj).forEach((key) => {
        const value = cleanFirebaseData(obj[key]);
        if (value !== null && value !== undefined) {
          cleaned[key] = value;
        }
      });
      return Object.keys(cleaned).length > 0 ? cleaned : null;
    }

    return obj;
  };

  // Hàm an toàn để set Firebase data
  const safeFirebaseSet = async (ref, data) => {
    try {
      const cleanedData = cleanFirebaseData(data);
      if (cleanedData !== null && cleanedData !== undefined) {
        await set(ref, cleanedData);
      }
    } catch (error) {
      console.error("Firebase set error:", error);
      throw error;
    }
  };

  // Gửi cuộc gọi đi
  const startCall = async (isVideoCall) => {
    if (!selectedChannel?.id) return;

    const calleeId = Object.keys(selectedChannel.members).find(
      (id) => id !== userId
    );
    const callRef = ref(db, `calls/${selectedChannel.id}`);

    try {
      // Định nghĩa constraints rõ ràng
      const constraints = {
        video: isVideoCall === true,
        audio: true,
      };

      const localStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );

      setIsCameraOn(isVideoCall);
      setIsMicOn(true);
      setStream(localStream);
      addActiveStream(localStream);

      // Set video element
      if (isVideoCall) {
        setTimeout(() => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = localStream;
            myVideoRef.current.play().catch((e) => {
              console.error("Error playing local video:", e);
            });
          }
        }, 100);
      }

      // Tạo Peer
      const peerConfig = {
        initiator: true,
        trickle: false,
        stream: localStream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      };

      const p = new Peer(peerConfig);
      setPeer(p);

      p.on("signal", (data) => {
        const callData = {
          callerId: userId,
          calleeId,
          signal: cleanFirebaseData(data),
          status: "calling",
          callType: isVideoCall ? "video" : "voice",
          timestamp: Date.now(),
        };

        safeFirebaseSet(callRef, callData);
      });

      // Lắng nghe phản hồi
      const responseRef = ref(db, `calls/${selectedChannel.id}`);
      const unsubscribeResponse = onValue(responseRef, (snapshot) => {
        const callData = snapshot.val();
        if (
          callData &&
          callData.status === "accepted" &&
          callData.responseSignal
        ) {
          if (p && !p.destroyed) {
            const cleanedSignal = cleanFirebaseData(callData.responseSignal);
            if (cleanedSignal) {
              p.signal(cleanedSignal);
            }
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
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch((e) => {
            console.error("Error playing remote video:", e);
          });
        }

        // Set initial remote camera state based on call type
        setIsRemoteCameraOn(isVideoCall);
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
      // 1. Có data và signal hợp lệ
      // 2. User này là người được gọi
      // 3. Trạng thái đang gọi
      // 4. Chưa trong cuộc gọi khác
      if (
        callData &&
        callData.signal &&
        callData.calleeId === userId &&
        callData.status === "calling" &&
        !inCall &&
        !callPending
      ) {
        // Clean call data trước khi set
        const cleanedCallData = cleanFirebaseData(callData);
        setCallInfo(cleanedCallData);
      }
    });

    return () => unsubscribe();
  }, [selectedChannel, userId, inCall, callPending]);

  // Chấp nhận cuộc gọi
  const acceptCall = async () => {
    if (!callInfo || !callInfo.signal) return;

    try {
      const isVideoCall = callInfo.callType === "video";

      const constraints = {
        video: isVideoCall === true,
        audio: true,
      };

      const localStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );

      setIsCameraOn(isVideoCall);
      setIsMicOn(true);
      setStream(localStream);
      addActiveStream(localStream);

      // Set video element
      if (isVideoCall) {
        setTimeout(() => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = localStream;
            myVideoRef.current.play().catch((e) => {
              console.error("Error playing local video:", e);
            });
          }
        }, 100);
      }

      const peerConfig = {
        initiator: false,
        trickle: false,
        stream: localStream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      };

      const p = new Peer(peerConfig);
      setPeer(p);

      p.on("signal", (signal) => {
        const responseData = {
          ...cleanFirebaseData(callInfo),
          status: "accepted",
          responseSignal: cleanFirebaseData(signal),
          timestamp: Date.now(),
        };

        safeFirebaseSet(ref(db, `calls/${selectedChannel.id}`), responseData);
      });

      const cleanedSignal = cleanFirebaseData(callInfo.signal);
      if (cleanedSignal) {
        p.signal(cleanedSignal);
      }

      p.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch((e) => {
            console.error("Error playing remote video:", e);
          });
        }

        // Set initial remote camera state
        setIsRemoteCameraOn(isVideoCall);
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

    safeFirebaseSet(ref(db, `calls/${selectedChannel.id}/status`), "rejected");
    setCallInfo(null);
  };

  // Kết thúc cuộc gọi
  const endCall = () => {
    // Cleanup Firebase listeners
    if (window.currentCallUnsubscribe) {
      window.currentCallUnsubscribe();
      window.currentCallUnsubscribe = null;
    }

    // Xóa call data và controls trên Firebase
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
        stream.removeTrack(track);
      });
    }

    // Cleanup video elements
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = null;
      myVideoRef.current.load();
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    clearAllStreams();

    // Reset states
    setPeer(null);
    setStream(null);
    setInCall(false);
    setCallInfo(null);
    setCallPending(false);
    setIsRemoteCameraOn(true); // Reset remote camera state

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
    }
  };

  // Hàm toggle camera
  const toggleCamera = async () => {
    if (!stream || !peer || peer._pc.connectionState !== "connected") {
      console.error("Stream hoặc peer không hợp lệ");
      return;
    }

    const newCameraState = !isCameraOn;

    try {
      if (newCameraState) {
        const videoConstraints = { video: true, audio: true };
        const newVideoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );
        const newVideoTrack = newVideoStream.getVideoTracks()[0];

        if (newVideoTrack && peer && !peer.destroyed) {
          console.log("Gửi video track:", newVideoTrack);
          const sender = peer._pc
            .getSenders()
            .find((s) => s.track && s.track.kind === "video");
          if (sender) {
            await sender.replaceTrack(newVideoTrack);
          } else {
            await peer._pc.addTrack(newVideoTrack, stream);
            if (peer._pc.signalingState === "stable") {
              const offer = await peer._pc.createOffer();
              await peer._pc.setLocalDescription(offer);
              sendControlSignal("offer", offer);
            }
          }

          stream.getVideoTracks().forEach((track) => {
            stream.removeTrack(track);
            track.stop();
          });
          stream.addTrack(newVideoTrack);

          setTimeout(() => {
            if (myVideoRef.current) {
              myVideoRef.current.srcObject = stream;
              myVideoRef.current
                .play()
                .catch((e) => console.error("Error playing local video:", e));
            }
          }, 100);

          newVideoStream.getTracks().forEach((track) => {
            if (track !== newVideoTrack) track.stop();
          });
        }
      } else {
        const videoTracks = stream.getVideoTracks();
        const sender = peer._pc
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (sender) {
          await sender.replaceTrack(null);
        }
        videoTracks.forEach((track) => {
          track.stop();
          stream.removeTrack(track);
        });
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = null;
        }
      }

      console.log("Sending camera signal:", newCameraState);
      setIsCameraOn(newCameraState);
      sendControlSignal("camera", newCameraState);
    } catch (error) {
      console.error("Error toggling camera:", error);
      setIsCameraOn(!newCameraState);
    }
  };

  // Hàm sendControlSignal (đã có)
  const sendControlSignal = (type, value) => {
    if (!selectedChannel?.id) return;

    const controlRef = ref(db, `calls/${selectedChannel.id}/controls`);
    const controlData = {
      type, // 'camera' hoặc 'microphone'
      value, // true/false
      timestamp: Date.now(),
      from: userId,
    };

    safeFirebaseSet(controlRef, controlData);
  };

  // Phía remote: Lắng nghe Firebase và xử lý ontrack
  useEffect(() => {
    if (!selectedChannel?.id) return;

    const controlRef = ref(db, `calls/${selectedChannel.id}/controls`);
    const unsubscribe = onValue(controlRef, async (snapshot) => {
      const data = snapshot.val();
      if (data && data.from !== userId) {
        console.log("Nhận tín hiệu:", data);
        if (data.type === "camera" && remoteVideoRef.current) {
          if (data.value === false) {
            remoteVideoRef.current.srcObject = null;
            console.log("📹 Remote camera: TẮT");
          } else if (data.value === true) {
            const remoteStream = new MediaStream(
              peer._pc
                .getReceivers()
                .filter((r) => r.track && r.track.kind === "video")
                .map((r) => r.track)
            );
            console.log("Video tracks:", remoteStream.getVideoTracks());
            if (remoteStream.getVideoTracks().length > 0) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current
                .play()
                .catch((e) => console.error("Error playing remote video:", e));
              console.log("📹 Remote camera: BẬT");
            } else {
              console.warn("Không tìm thấy video track trong peer connection");
            }
          }
        } else if (data.type === "offer") {
          await peer._pc.setRemoteDescription(
            new RTCSessionDescription(data.value)
          );
          const answer = await peer._pc.createAnswer();
          await peer._pc.setLocalDescription(answer);
          sendControlSignal("answer", answer);
        }
      }
    });

    return () => unsubscribe();
  }, [selectedChannel?.id, userId]);

  if (peer) {
    peer._pc.ontrack = (event) => {
      if (event.track.kind === "video" && remoteVideoRef.current) {
        console.log(
          "ontrack triggered:",
          event.track,
          event.streams[0].getVideoTracks()
        );
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current
          .play()
          .catch((e) => console.error("Error playing remote video:", e));
      }
    };
  }

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  const addActiveStream = (stream) => {
    activeStreams.current.push(stream);
  };

  const clearAllStreams = () => {
    activeStreams.current.forEach((s) => {
      s.getTracks().forEach((t) => t.stop());
    });
    activeStreams.current = [];
  };

  function formatTimeAgo(timestamp) {
    const now = Date.now();
    const time =
      typeof timestamp === "number" ? timestamp : new Date(timestamp).getTime();
    const diffMs = now - time;
    const diffSec = Math.floor(diffMs / 1000);

    const mins = Math.floor(diffSec / 60);
    const hours = Math.floor(diffSec / 3600);
    const days = Math.floor(diffSec / 86400);
    const months = Math.floor(diffSec / (30 * 86400));
    const years = Math.floor(diffSec / (365 * 86400));

    if (diffSec < 60) return `vừa xong`;
    if (mins < 60) return `${mins} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 30) return `${days} ngày trước`;
    if (months < 12) return `${months} tháng trước`;
    return `${years} năm trước`;
  }

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
                          selectedChannel?.id === channel.id
                            ? "active-channel"
                            : ""
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
                      <span
                        className={`${
                          msg.sender === userId ? "msg_time_send" : "msg_time"
                        }`}
                      >
                        {/* {new Date(msg.timestamp).toLocaleTimeString()} */}
                        {formatTimeAgo(msg.timestamp)}
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
          <div className="video-call-overlay">
            <div className="video-container">
              {/* Avatar của người được gọi */}
              <div
                className="remote-video"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#1a1a1a",
                  position: "relative",
                }}
              >
                <img
                  src={
                    selectedChannel?.partnerInfo?.avatar ||
                    "/default-avatar.png"
                  }
                  alt="Avatar"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: "3px solid #fff",
                  }}
                />
                {/* Hiệu ứng ringing */}
                <div
                  style={{
                    position: "absolute",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    animation: "pulse 2s infinite",
                  }}
                ></div>
              </div>

              {/* Video của bản thân (local) */}
              {isCameraOn ? (
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted={true}
                  playsInline
                  className="local-video"
                  onError={(e) => console.error("🎥 Local video error:", e)}
                  style={{
                    display: "block",
                    backgroundColor: "#000",
                    border: "2px solid #28a745",
                  }}
                />
              ) : (
                <div
                  className="local-img"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#000",
                    border: "2px solid #28a745",
                  }}
                >
                  <img
                    src={user?.account?.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              )}

              {/* Thông tin cuộc gọi */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  textAlign: "center",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: "15px 25px",
                  borderRadius: "25px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h5 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
                  Đang gọi...
                </h5>
                <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>
                  {selectedChannel?.partnerInfo?.username || "người lạ"}
                </p>
              </div>

              {/* Nút điều khiển cuộc gọi */}
              <div className="call-controls d-flex justify-content-center gap-3 mt-3">
                <button
                  className="btn btn-secondary toggle-camera-btn"
                  onClick={toggleCamera}
                  title={isCameraOn ? "Tắt camera" : "Bật camera"}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={isCameraOn ? faVideoCamera : faVideoSlash}
                    size="lg"
                  />
                </button>

                <button
                  className="btn btn-danger end-call-btn"
                  onClick={endCall}
                  title="Hủy cuộc gọi"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faPhone} size="lg" />
                </button>

                <button
                  className="btn btn-secondary toggle-mic-btn"
                  onClick={toggleMicrophone}
                  title={isMicOn ? "Tắt micro" : "Bật micro"}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={isMicOn ? faMicrophone : faMicrophoneSlash}
                    size="lg"
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Màn hình hiển thị khi có cuộc gọi đến */}
        {callInfo && (
          <div className="video-call-overlay">
            <div className="video-container">
              {/* Avatar của người gọi */}
              <div
                className="remote-video"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#1a1a1a",
                  position: "relative",
                }}
              >
                <img
                  src={
                    selectedChannel?.partnerInfo?.avatar ||
                    "/default-avatar.png"
                  }
                  alt="Avatar"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: "3px solid #fff",
                  }}
                />
                {/* Hiệu ứng incoming call */}
                <div
                  style={{
                    position: "absolute",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    border: "2px solid rgba(40, 167, 69, 0.6)",
                    animation: "pulse 1.5s infinite",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    border: "2px solid rgba(40, 167, 69, 0.3)",
                    animation: "pulse 1.5s infinite 0.5s",
                  }}
                ></div>
              </div>

              {/* Preview video của bản thân */}
              <div
                className="local-img"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#000",
                  border: "2px solid #007bff",
                }}
              >
                <img
                  src={user?.account?.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              {/* Thông tin cuộc gọi đến */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  textAlign: "center",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: "15px 25px",
                  borderRadius: "25px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h5 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
                  Cuộc gọi đến
                </h5>
                <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>
                  {selectedChannel?.partnerInfo?.username || "người lạ"}
                </p>
              </div>

              {/* Nút điều khiển cuộc gọi đến */}
              <div className="call-controls d-flex justify-content-center gap-4 mt-3">
                <button
                  className="btn btn-danger"
                  onClick={rejectCall}
                  title="Từ chối cuộc gọi"
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  <FontAwesomeIcon icon={faPhone} size="lg" />
                </button>

                <button
                  className="btn btn-success"
                  onClick={acceptCall}
                  title="Chấp nhận cuộc gọi"
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  <FontAwesomeIcon icon={faPhone} size="lg" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Giao diện gọi video */}
        {inCall && (
          <div className="video-call-overlay">
            <div className="video-container">
              {/* Video/Avatar của người khác (remote) */}
              {isRemoteCameraOn ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  muted={false}
                  className="remote-video"
                  onError={(e) => console.error("🎥 Remote video error:", e)}
                />
              ) : (
                <div
                  className="remote-video"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#1a1a1a",
                    color: "white",
                  }}
                >
                  <img
                    src={
                      selectedChannel?.partnerInfo?.avatar ||
                      "/default-avatar.png"
                    }
                    alt="Avatar"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      border: "3px solid #fff",
                      marginBottom: "10px",
                    }}
                  />
                  <p style={{ margin: 0, fontSize: "16px", opacity: 0.8 }}>
                    {selectedChannel?.partnerInfo?.username || "người lạ"}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", opacity: 0.6 }}>
                    Camera tắt
                  </p>
                </div>
              )}

              {/* Video của bản thân (local) - giữ nguyên */}
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
                <div
                  className="local-img"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#000",
                    border: "2px solid red",
                  }}
                >
                  <img
                    src={user?.account?.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              )}

              {/* Nút điều khiển */}
              <div className="call-controls d-flex justify-content-center gap-3 mt-3">
                {/* <button
                  className="btn btn-secondary toggle-camera-btn"
                  onClick={toggleCamera}
                  title={isCameraOn ? "Tắt camera" : "Bật camera"}
                >
                  <FontAwesomeIcon
                    icon={isCameraOn ? faVideoCamera : faVideoSlash}
                  />
                </button> */}

                <button
                  className="btn btn-danger end-call-btn"
                  onClick={endCall}
                  title="Kết thúc cuộc gọi"
                >
                  <FontAwesomeIcon icon={faPhone} />
                </button>

                {/* <button
                  className="btn btn-secondary toggle-mic-btn"
                  onClick={toggleMicrophone}
                  title={isMicOn ? "Tắt micro" : "Bật micro"}
                >
                  <FontAwesomeIcon
                    icon={isMicOn ? faMicrophone : faMicrophoneSlash}
                  />
                </button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../setup/firebase";
import { ref, onValue, push } from "firebase/database";
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

function ChatPage() {
  const user = useSelector((state) => state.user) || {};
  const userId = user.account?.id;

  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState({});
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Lấy danh sách các channel mà user đang tham gia
  useEffect(() => {
    if (!userId) return;

    const channelsRef = ref(db, "channels");
    onValue(channelsRef, async (snapshot) => {
      const data = snapshot.val() || {};
      const myChannels = Object.entries(data)
        .filter(([_, value]) => value.members && value.members[userId])
        .map(([key, value]) => ({ id: key, ...value }));

      // Trích xuất danh sách partnerId (chỉ có 1 người còn lại trong channel 2 người)
      const partnerIds = myChannels.map((ch) => {
        const memberIds = Object.keys(ch.members || {});
        return memberIds.find((id) => id !== userId);
      });

      // Gọi API backend để lấy thông tin của các partner đó
      try {
        const res = await getUserByIDs(partnerIds);
        if (res && res.EC === 0) {
          // Gắn thông tin partner vào channel
          const enrichedChannels = myChannels.map((ch, idx) => ({
            ...ch,
            partnerInfo: res.DT[idx], // Giả sử giữ thứ tự đúng
          }));
          setChannels(enrichedChannels);
        } else console.log("call api failed");
      } catch (err) {
        console.error("Failed to fetch partner info:", err);
      }
    });
  }, [userId]);

  // Lấy tin nhắn của channel được chọn
  useEffect(() => {
    if (!selectedChannel) return;
    const messagesRef = ref(db, `channels/${selectedChannel.id}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const msgList = Object.entries(data)
        .map(([id, val]) => ({ id, ...val }))
        .sort((a, b) => a.timestamp - b.timestamp);
      setMessages(msgList);
    });
  }, [selectedChannel]);

  const handleSend = async () => {
    if (!text.trim() || !selectedChannel) return;
    const newMsg = {
      sender: userId,
      text,
      timestamp: Date.now(),
    };
    await push(ref(db, `channels/${selectedChannel.id}/messages`), newMsg);
    setText("");
  };

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
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="plus-circle-icon mx-2"
                  />
                  <FontAwesomeIcon
                    icon={faVideo}
                    className="plus-circle-icon mx-2"
                  />
                </div>
              </div>
            </div>
            <div className="card-body msg_card_body">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`d-flex mb-4 ${
                    msg.sender === userId
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  {msg.sender !== userId && (
                    <div class="img_cont_msg">
                      <img
                        src={selectedChannel?.partnerInfo?.avatar}
                        class="rounded-circle user_img_msg"
                      />
                    </div>
                  )}

                  <div
                    className={
                      msg.sender === userId
                        ? "msg_cotainer_send"
                        : "msg_cotainer"
                    }
                    styles={msg.sender === userId ? "" : "display: none"}
                  >
                    {msg.text}
                    <span className="msg_time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
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
      </div>
    </div>
  );
}

export default ChatPage;

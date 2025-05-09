import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  fetchAllUsersChatting,
  getAllMessage,
  sendMessageBetweenUser,
} from "../../services/userService";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faPaperclip,
  faPhone,
  faSearch,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { setLoading, setUnLoading } from "../../redux/reducer/loading";
import { toast } from "react-toastify";

const socket = io("http://localhost:3001");

function ChatPage({ userB }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user) || {};
  const userID = user.account.id;

  const [listUsersChatting, setlistUsersChatting] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchData, setSearchData] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest", // ngăn scroll toàn trang
    });
  };

  // Gọi scroll sau khi message thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAllMessage = async (receiverID) => {
    dispatch(setLoading());
    const response = await getAllMessage(userID, receiverID);
    dispatch(setUnLoading());
    if (response && response.EC === 0) {
      setMessages(response.DT);
    }
  };

  // Lấy tin nhắn
  useEffect(() => {
    if (!selectedUser) return;

    socket.on("receive_message", (data) => {
      // chỉ thêm nếu tin nhắn liên quan đến selected user
      if (
        (data.sender === selectedUser._id && data.receiver === userID) ||
        (data.sender === userID && data.receiver === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receive_message");
  }, [selectedUser]);
  // useEffect(() => {
  //   fetchAllMessage();

  //   socket.on("receive_message", (data) => {
  //     setMessages((prev) => [...prev, data]);
  //   });

  //   return () => socket.off("receive_message");
  // }, []);

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const newMsg = {
      sender: userID,
      receiver: selectedUser._id,
      message: text,
    };

    try {
      sendMessageBetweenUser(newMsg);
      socket.emit("send_message", { ...newMsg, created_at: new Date() });
      setText("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const fetchUsers = async () => {
    dispatch(setLoading());
    let response = await fetchAllUsersChatting(userID);
    dispatch(setUnLoading());

    if (response && response.EC === 0) {
      console.log(response.DT);
      setlistUsersChatting(response.DT);
      setSelectedUser(response.DT[0]);
      fetchAllMessage(response.DT[0]._id);
    }
  };

  const searchUser = () => {
    if (searchData === "") toast.error("Điền thông tin user");
    else toast.success(searchData);
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  return (
    <>
      <div class="container-fluid h-100 my-3">
        <div class="row justify-content-center h-100">
          <div class="col-md-4 col-xl-3 chat">
            <div class="card mb-sm-3 mb-md-0 contacts_card">
              <div class="card-header">
                <div class="input-group">
                  <input
                    type="text"
                    placeholder="Search..."
                    name=""
                    class="form-control search"
                    value={searchData}
                    onChange={(e) => setSearchData(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchUser()}
                  />
                  <div class="input-group-prepend">
                    <span
                      class="input-group-text search_btn"
                      onClick={() => searchUser()}
                    >
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="plus-circle-icon mx-2 my-2"
                      ></FontAwesomeIcon>
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-body contacts_body">
                <ui className="contacts">
                  {listUsersChatting.map((userChatting, idx) => (
                    <li
                      key={userChatting.id}
                      className={`user-item ${
                        selectedUser?._id === userChatting._id ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedUser(userChatting);
                        fetchAllMessage(userChatting._id);
                      }}
                    >
                      <div className="d-flex bd-highlight">
                        <div className="img_cont">
                          <img
                            src={userChatting.avatar}
                            className="rounded-circle user_img"
                          />
                          <span className="online_icon"></span>
                        </div>
                        <div className="user_info">
                          <span>{userChatting.username}</span>
                          <p>{userChatting.username} is online</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ui>
              </div>
              <div class="card-footer"></div>
            </div>
          </div>

          <div class="col-md-8 col-xl-6 chat">
            <div class="card">
              <div class="card-header msg_head">
                <div class="d-flex bd-highlight justify-content-between align-items-center">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="img_cont">
                      <img
                        src={selectedUser?.avatar}
                        class="rounded-circle user_img"
                      />
                      <span class="online_icon"></span>
                    </div>
                    <div class="user_info">
                      <span>
                        {selectedUser
                          ? selectedUser.username
                          : "Chọn người để chat"}
                      </span>
                      <p></p>
                    </div>
                  </div>
                  <div class="video_cam">
                    <span>
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="plus-circle-icon mx-2"
                      ></FontAwesomeIcon>
                    </span>
                    <span>
                      <FontAwesomeIcon
                        icon={faVideo}
                        className="plus-circle-icon mx-2"
                      ></FontAwesomeIcon>
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-body msg_card_body">
                {messages.map((msg, idx) => (
                  <>
                    {msg.sender === userID ? (
                      <>
                        <div key={idx} class="d-flex justify-content-end mb-4">
                          <div class="msg_cotainer_send">
                            {msg.message}
                            <span class="msg_time">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <div class="img_cont_msg">
                            <img
                              src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                              class="rounded-circle user_img_msg"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          key={idx}
                          class="d-flex justify-content-start mb-4"
                        >
                          <div class="img_cont_msg">
                            <img
                              src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                              class="rounded-circle user_img_msg"
                            />
                          </div>
                          <div class="msg_cotainer">
                            {msg.message}
                            <span class="msg_time">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div class="card-footer">
                <div class="input-group">
                  <div class="input-group-append">
                    <span class="input-group-text attach_btn">
                      <FontAwesomeIcon
                        icon={faPaperclip}
                        size=""
                        className="plus-circle-icon mx-2 my-3"
                      ></FontAwesomeIcon>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control type_msg"
                    placeholder="Nhập tin nhắn..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <div class="input-group-append" onClick={sendMessage}>
                    <span class="input-group-text send_btn">
                      <FontAwesomeIcon
                        icon={faLocationArrow}
                        size="2x"
                        className="plus-circle-icon mx-2 my-2"
                      ></FontAwesomeIcon>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatPage;

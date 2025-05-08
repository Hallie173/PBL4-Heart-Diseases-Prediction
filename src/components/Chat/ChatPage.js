import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  getAllMessage,
  sendMessageBetweenUser,
} from "../../services/userService";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faLocationArrow,
  faPaperclip,
  faPaperPlane,
  faPhone,
  faSearch,
  faUserCircle,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

const socket = io("http://localhost:3001");

function ChatPage({ userA, userB }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user) || {};
  const userID = user.account.id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Gọi scroll sau khi message thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAllMessage = async () => {
    const response = await getAllMessage(userA, userB);
    if (response && response.EC === 0) {
      setMessages(response.DT);
    }
  };

  // Lấy tin nhắn
  useEffect(() => {
    fetchAllMessage();

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const newMsg = { sender: userA, receiver: userB, message: text };

    try {
      sendMessageBetweenUser(newMsg);
      socket.emit("send_message", { ...newMsg, created_at: new Date() });
      setText("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  return (
    <>
      <div class="container-fluid h-100">
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
                  />
                  <div class="input-group-prepend">
                    <span class="input-group-text search_btn">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="plus-circle-icon mx-2 my-2"
                      ></FontAwesomeIcon>
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-body contacts_body">
                <ui class="contacts">
                  <li class="active">
                    <div class="d-flex bd-highlight">
                      <div class="img_cont">
                        <img
                          src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                          class="rounded-circle user_img"
                        />
                        <span class="online_icon"></span>
                      </div>
                      <div class="user_info">
                        <span>Khalid</span>
                        <p>Kalid is online</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex bd-highlight">
                      <div class="img_cont">
                        <img
                          src="https://2.bp.blogspot.com/-8ytYF7cfPkQ/WkPe1-rtrcI/AAAAAAAAGqU/FGfTDVgkcIwmOTtjLka51vineFBExJuSACLcBGAs/s320/31.jpg"
                          class="rounded-circle user_img"
                        />
                        <span class="online_icon offline"></span>
                      </div>
                      <div class="user_info">
                        <span>Taherah Big</span>
                        <p>Taherah left 7 mins ago</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex bd-highlight">
                      <div class="img_cont">
                        <img
                          src="https://i.pinimg.com/originals/ac/b9/90/acb990190ca1ddbb9b20db303375bb58.jpg"
                          class="rounded-circle user_img"
                        />
                        <span class="online_icon"></span>
                      </div>
                      <div class="user_info">
                        <span>Sami Rafi</span>
                        <p>Sami is online</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex bd-highlight">
                      <div class="img_cont">
                        <img
                          src="http://profilepicturesdp.com/wp-content/uploads/2018/07/sweet-girl-profile-pictures-9.jpg"
                          class="rounded-circle user_img"
                        />
                        <span class="online_icon offline"></span>
                      </div>
                      <div class="user_info">
                        <span>Nargis Hawa</span>
                        <p>Nargis left 30 mins ago</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex bd-highlight">
                      <div class="img_cont">
                        <img
                          src="https://static.turbosquid.com/Preview/001214/650/2V/boy-cartoon-3D-model_D.jpg"
                          class="rounded-circle user_img"
                        />
                        <span class="online_icon offline"></span>
                      </div>
                      <div class="user_info">
                        <span>Rashid Samim</span>
                        <p>Rashid left 50 mins ago</p>
                      </div>
                    </div>
                  </li>
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
                        src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                        class="rounded-circle user_img"
                      />
                      <span class="online_icon"></span>
                    </div>
                    <div class="user_info">
                      <span>Chat with Khalid</span>
                      <p>1767 Messages</p>
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

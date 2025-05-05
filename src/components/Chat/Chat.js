import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { getAllMessage } from "../../services/userService";

const socket = io("http://localhost:3001");

function Chat() {
  const [username, setUsername] = useState(
    "User" + Math.floor(Math.random() * 1000)
  );
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const fetchAllMessage = async () => {
    const response = await getAllMessage();
    if (response && response.EC === 0) {
      setChat(response.DT);
    }
  };

  useEffect(() => {
    fetchAllMessage();

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { username, message };
      socket.emit("send_message", newMessage);
      setMessage("");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Chat</h2>
      <div
        style={{
          height: 300,
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: 10,
        }}
      >
        {chat.map((msg, i) => (
          <p key={i}>
            <strong>{msg.username}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;

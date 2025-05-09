import React, { useState, useEffect } from "react";
import { db } from "../../setup/firebase";
import { ref, push, onValue } from "firebase/database";

function Chat({ userId }) {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Lấy các channel mà user tham gia
  useEffect(() => {
    const channelsRef = ref(db, "channels");
    onValue(channelsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const myChannels = Object.entries(data)
        .filter(([_, value]) => value.members && value.members[userId])
        .map(([key, value]) => ({ id: key, ...value }));
      setChannels(myChannels);
    });
  }, [userId]);

  // Lấy tin nhắn của channel được chọn
  useEffect(() => {
    if (!selectedChannel) return;
    const messagesRef = ref(db, `channels/${selectedChannel}/messages`);
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
    await push(ref(db, `channels/${selectedChannel}/messages`), newMsg);
    setText("");
  };

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      {/* DANH SÁCH CHANNEL */}
      <div
        style={{ width: "25%", borderRight: "1px solid #ccc", padding: "10px" }}
      >
        <h4>Your Channels</h4>
        {channels.map((ch) => (
          <div
            key={ch.id}
            onClick={() => setSelectedChannel(ch.id)}
            style={{
              padding: "10px",
              backgroundColor: ch.id === selectedChannel ? "#eee" : "#fff",
              cursor: "pointer",
            }}
          >
            Channel: {ch.id}
          </div>
        ))}
      </div>

      {/* KHUNG CHAT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "scroll",
            borderBottom: "1px solid #ccc",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                textAlign: msg.sender === userId ? "right" : "left",
                margin: "5px 0",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  backgroundColor:
                    msg.sender === userId ? "#007bff" : "#e4e6eb",
                  color: msg.sender === userId ? "#fff" : "#000",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", marginTop: "10px" }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            style={{ flex: 1, padding: "10px" }}
          />
          <button onClick={handleSend} style={{ marginLeft: "10px" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;

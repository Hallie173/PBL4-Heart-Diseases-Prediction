import React, { Component, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, get, onValue, off, set } from "firebase/database";
import { app } from "../../setup/firebase"; // Đường dẫn đến file firebase.js

// Khởi tạo Firebase Authentication và Google provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const ECG = () => {
  // Đăng nhập bằng Google
  const [ECGdata, setECGData] = useState([]);
  const [isRunning, setIsRunning] = useState(false); // Trạng thái bắt đầu/stop
  const [viewData, setViewData] = useState([]);

  useEffect(() => {
    const signInAndFetchData = async () => {
      try {
        // Đăng nhập bằng Google
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("User logged in:", user);
      } catch (error) {
        console.error("Error during Google Sign-In:", error);
      }
    };

    signInAndFetchData();
  }, []);

  useEffect(() => {
    if (ECGdata.length > 1500) {
      // Lấy dữ liệu từ stopValue đến stopValue + 500
      setViewData(ECGdata.slice(ECGdata.length - 1500, ECGdata.length - 1));
    } else {
      setViewData(ECGdata);
    }
  }, [ECGdata]);

  let formatECG = viewData.map((value, index) => ({
    index: index + ECGdata.length,
    ECGValue: value,
  }));

  const handleStartButton = () => {
    setIsRunning(true);
    const db = getDatabase(app);
    const dbRef = ref(db, "Data/FxhaovnQlHP8wJvCjvJPXb3U2ch2/state");

    // Gửi state=1 lên Firebase khi bắt đầu
    set(dbRef, 1);

    // Lấy dữ liệu từ Firebase Realtime Database sau khi đăng nhập
    const dbRef2 = ref(db, "Data/FxhaovnQlHP8wJvCjvJPXb3U2ch2/ecg_data");

    // Lắng nghe thay đổi dữ liệu (realtime listener)
    const dataListener = onValue(dbRef2, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);

        let arr = data[0].split(",");

        // Cập nhật dữ liệu mới
        setECGData((prevData) => [
          ...prevData, // Giữ lại dữ liệu cũ
          ...arr, // Thêm dữ liệu mới
        ]);
      } else {
        console.log("No data available");
      }
    });

    // Sau 10 giây gửi state=0 và ngừng lắng nghe dữ liệu
    setTimeout(() => {
      set(dbRef, 0);
      setIsRunning(false); // Đặt trạng thái không còn đang chạy

      // Dừng lắng nghe dữ liệu sau 10 giây
      off(dbRef2, "value", dataListener);
    }, 10000); // 10 giây
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={formatECG}>
          <Line
            type="monotone"
            dataKey="ECGValue"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            // animationDuration={0}
          />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
      <button
        onClick={handleStartButton}
        disabled={isRunning}
        className="btn btn-success mx-5 mt-2"
      >
        {isRunning ? "Running..." : "Start"}
      </button>
    </div>
  );
};

export default ECG;

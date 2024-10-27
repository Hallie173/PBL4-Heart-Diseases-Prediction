import React from "react";
import ECG from "./ECG/ECG";
import "./heartrate.css";

function Heartrate() {
  return (
    <div className="homepage">
      <div className="heartrate">
        <h2 className="your-heartrate">Kết quả của bạn</h2>
        <ECG className="ecg-graph"></ECG>
      </div>
    </div>
  );
}

export default Heartrate;

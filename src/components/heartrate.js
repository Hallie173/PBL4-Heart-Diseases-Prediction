import React, { useState } from "react";
import ECG from "./ECG/ECG";
import { Link } from "react-router-dom";
import "./heartrate.css";

function Heartrate({ onShowHistory }) {
  const [ecgType, setEcgType] = useState(null); // Lưu dữ liệu chẩn đoán ECG

  // Hàm callback nhận dữ liệu từ thành phần con (ECG)
  const handleDataUpdate = (data) => {
    setEcgType(data);
  };

  return (
    <div className="homepage">
      <div className="heartrate">
        <h2 className="your-heartrate">Kết quả của bạn</h2>
        {/* Truyền handleDataUpdate vào ECG */}
        <ECG className="ecg-graph" onDataUpdate={handleDataUpdate}></ECG>
        <div className="diagnosis">
          <div className="preliminary-diagnosis">
            <span className="content-name">Chẩn đoán sơ bộ: </span>
            <span className="diagnosis-content">
              {ecgType ? ecgType.predicted_label : "Loading"}
            </span>
          </div>
          <div className="detailed-diagnosis">
            <span className="content-name">Chẩn đoán chi tiết: </span>
            <span className="diagnosis-content">
              {ecgType ? ecgType.score : "Loading"}
            </span>
          </div>
        </div>
        <div className="buttons">
          <Link to="/history" className="show-history">
            <button>Xem lịch sử đo</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Heartrate;

import React, { useEffect, useState, useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useLocation } from "react-router-dom";

const EcgHistory = () => {
  const predicted_label = [
    "Normal",
    "Supraventricular",
    "Ventricular",
    "Paced",
    "Other",
  ];
  const predicted_detail = [
    "Nhịp tim bình thường",
    "Nhịp tim nhanh ở trên tâm thất (supraventricular)",
    "Nhịp tim đến từ vùng tâm thất",
    "Nhịp tim được điều chỉnh bằng máy tạo nhịp",
    "Nhịp ngoại tâm thu hiếm gặp",
  ];
  const location = useLocation();
  const { ecgData } = location.state || {}; // Lấy ecgData từ location.state

  const [viewData, setViewData] = useState([]);

  useEffect(() => {
    const arr = ecgData.ecg_analysis ? ecgData.ecg_analysis.split(",") : "";
    if (arr > 1500) {
      setViewData(arr.slice(arr.length - 1500, arr.length - 1));
    } else {
      setViewData(arr);
    }
  });

  let formatECG = viewData.map((value, index) => ({
    index: index + ecgData.ecg_analysis.length,
    ECGValue: value,
  }));

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
          />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
      <div className="diagnosis">
        <div className="preliminary-diagnosis">
          <span className="content-name">Chẩn đoán sơ bộ: </span>
          <span className="diagnosis-content">
            {ecgData &&
            ecgData.ecg_type &&
            ecgData.ecg_type.predicted_label >= 0
              ? predicted_label[ecgData.ecg_type.predicted_label]
              : "Loading"}
          </span>
        </div>
        <div className="detailed-diagnosis">
          <span className="content-name">Chẩn đoán chi tiết: </span>
          <span className="diagnosis-content">
            {ecgData &&
            ecgData.ecg_type &&
            ecgData.ecg_type.predicted_label >= 0
              ? predicted_detail[ecgData.ecg_type.predicted_label]
              : "Loading"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EcgHistory;

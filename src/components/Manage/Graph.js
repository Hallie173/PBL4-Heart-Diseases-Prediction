import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Graph.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getStatisticWithId } from "../../services/userService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Graph() {
  const { id } = useParams();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState(data);

  const applyFilter = () => {
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    });
    setFilteredData(filtered);
  };

  const chartData = {
    labels: filteredData.map((item) => item.date),
    datasets: [
      {
        label: "Số lần đo nhịp tim",
        data: filteredData.map((item) => item.value),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const fetchDataStatistic = async () => {
    let response = await getStatisticWithId(id);
    if (response && +response.EC === 0) {
      setData(response.DT);
    }
  };

  useEffect(() => {
    fetchDataStatistic();
  }, [id]);

  return (
    <div className="graph">
      <h2 className="user-statistic">Thống kê kết quả đo</h2>
      <div className="filter-inputs">
        <label className="from-date">
          Từ ngày:
          <input
            type="date"
            className="date-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="to-date">
          Đến ngày:
          <input
            type="date"
            className="date-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label className="filter-button">
          <button
            className="apply-filter btn btn-warning mt-3"
            onClick={applyFilter}
          >
            Lọc
          </button>
        </label>
      </div>
      <div className="statistic-content">
        {filteredData.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>Không có dữ liệu trong khoảng thời gian đã chọn.</p>
        )}
      </div>
      <Link to="/manage/statistic" className="back-to-list">
        <button>Back</button>
      </Link>
    </div>
  );
}

export default Graph;

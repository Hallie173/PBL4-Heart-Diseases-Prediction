import { Link, useNavigate, useParams } from "react-router-dom";
import "./history.css";
import { useEffect, useState } from "react";
import {
  getHistoryHealthRecord,
  getHistoryHealthRecordByAdmin,
} from "../../services/userService";
import { Skeleton } from "@mui/material";

function History() {
  const { id } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [dataList, setDataList] = useState([]);

  const [loading, setLoading] = useState(true);

  const toggleInfo = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  const fetchHistoryRecord = async () => {
    setLoading(true);
    let responsive = id
      ? await getHistoryHealthRecordByAdmin(id)
      : await getHistoryHealthRecord();
    if (responsive && +responsive.EC === 0) {
      const dataWithLocalCreated_at = responsive.DT.map((data) => ({
        ...data,
        created_at: new Date(data.created_at).toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
      }));
      setDataList(dataWithLocalCreated_at);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(id);

    fetchHistoryRecord();
  }, []);
  return (
    <div className="history">
      <h2 className="your-history">Lần đo gần đây</h2>
      <div className="result-list">
        <ul className="list">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <li key={index}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="30%" height={20} />
                </li>
              ))
            : dataList.map((item, index) => (
                <li key={index} onClick={() => toggleInfo(index)}>
                  <span>
                    {item.created_at}
                    {selectedIndex === index && (
                      <div className="info-box">{item.info}</div>
                    )}
                  </span>
                  <span className="show-detail">
                    <Link
                      to={id ? "/manage/ecg-history" : "/ecg-history"}
                      state={{ ecgData: item }}
                      className="show-date-detail"
                    >
                      Xem chi tiết
                    </Link>
                  </span>
                </li>
              ))}
        </ul>
      </div>
      <Link
        to={id ? "/manage/heart-record" : "/"}
        className="show-recent-result"
      >
        <button>Về trang chủ</button>
      </Link>
    </div>
  );
}

export default History;

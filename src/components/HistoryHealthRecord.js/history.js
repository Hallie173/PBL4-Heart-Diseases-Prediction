import { Link, useNavigate, useParams } from "react-router-dom";
import "./history.css";
import { useEffect, useState } from "react";
import {
  getHistoryHealthRecord,
  getHistoryHealthRecordByAdmin,
} from "../../services/userService";

function History() {
  const { id } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [dataList, setDataList] = useState([]);

  const toggleInfo = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  const fetchHistoryRecord = async () => {
    let responsive = id
      ? await getHistoryHealthRecordByAdmin(id)
      : await getHistoryHealthRecord();
    if (responsive && +responsive.EC === 0) {
      setDataList(responsive.DT);
    }
  };

  useEffect(() => {
    fetchHistoryRecord();
  }, []);

  // const dataList = [
  //   { date: "30/10/2024", info: "120bmp" },
  //   { date: "15/10/2024", info: "115bmp" },
  //   { date: "28/09/2024", info: "118bmp" },
  //   { date: "20/09/2024", info: "122bmp" },
  //   { date: "10/09/2024", info: "110bmp" },
  // ];
  return (
    <div className="history">
      <h2 className="your-history">Lần đo gần đây</h2>
      <div className="result-list">
        <ul className="list">
          {dataList.map((item, index) => (
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

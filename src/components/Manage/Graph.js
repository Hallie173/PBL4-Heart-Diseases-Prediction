import React from "react";
import { Link } from "react-router-dom";
import "./Graph.css";


function Graph() {
    return (
        <div className="graph">
            <h2 className="user-statistic">Thống kê kết quả đo</h2>
            <div></div>
            <Link to="/manage/statistic" className="back-to-list">
                <button>Back</button>
            </Link>
        </div>
    )
}

export default Graph;
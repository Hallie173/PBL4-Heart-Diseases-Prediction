import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./history.css";

function History() {
    return (
        <div className="history">
            <h2 className="your-history">Lịch sử kết quả đo</h2>
            <Link to="/" className="show-recent-result">
                <button>Về trang chủ</button>
            </Link>
        </div>
    )
}

export default History;
import React from "react";
import guidePic from '../../guide.png';
import './Guide.css';

function Guide() {
    return (
        <div className="guide">
            <div className="guide-div">
                <div className="title">
                    <h2 className="guide-title">Hướng dẫn sử dụng thiết bị đo nhịp tim</h2>
                    <p className="guide-warning">Vui lòng đọc kĩ hướng dẫn trước khi tiến hành đo!</p>
                </div>
                <div className="guide-content">
                    <ul className="index-list">
                        <li>1. Thông tin thiết bị</li>
                        <li>2. Hướng dẫn lắp đặt</li>
                        <li>3. Một số lưu ý khi đo</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Guide;
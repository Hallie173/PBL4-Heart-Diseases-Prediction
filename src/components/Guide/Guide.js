import React from "react";
import sensor from '../../AD8232.jpg';
import equip from '../../howtoequip.png'
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
                        <li><a href="#setup-guide">I.   Thông tin thiết bị</a></li>
                        <li><a href="#equipment-info">II.  Hướng dẫn lắp đặt</a></li>
                        <li><a href="#attention">III. Một số lưu ý khi đo</a></li>
                    </ul>
                    <div id="equipment-info">
                        <p className="main-title">I. Thông tin thiết bị</p>
                        <div className="equipment-info-content">
                            <div>
                                <img src={sensor} alt="Cảm biến nhịp tim AD8232" />
                                <div className="img-content">Cảm biến nhịp tim AD8232</div>
                                <p className="sub-title1">Thông số kỹ thuật:</p>
                                <p>Điện áp hoạt động: 2.0V – 3.5V (ổn định nhất ở 3.3V).</p>
                                <p>Tín hiệu đầu ra: Analog.</p>
                                <p>Điện năng tiêu thụ thấp: 170 µA (ở điện áp 3V).</p>
                            </div>
                        </div>
                    </div>
                    <div id="setup-guide">
                        <p className="main-title">II. Hướng dẫn lắp đặt</p>
                        <div className="setup-guide-content">
                            <div>
                                <img src={equip} alt="Hướng dẫn cách lắp đặt thiết bị đo" />
                                <div className="img-content">Sơ đồ lắp đặt thiết bị đo nhịp tim</div>
                                <p>Miếng dán 1 (RA – Right Arm): Đặt ở ngực phía trên bên phải, gần xương đòn (clavicle), ngay bên dưới vai phải.</p>
                                <p>Miếng dán 2 (LA – Left Arm): Đặt ở ngực phía trên bên trái, gần xương đòn (clavicle), ngay bên dưới vai trái.</p>
                                <p>Miếng dán 3 (RL/LL – Ground/Earth): Đặt ở phía dưới lồng ngực bên trái, gần hông trái (khu vực xương sườn dưới hoặc phần mềm của bụng trái).</p>
                            </div>
                        </div>
                    </div>
                    <div id="attention">
                        <p className="main-title">III. Một số lưu ý khi đo</p>
                        <div className="attention-content">
                            <p>Tín hiệu điện tâm đồ có thể khá nhiễu do hoạt động cơ bắp xung quanh.</p>
                            <p>Để cải thiện chất lượng tín hiệu cần giữ miếng đệm ở đúng vị trí, không di chuyển quá nhiều trong khi đo, làm sạch khu vực dán cũng như sử dụng miếng đệm mới cho mỗi lần đo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Guide;
import React from "react";
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return (
        <div className="footer">
            <div className="title">Chẩn đoán các vấn đề tim mạch</div>
            <div className="all-info">
                <div className="left-info">
                    <div className="terms">
                        <span className="info-title">Điều khoản</span>
                        <div>
                            <p><a href="#">Chính sách dịch vụ</a></p>
                            <p><a href="#">Chính sách bảo mật</a></p>
                            <p><a href="#">Trách nhiệm và cam kết</a></p>
                        </div>
                    </div>
                    <div className="services">
                        <span className="info-title">Dịch vụ</span>
                        <div>
                            <p><a href="#">Khám sức khỏe cá nhân</a></p>
                            <p><a href="#">Chẩn đoán bệnh online</a></p>
                            <p><a href="#">Tra cứu kết quả khám</a></p>
                        </div>
                    </div>
                </div>
                <div className="center-info">
                    <div className="contact">
                        <span className="info-title">Thông tin liên hệ</span>
                        <div>
                        <p>
                            <FontAwesomeIcon icon={faLocationDot} className="icon"/> {}
                            <span><a href="#">54 Nguyễn Lương Bằng, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng 550000, Việt Nam</a></span>
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faPhone} className="icon"/> {}
                            <span>0987654321</span>
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faEnvelope} className="icon"/> {}
                            <span>healthy_heart@gmail.com</span>
                        </p>
                        </div>
                    </div>
                </div>
                <div className="right-info">
                    <div>Need something here!</div>
                </div>
            </div>
        </div>
    )
}

export default Footer
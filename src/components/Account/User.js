import "./User.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

function User() {
    return (
        <div className="user">
            <div className="title">
                <span className="numberical-order">#</span>
                <span className="acc-id">ID</span>
                <span className="username">Username</span>
                <span className="email">Email</span>
                <span className="group">Group</span>
                <span className="actions">Actions</span>
            </div>
            <ul className="account-list">
                <li className="account-item">
                    <span className="account-numberical-order">1</span>
                    <span className="account-id">001</span>
                    <span className="account-username">LDPH</span>
                    <span className="account-email">phuonghaleduy@gmail.com</span>
                    <span className="account-group">User</span>
                    <span className="account-actions">
                        <FontAwesomeIcon icon={faPenToSquare} className="edit-icon"></FontAwesomeIcon>
                        <FontAwesomeIcon icon={faTrashCan} className="trash-icon"></FontAwesomeIcon>
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default User;
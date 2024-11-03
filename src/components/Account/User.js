import "./User.css";

function User() {
    return (
        <div className="user">
            <div className="title">
                <span className="numberical-order">#</span>
                <span className="id">ID</span>
                <span className="username">Username</span>
                <span className="email">Email</span>
                <span className="group">Group</span>
                <span className="actions">Actions</span>
            </div>
            <ul class="account-list">
                <li class="account-item">
                    <span className="account-numberical-order">#001</span>
                    <span className="account-id">PT001</span>
                    <span className="account-username">LDPH</span>
                    <span className="account-email">phuonghaleduy@gmail.com</span>
                    <span className="account-group">User</span>
                    <span className="account-actions">Actions</span>
                </li>
            </ul>
        </div>
    )
}

export default User;
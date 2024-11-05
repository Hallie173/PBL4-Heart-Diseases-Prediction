import "./Roles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

function Roles() {
    return (
        <div className="roles">
            <div className="add-role">
                <h5 className="add-role-title">Add a new role:</h5>
                <input type="text" className="add-role-url" placeholder="URL..." />
                <input type="text" className="add-role-description" placeholder="Description.." />
                <button type="submit" className="save-new-role">Add role</button>
            </div>
            <div className="title">
                <span className="r-id">ID</span>
                <span className="url">URL</span>
                <span className="description">DescriptionN</span>
                <span className="actions">Actions</span>
            </div>
            <ul className="roles-list">
                <li className="roles-item">
                    <span className="role-id">001</span>
                    <span className="role-url">/</span>
                    <span className="role-description">nothingnothingnothingnothingnothingnothing</span>
                    <span className="role-actions">
                        <FontAwesomeIcon icon={faTrashCan} className="trash-icon"></FontAwesomeIcon>
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default Roles;
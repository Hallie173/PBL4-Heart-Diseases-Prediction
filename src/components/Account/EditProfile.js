import React from "react";
import "./EditProfile.css";

function EditProfile() {
    return (
        <div className="modal fade" id="edit-form-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title" id="exampleModalLabel">Edit Profile</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-control" defaultValue="Le Duy Phuong Ha" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Sexuality</label>
                                <div>
                                    <label for="male-radio" className="sexuality-radio"><input type="radio" id="male-radio" name="sexuality" className="form-check-inline form-check-input" defaultValue="Male" />Male</label>
                                    <label for="female-radio" className="sexuality-radio"><input type="radio" id="female-radio" name="sexuality" className="form-check-inline form-check-input" defaultValue="Female" />Female</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Date of Birth</label>
                                <input type="date" className="form-control" defaultValue="17/03/2004" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" defaultValue="phuonghaleduy@gmail.com" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input type="text" className="form-control" defaultValue="Da Nang, Viet Nam" />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;

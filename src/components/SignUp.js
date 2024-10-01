import React from "react";
import "./SignUp.css";

function SignUp() {
    return (
        <div className="signup">
        <form>
            <h1>Sign Up</h1>
            <div className="form-control">
                <input id="first-name" type="text" placeholder="First Name" />
                <small></small>
                <span></span>
            </div>
            <div className="form-control">
                <input id="Last Name" type="text" placeholder="Last Name" />
                <small></small>
                <span></span>
            </div>
            <div className="form-control">
                <input id="email" type="email" placeholder="Email" />
                <small></small>
                <span></span>
            </div>
            <div className="form-control">
                <input id="password" type="password" placeholder="Password" />
                <small></small>
                <span></span>
            </div>
        </form>
      </div>
    );
}

export default SignUp
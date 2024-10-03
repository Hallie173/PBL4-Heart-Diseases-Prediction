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
                <input id="last-name" type="text" placeholder="Last Name" />
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
            <div className="form-control">
                <input id="username" type="text" placeholder="Username" />
                <small></small>
                <span></span>
            </div>
            <div className="form-control">
                <input id="address" type="text" placeholder="Address" />
                <small></small>
                <span></span>
            </div>
            <div className="form-control">
                <label>
                <input type="radio" name="gender" value="male" /> Nam
                </label>
                <label>
                <input type="radio" name="gender" value="female" /> Nữ
                </label>
                <label>
                <input type="radio" name="gender" value="other" /> Khác
                </label>
                <small></small>
                <span></span>
            </div>
            <div className="form-control">
                <input id="phone" type="tel" placeholder="Phone number" />
                <small></small>
                <span></span>
            </div>
        </form>
        </div>
    );
}

export default SignUp
import React from "react";
import "./LogIn.css";

function LogIn() {
    return (
        <div className="login hidden">
        <form>
          <h1>Log In</h1>
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

export default LogIn
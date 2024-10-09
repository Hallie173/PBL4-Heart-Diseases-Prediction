import React from "react";
import styles from "./LogIn.module.css";
import { Link } from 'react-router-dom';

function LogIn() {
    return (
        <div className={styles.login}>
        <form className={styles.loginForm}>
          <div className={styles.title}><h1>Log In</h1></div>
          <div className={styles.formControl}>
              <input id="email" type="email" placeholder="Email" />
              <small></small>
              <span></span>
          </div>
          <div className={styles.formControl}>
              <input id="password" type="password" placeholder="Password" />
              <small></small>
              <span></span>
          </div>
          <button type="submit" className={styles.submitButton}>Log In</button>
          <div className={styles.forgetPassword}><a href="#">Forget password?</a></div>
          <div className={styles.signupNow}><Link to="/signup" className={styles.signupLink}>Sign Up now!</Link></div>
        </form>
      </div>
    );
}

export default LogIn
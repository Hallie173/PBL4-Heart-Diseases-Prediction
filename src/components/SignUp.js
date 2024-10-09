import React from "react";
import styles from "./SignUp.module.css";
import { Link } from 'react-router-dom';

function SignUp() {
    return (
        <div className={styles.signup}>
        <form className={styles.signupForm}>
        <div className={styles.title}><h1>Sign Up</h1></div>
            <div className={styles.formControl}>
                <input id="first-name" type="text" placeholder="First Name" />
                <small></small>
                <span></span>
            </div>
            <div className={styles.formControl}>
                <input id="last-name" type="text" placeholder="Last Name" />
                <small></small>
                <span></span>
            </div>
            <div className={styles.formControl}>
                <input id="email" type="email" placeholder="Email" />
                <small></small>
                <span></span>
            </div>
            <div className={styles.formControl}>
                <input id="username" type="text" placeholder="Username" />
                <small></small>
                <span></span>
            </div>
            <div className={styles.formControl}>
                <input id="password" type="password" placeholder="Password" />
                <small></small>
                <span></span>
            </div>
            <div className={styles.formControl}>
                <input id="address" type="text" placeholder="Address" />
                <small></small>
                <span></span>
            </div>
            <div className={styles.formControlGender}>
                <label>
                <input type="radio" name="gender" value="male" /> Nam
                </label>
                <label>
                <input type="radio" name="gender" value="female" /> Nữ
                </label>
                <small></small>
                <span></span>
            </div>
            <div className={styles.formControl}>
                <input id="phone" type="tel" placeholder="Phone number" />
                <small></small>
                <span></span>
            </div>
            <button type="submit" className={styles.submitButton}>Log In</button>
            <div className={styles.loginNow}><span>Already have an account? </span><Link to="/login" className={styles.loginLink}>Log In now!</Link></div>
        </form>
        </div>
    );
}

export default SignUp
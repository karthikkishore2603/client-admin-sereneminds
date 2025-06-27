import React from "react";
import "./Auth.css";

const ForgotPassword = () => {
  return (
    <div className="auth-container">
      <div className="auth-illustration">
        <img
          src="/forgot.jpg"
          alt="Forgot Password Illustration"
        />
      </div>
      <div className="auth-form-section">
       <div className="auth-logo">
          <img
            src="/logo1.png"
            alt="Serene Minds Logo"
            style={{ height: "32px", verticalAlign: "middle" }}
          />
        </div>
        <h2>Forget Password</h2>
        <p>
          Enter your email and we'll send you instructions to reset your
          password.
        </p>
        <form className="auth-form">
          <label>Email</label>
          <input type="email" placeholder="Example@gmail.com" required />
          <button type="submit" className="auth-btn">
            Continue
          </button>
        </form>
        <div className="auth-footer">
          <a href="/login" className="auth-link">
            &lt; Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

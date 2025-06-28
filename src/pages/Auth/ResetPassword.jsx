import React from "react";
import "./Auth.css";

const ResetPassword = () => {
  return (
    <div className="auth-container">
      <div className="auth-illustration">
        <img src="/reset.jpg" alt="Reset Password Illustration" />
      </div>
      <div className="auth-form-section">
        <div className="auth-logo">
          <img
            src="/logo.png"
            alt="Serene Minds Logo"
            style={{ height: "32px", verticalAlign: "middle" }}
          />
        </div>
        <h2>Reset Password</h2>
        <p>
          Your new password must be different from previously used passwords
        </p>
        <form className="auth-form">
          <label>New Password</label>
          <input type="password" placeholder="Password" required />
          <label>Confirm Password</label>
          <input type="password" placeholder="Password" required />
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

export default ResetPassword;

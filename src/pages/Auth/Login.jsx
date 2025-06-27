import React from "react";
import "./Auth.css";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-illustration">
        <img src="/login.jpg" alt="Login Illustration" />
      </div>
      <div className="auth-form-section">
        <div className="auth-logo">
          <img
            src="/logo1.png"
            alt="Serene Minds Logo"
            style={{ height: "32px", verticalAlign: "middle" }}
          />
        </div>
        <h2>
          Welcome to Serene Minds!{" "}
          <span role="img" aria-label="wave">
            👋🏻
          </span>
        </h2>
        <p>Please sign-in to your account and start the adventure</p>
        <form className="auth-form">
          <label>Email</label>
          <input type="email" placeholder="Example@gmail.com" required />
          <div className="auth-form-row">
            <label>Password</label>
            <a href="/forgot-password" className="auth-link">
              Forgot Password?
            </a>
          </div>
          <input type="password" placeholder="Password" required />
          <div className="auth-form-row">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
          </div>
          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>
        <div className="auth-footer">
          <span>New on our platform?</span>
          <a href="/register" className="auth-link">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

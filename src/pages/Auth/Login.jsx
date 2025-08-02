import React, { useState } from 'react';
import './common.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        
        <div className="input-group">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type={showPass ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
          <span className="toggle-pass" onClick={() => setShowPass(!showPass)}>
            {showPass ? '🙈' : '👁️'}
          </span>
        </div>

        <button className="login-btn" type="submit">Login</button>

        <p className="login-footer">Don’t have an account? <a href="/register">Register</a></p>
      </form>
    </div>
  );
};

export default Login;

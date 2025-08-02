import React, { useState } from 'react';
import './common.css'; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleRegister}>
        <h2 className="login-title">Create Account</h2>

        <div className="input-group">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Full Name</label>
        </div>

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

        <div className="input-group">
          <input
            type={showPass ? 'text' : 'password'}
            required
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <label>Confirm Password</label>
        </div>

        {error && <p style={{ color: 'salmon', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

        <button className="login-btn" type="submit">Register</button>

        <p className="login-footer">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;

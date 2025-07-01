import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase"; 
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.css';

const Login = () => {
  const [email, setEmails] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);  
  const navigate = useNavigate();

  const handlePasswordToggle = () => {
    setShowPassword(prev => !prev);  
  };

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      await axios.post('https://gmailclone-rjhk.onrender.com/login-track', {
        userId: email
      });

      navigate("/all-mail", { state: { password } }); 
    } catch (error) {
      setError('Login failed: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={signIn}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmails(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email" 
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={handlePasswordToggle}
              id="show-password"
              style={{ cursor: "pointer" }}
            />
            <label htmlFor="show-password" style={{ marginLeft: 10, cursor: "pointer" }}>
              Show password
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Sign In</button>
        </form>
        <p>
          Not a member? <NavLink to="/signup">Sign Up</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;

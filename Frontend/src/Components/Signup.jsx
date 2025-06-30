import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import './Signup.css';

const Signup = () => {
    const [email, setEmails] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await fetch('https://gmailclone-rjhk.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: email,
                    password: password,
                }),
            });
            toast.success('User Registered Successfully', { position: 'top-center' });
            navigate('/');
        } catch (error) {
            setError('Signup failed: ' + error.message);
        }
    };

    const handleAppPasswordGuide = () => {
        window.open('https://myaccount.google.com/apppasswords', '_blank');
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp}>
                    <div className="input-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmails(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="input-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your app password"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>

                <div className="app-password-section">
                    <p className="note">
                        <strong>Note:</strong> Generate an App Password from your Google account and use it here.
                    </p>
                    <button onClick={handleAppPasswordGuide} className="app-password-button">
                        Generate App Password
                    </button>
                </div>

                <p>Already a member? <NavLink to="/">Login</NavLink></p>
            </div>
        </div>
    );
};

export default Signup;

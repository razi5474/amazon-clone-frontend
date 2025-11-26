import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth, provider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import "./style/Auth.css";
import AmazonLogo from "../assets/Amazon.png";
import GoogleIcon from "../assets/google.png";
import { useNavigate } from "react-router-dom";



const Login = () => {
  const { loginUser, googleLoginUser } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // field errors
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" }); // clear field error while typing
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};
  if (!form.email) newErrors.email = "Email is required";
  if (!form.password) newErrors.password = "Password is required";
  else if (form.password.length < 6 || form.password.length > 12)
    newErrors.password = "Password must be between 6 and 12 characters";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    Object.values(newErrors).forEach((msg) => toast.error(msg));
    return;
  }

  const res = await loginUser(form); // ✅ Now returns {success, message}
  if (res.success) {
    toast.success(res.message);
    navigate("/") // redirect on success
  } else {
    setErrors({ password: res.message }); // show error under password
    toast.error(res.message);
  }
};
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await googleLoginUser({
        name: user.displayName,
        email: user.email,
        googleId: user.uid,
      });

      toast.success("Google login successful!");
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed!");
    }finally {
    setLoading(false); // stop loading
  }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-wrapper">
        <img src={AmazonLogo} alt="Amazon" className="auth-top-logo" />
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Sign-In</h2>

        <form onSubmit={handleSubmit}>
          <label>Email </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="auth-error">{errors.email}</p>}

          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "14px",
                color: "#555",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {errors.password && <p className="auth-error">{errors.password}</p>}

          <button className="auth-btn" type="submit">
            Continue
          </button>
        </form>

        <p className="auth-dummy">
          By continuing, you agree to Amazon’s <a href="#">Conditions of Use</a> and{" "}
          <a href="#">Privacy Notice</a>.
        </p>

        <div className="divider">New to Amazon?</div>

        <button className="create-btn" onClick={() => (window.location.href = "/register")}>
          Create your Amazon account
        </button>

        <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
          <img src={GoogleIcon} alt="Google" className="google-icon" />
          Sign in with Google
        </button>
      </div>

      <footer className="auth-footer">
        <a href="#">Conditions of Use</a>
        <a href="#">Privacy Notice</a>
        <a href="#">Help</a>
        <span>© 1996-2025, Amazon.com, Inc. or its affiliates</span>
      </footer>
    </div>
  );
};

export default Login;

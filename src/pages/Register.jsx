import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth, provider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import "./style/Auth.css";
import AmazonLogo from "../assets/Amazon.png";
import GoogleLogo from "../assets/google.png";
import toast from "react-hot-toast";  
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { registerUser, googleLoginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Live password validation
    if (name === "password") {
      if (value.length < 6)
        setErrors({ ...errors, password: "Password must be at least 6 characters" });
      else if (value.length > 12)
        setErrors({ ...errors, password: "Password must be less than 12 characters" });
      else setErrors({ ...errors, password: "" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password)
      newErrors.password = "Password is required";
    else if (form.password.length < 6 || form.password.length > 12)
      newErrors.password = "Password must be between 6 and 12 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((msg) => toast.error(msg));
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(form);
      if (res.success) {
        toast.success(res.message);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(res.message);
        setErrors({ email: res.message });
      }
    } catch (err) {
      toast.error("Registration failed!");
    } finally {
      setLoading(false);
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
      navigate("/"); // redirect to home
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-wrapper">
        <img src={AmazonLogo} alt="Amazon" className="auth-top-logo" />
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <label>Your name</label>
          <input
            type="text"
            name="name"
            placeholder="First and last name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="auth-error">{errors.name}</p>}

          <label>Email</label>
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
              placeholder="At least 6 characters"
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

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create your Amazon account"}
          </button>
        </form>

        <p className="auth-dummy">
          By creating an account, you agree to Amazon’s{" "}
          <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
        </p>

        <div className="divider">Already have an account?</div>

        <button
          className="create-btn"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Sign-In
        </button>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <img src={GoogleLogo} alt="Google" className="google-icon" />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>

      <div className="auth-footer">
        <a href="#">Conditions of Use</a>
        <a href="#">Privacy Notice</a>
        <a href="#">Help</a>
      </div>
    </div>
  );
};

export default Register;

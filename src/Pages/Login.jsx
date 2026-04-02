import React, { useState, useContext } from "react";   // ✅ merged import
import "../Components/PagesCss/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Services/AuthServices";
import { AuthContext } from "../Context/AuthContext";




function Login() {

  const navigate = useNavigate();

  // ✅ Get setUser from context
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ UPDATED HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser(form);

      console.log("Full Response:", res.data);

      const user = res.data?.data?.user;
      const token = res.data?.data?.accessToken;

      if (!token || !user) {
        alert("Login failed: Missing data");
        return;
      }

      // ✅ Store in localStorage (cache)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥🔥 MOST IMPORTANT LINE (YOUR SYNC FIX)
      setUser(user);   // ✅ instant update to Navbar

      alert("Login Successful ✅");

      navigate("/dashboard");

    } catch (error) {
      console.log("Error:", error.response?.data || error.message);

      alert(
        error.response?.data?.message || "Invalid email or password ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <p>
          Don't have an account?
          <Link to="/register" className="register-link"> Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
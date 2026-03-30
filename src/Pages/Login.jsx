import React, { useState } from "react";
import "../Components/PagesCss/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Services/AuthServices";

function Login() {
 
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ FIXED HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      console.log("Full Response:", res.data);

      // ✅ Correct token from backend
      const token = res.data?.data?.accessToken;

      if (!token) {
        alert("Token not received");
        return;
      }

      // ✅ Save token
      localStorage.setItem("token", token);

        // 🔥 ADD THIS LINE HERE
      window.dispatchEvent(new Event("storage"));

      // ✅ Save user (optional but useful)
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      // ✅ Redirect
      navigate("/dashboard");

    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      alert("Invalid email or password");
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

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? 
          <Link to="/register" className="register-link"> Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
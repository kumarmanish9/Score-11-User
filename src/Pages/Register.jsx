import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Components/PagesCss/Register.css";
import { registerUser } from "../Services/AuthServices";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    // ✅ MUST BE INSIDE COMPONENT
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const payload = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password
        };

        try {
            const res = await registerUser(payload);
            console.log(res.data);

            alert("Registration Successful ✅");
            navigate("/login");

        } catch (error) {
            console.log("FULL ERROR:", error);
            console.log("BACKEND ERROR:", error.response?.data);

            alert(error.response?.data?.message || "Registration Failed ❌");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter Phone Number"
                        value={form.phone}
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

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">Register</button>
                </form>

                <p>
                    Already have an account?{" "}
                    <Link to="/login" className="login-link">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
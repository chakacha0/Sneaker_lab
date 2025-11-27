import React, { useState } from "react";
import { registerUser } from "../api/users";

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(form);
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const formStyle = {
  maxWidth: "420px",
  margin: "60px auto",
  padding: "40px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  fontFamily: "'Archivo Black', sans-serif",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#333",
};

const inputStyle = {
  padding: "12px 16px",
  fontSize: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  outline: "none",
  transition: "border-color 0.3s",
};

const buttonStyle = {
  padding: "14px",
  fontSize: "16px",
  fontWeight: "bold",
  backgroundColor: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const messageStyle = {
  marginTop: "10px",
  fontSize: "14px",
  color: "#d00",
};


  return (
    <div style={formStyle}>
  <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "10px" }}>REGISTRATION</h2>
  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
    <div style={inputContainerStyle}>
      <label style={labelStyle}>Email</label>
      <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
    </div>
    <div style={inputContainerStyle}>
      <label style={labelStyle}>Password</label>
      <input type="password" name="password" value={form.password} onChange={handleChange} required style={inputStyle} />
    </div>
    <div style={inputContainerStyle}>
      <label style={labelStyle}>First name</label>
      <input type="text" name="first_name" value={form.first_name} onChange={handleChange} style={inputStyle} />
    </div>
    <div style={inputContainerStyle}>
      <label style={labelStyle}>Last name</label>
      <input type="text" name="last_name" value={form.last_name} onChange={handleChange} style={inputStyle} />
    </div>
    <div style={inputContainerStyle}>
      <label style={labelStyle}>Phone number</label>
      <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} style={inputStyle} />
    </div>
    <button type="submit" style={buttonStyle}>Registration</button>
  </form>
  {message && <p style={messageStyle}>{message}</p>}
</div>

  );
}

export default Register;

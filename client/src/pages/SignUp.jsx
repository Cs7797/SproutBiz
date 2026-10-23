import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./authStyle.css";

export default function SignUp() {
  const [formdata, setformdata] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    });
    const data = await res.json();
    if (data.success == false) {
      alert("something went wrong");
      return;
    } else {
      navigate("/signin");
    }
  };

  return (
   
      <div className="login-box mt-80 sm:w-[500px]">
        <h2 className="font-bold text-3xl">SIGN UP</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="text"
              name="userName"
              placeholder="Enter your name"
              onChange={handleChange}
              autoComplete="off"
              required
            />
            <label>Username</label>
          </div>
          <div className="user-box">
            <input
              type="text"
              name="email"
              placeholder="Enter your Email"
              onChange={handleChange}
              autoComplete="off"
              required
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              required
              onChange={handleChange}
            />
            <label>Password</label>
          </div>
          <div className="">
            <button type="submit" className="auth " href="#">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              SignUp
            </button>
            <p className="login-text">
              Already have an Account ?{" "}
              <span>
                <a href="/signin" className="login-link">
                  Login
                </a>
              </span>
            </p>
          </div>
        </form>
      </div>
    
  );
}

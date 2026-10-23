import { useState } from "react";
import "./authStyle.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFail,
  signInSuccess,
} from "../redux/user/userSlice";
export default function SignIn() {
  const [formdata, setFormData] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFail(data.message));
        console.log(error);
        return;
      }
      dispatch(signInSuccess(data));
    
      if (data.isAdmin==true) navigate("/adminProfile");
      else navigate("/profile");
    } catch (error) {
      dispatch(signInFail(error.message));
    }
  };
  return (
    <div className="login-box mt-80 sm:w-[500px]">
      <h2 className="font-bold text-3xl">LOGIN</h2>
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input
            type="email"
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
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>
        <div className="">
          <button type="submit" className="auth " href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {loading ? "Loading..." : "LogIn"}
          </button>
          <p className="login-text">
            Not have an Account ?{" "}
            <span>
              <a href="/signup" className="login-link">
                SignUp
              </a>
            </span>
          </p>
          {error && <p className="error">{error}</p>}
        </div>
      </form>
    </div>
  );
}

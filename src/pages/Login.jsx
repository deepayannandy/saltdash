import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginImg from "../assets/login.png";
import LogoImg from "../assets/logo.png";
import { Link } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import axios from "axios";
import swal from "sweetalert";

const Login = () => {
  const [errormessage, setErrormessage] = useState("Sign In");
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (localStorage.getItem("userinfo")) {
      navigate("/dashboard");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const receivedData = Object.fromEntries(data.entries());
    axios
      .post(`${baseUrl}/api/user/login/`, receivedData, {
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
      .then((data) => {
        localStorage.setItem("userinfo", data.data);
        localStorage.setItem("username", receivedData.email);
        window.location.reload(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data["message"] !== undefined) {
            setErrormessage(error.response.data["message"]);
            swal("Oho! \n" + error.response.data["message"], {
              icon: "error",
            });
          }
        }
      });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={LoginImg} alt="" />
      </div>
      <div className="bg-teal-600 flex flex-col justify-center">
        <form
          className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg"
          onSubmit={handleSubmit}
        >
          <img className="" src={LogoImg} alt="" />
          <h3 className="text-l dark:text-white text-white text-center">
            {errormessage}
          </h3>
          <div className="flex flex-col text-gray-400 py-2">
            <label>User Name</label>
            <input
              name="email"
              className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
              type={"email"}
              required
            />
          </div>
          <div className="flex flex-col text-gray-400 py-2">
            <label>Password</label>
            <input
              name="password"
              className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
              type={"password"}
              required
            />
          </div>
          <div className="flex justify-between text-gray-400 py-2">
            {/* <p className='flex items-center'><input name="iskeeplogin" className='mr-2' type="checkbox"/>Remember Me</p> */}
            <p>
              <span className="text-bold">
                {" "}
                <Link to="/ForgotPassword" element={<ForgotPassword />}>
                  Forgot Password
                </Link>
              </span>
            </p>
          </div>
          <button
            className="w-full my-5 py-2 bg-teal-600 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-xs rounded-lg"
            type="submit"
          >
            Sign In
          </button>
          <div className=" text-gray-400 py-2">
            <p className="text-center"> Ⓒ Salt World</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

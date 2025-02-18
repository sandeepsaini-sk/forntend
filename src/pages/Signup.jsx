import React, { useState } from "react";
import logo from "../assets/logo3.png";
import { Link, useNavigate} from "react-router-dom";
import { BiHide, BiShowAlt } from "react-icons/bi";
import {toast } from 'react-toastify';
import { useAuth } from "../redux/auth";
import Footer from "../components/Footer";
export default function Signup() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const {storeTokeninls}=useAuth();
  const [showpass, setshowpass] = useState(false);
  const [userdata, setuserdata] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const userhandeler = (e) => {
    const { name, value } = e.target;
    setuserdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const submithandler=async(e)=>{
    console.log(userdata)
    e.preventDefault();
     const{username,email,phone,password}=userdata;
     if(username && email && phone && password){
     try{
    const response=await fetch(`${backendURL}/api/signup`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify(userdata),
    });
    const Response = await response.json();
    console.log("server Response:", Response);
    // Store token
    
      
    if (Response.alert) {
      toast.success(Response.message);
      setuserdata({  username: "",
        email: "",
        password: "",
        phone: "",})
       storeTokeninls(Response.token ,Response.username,Response.email);
  
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }

    
  } catch (error) {
    console.error("Error:", error);
  }
     }else{
      toast.error("enter ther required fileds")
     }

    
  }
  return (
    <>
      <div className="">
       
        <div className="max-w-md shadow-lg m-auto bg-slate-200 flex flex-col mt-10 justify-between gap-5 p-4 pb-10">
          {/*logo part*/}
          <div className="flex flex-col items-center">
            <img src={logo} alt="" className="max-w-[50%] " />
            <div className="text-3xl font-bold">Signup</div>
          </div>
   
          {/*form part*/}

          <form action="" className="flex flex-col gap-3 " onSubmit={submithandler}>
          {["username", "email", "phone"].map((field, index) => (
            <div key={index} className="flex flex-col gap-1">
              <label htmlFor={field} className="text-xl font-semibold capitalize">
                {field}
              </label>
              <input
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                id={field}
                name={field}
                placeholder={`Enter your ${field}`}
                value={userdata[field]}
                onChange={userhandeler}
                className="text-lg bg-amber-50 p-2 outline-blue-600 rounded-2xl"
              />
            </div>
          ))}
            {/*password*/}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-xl font-semibold p-1">
                Password
              </label>
              <div className="flex items-center  text-lg bg-amber-50 border border-blue-600 rounded-2xl">
                <input
                  type={showpass ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter the password"
                  value={userdata.password}
                  onChange={userhandeler}
                  className="text-lg bg-amber-50 p-2 w-full outline-none rounded-2xl"
                />
                {/*show and hide section */}
                <span
                  onClick={() => setshowpass((prev) => !prev)}
                  className="text-3xl"
                >
                  {showpass ? <BiShowAlt /> : <BiHide />}
                </span>
              </div>
            </div>
            {/*submit button*/}
            <div className="max-w-1/2 m-auto mt-5">
              <button className="text-xl font-semibold bg-blue-500 hover:bg-blue-600 hover:scale-105 px-14 py-2 rounded-full m-auto">
                Signup
              </button>
            </div>
            <div className="text-center mt-4">
              account already create?
              <Link to={"/login"} className="text-blue-700 font-medium text-lg">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
}

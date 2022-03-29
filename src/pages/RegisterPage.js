import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const register = async() => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password)
      console.log(result);
      setLoading(false);
      toast.success("User created successfully");
      setEmail("");
      setPassword("");
      setCpassword(""); 
    } catch (error) {
        console.log(error)
        toast.error('Registration failed');
        setLoading(false);
    }
  }

  return (
    <div className="register-parent">
      {loading && (<Loader/>)}
      <div className="register-top"></div>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <lottie-player
            src="https://assets6.lottiefiles.com/private_files/lf30_otdghgza.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
        <div className="col-md-4 z1">
          <div className="register-form">
            <h2>Register</h2>
            <hr />
            <input type="email" 
              className="form-control" 
              placeholder="email" 
              value={email} 
              onChange={(e) => {setEmail(e.target.value)}} />
            <input type="password" 
              className="form-control" 
              placeholder="password" 
              value={password} 
              onChange={(e) => {setPassword(e.target.value)}} />
            <input type="password" 
              className="form-control" 
              placeholder="confirm password" 
              value={cpassword} 
              onChange={(e) => {setCpassword(e.target.value)}} />

              <button className="my-3" onClick={register}>REGISTER</button>
              <hr />
              <Link to='/login' >Click Here To Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

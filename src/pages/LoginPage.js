import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const login = async() => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password)
      localStorage.setItem("currentUser", JSON.stringify(result));
      setLoading(false);
      toast.success("Login successfully");
      window.location.href = "/";
    } catch (error) {
        console.log(error)
        toast.error('Login failed');
        setLoading(false);
    }
  }

  return (
    <div className="login-parent">
      {loading && (<Loader/>)}
      <div className="row justify-content-center">
        <div className="col-md-4 z1">
          <div className="login-form">
            <h2>Login</h2>
            <hr />
            <input
              type="email"
              className="form-control"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <button className="my-3" onClick={login}>Login</button>
            <hr />
            <Link to='/register' >Click Here To Register</Link>
          </div>
        </div>
        <div className="col-md-5 z1">
          <lottie-player
            src="https://assets6.lottiefiles.com/private_files/lf30_otdghgza.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>
      <div className="login-bottom"></div>
    </div>
  );
};

export default LoginPage;

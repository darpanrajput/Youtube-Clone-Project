import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./signin.scss";
import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "../../redux/userSlice";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import GoogleIcon from "@mui/icons-material/Google";

import { useNavigate } from "react-router-dom";
const Signin = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInHandle = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post("/auths/signin", { email, password });
      console.log(res.data);
      console.log("signin response=", res);
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(loginFailed());
    }
  };

  const signinWithGoogle = async () => {
    dispatch(loginStart());
    await signInWithPopup(auth, provider)
      .then((result) => {
        // console.log("Signin with google ", result);
        axios
          .post("/auths/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess(res.data));
            navigate("/");
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch(loginFailed());
      });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("signed up buttton");
    dispatch(loginStart());
    try {
      const res = await axios.post("/auths/signup", {
        name: username,
        email: email,
        password: password,
      });
      console.log(res.data);
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(loginFailed());
    }
  };

  return (
    <div className={isDark ? "Signin-Container" : "Signin-Container Light"}>
      <div className={isDark ? "Signin-Wrapper" : "Signin-Wrapper Light"}>
        <h1 className="Signin-Title">Sign in</h1>
        <h2 className="Signin-SubTitle">To continue watching</h2>
        <input
          type="email"
          placeholder="email"
          className={isDark ? "Signin-Input" : "Signin-Input Light"}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className={isDark ? "Signin-Input" : "Signin-Input Light"}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={isDark ? "Signin-Button" : "Signin-Button Light"}
          onClick={signInHandle}
        >
          Sign in
        </button>
        <h1 className="Signin-Title">or</h1>

        <button
          className={
            isDark ? "Signin-Button Google" : "Signin-Button Light Google"
          }
          onClick={() => signinWithGoogle()}
        >
          <GoogleIcon style={{ color: isDark ? "white" : "black" }} />
          Signin with google
        </button>
        <h1 className="Signin-Title">or</h1>
        {/* Registration for element */}
        <input
          type="text"
          placeholder="username"
          className={isDark ? "Signin-Input" : "Signin-Input Light"}
          onChange={(e) => setUserName(e.target.value.trim())}
        />
        <input
          type="email"
          placeholder="Email"
          className={isDark ? "Signin-Input" : "Signin-Input Light"}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className={isDark ? "Signin-Input" : "Signin-Input Light"}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="confirm password"
          className={isDark ? "Signin-Input" : "Signin-Input Light"}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={isDark ? "Signin-Button" : "Signin-Button Light"}
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </div>

      <div className="Signin-More">
        <span className="Signin-Link">English(US)</span>

        <div className="Signin-Links">
          <span className="Signin-Link">Help</span>
          <span className="Signin-Link">Privacy Policy</span>
          <span className="Signin-Link">Terms</span>
        </div>
      </div>
    </div>
  );
};

export default Signin;

import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_KEY;

const Loginpage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(e) {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      res.json().then((userInfo) => {
        setUserInfo(userInfo);
        toast.success("Login Successfull !");
        setRedirect(true);
      });
    } else {
      toast.error("Wrong Credentials !");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={login} className="login">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  );
};

export default Loginpage;

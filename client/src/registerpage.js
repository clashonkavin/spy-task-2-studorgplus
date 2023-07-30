import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserRegister = () => {
  const [Name, setName] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [msgtyp, setMsgtyp] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    const data = { name: Name, username: Username, password: Password };
    axios
      .post("http://localhost:5000/auth/register", data, {
        withCredentials: true,
      })
      .then((res) => {
        const { data } = res;
        setMessage(data.message);
        setMsgtyp(data.msg_type);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <h1>Registration</h1>
      <form onSubmit={handleRegister}>
        <div className="data">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            required
            onChange={(event) => {
              setName(event.target.value);
            }}
          ></input>
        </div>
        <div className="data">
          <label htmlFor="username">Username</label>
          <input
            type="email"
            id="username"
            required
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          ></input>
        </div>
        <div className="data">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          ></input>
        </div>
        <div className="btn">
          <button type="submit">Register</button>
        </div>
      </form>
      <div className={msgtyp}>{message} </div>
      <div className="signup-link">
        Already a Member? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default UserRegister;

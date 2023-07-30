import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const getProfile = async () => {
    const response = await axios.get("http://localhost:5000/profile", {
      withCredentials: true,
    });
    setData(response.data);
  };

  const handlelogout = async () => {
    axios
      .get("http://localhost:5000/auth/logout", {
        withCredentials: true,
      })
      .then(() => {
        console.log("logout successful");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProfile();
    axios
      .get("http://localhost:5000/check-auth", { withCredentials: true })
      .then((res) => {
        if (res.data === "notloggedin") {
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <nav className="navbar">
      <Link to="/home">
        <div className="logo">Student Organizer Plus</div>
      </Link>
      <div className="menu">
        <Link to="/events">Calendar</Link>
        <Link to="/home">{data.name} (Profile)</Link>
        <Link onClick={handlelogout}>Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;

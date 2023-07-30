import { useState, useEffect } from "react";
import axios from "axios";

const Assignment = ({ handleCloseForm }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  const [dat, setDat] = useState({});
  const [options, setOptions] = useState([]);
  const [depts, setdepts] = useState([]);
  const [name, setname] = useState();
  const [branch, setBranch] = useState();
  const [sem, setSem] = useState();
  const [course, setCourse] = useState();
  const [due, setDue] = useState();
  const [message, setMessage] = useState("");
  const [msgtyp, setMsgtyp] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/assignment/courses",
          {
            withCredentials: true,
          }
        );
        const data = response.data.response;
        setDat(data);
        const items = Object.keys(data);
        setdepts(items);
        setOptions(data[items[0]][1]);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleBranch = (e) => {
    e.preventDefault();
    var temp = e.target.value;
    setBranch(temp);
  };

  const handleSem = (e) => {
    e.preventDefault();
    var temp = e.target.value;
    setSem(temp);
  };

  useEffect(() => {
    if (dat && dat[branch] && dat[branch][sem]) {
      setOptions(dat[branch][sem]);
    }
  }, [sem, branch, dat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: name,
      branch: branch,
      sem: sem,
      course: course,
      due: due,
    };
    if (!name || !branch || !course || !sem || !due) {
      setMessage("Fill in the required details");
      setMsgtyp("error");
    } else {
      axios
        .post("http://localhost:5000/assignment/create", data, {
          withCredentials: true,
        })
        .then((res) => {
          const { data } = res;
          if (data.msg_type === "success") {
            setMessage("Assignment Appended");
            setMsgtyp("success");
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const form = (
    <div className="inputBox">
      <h1>Create Assignment</h1>

      <form onSubmit={handleSubmit}>
        <div className="data">
          <label htmlFor="assname">Assignment Name</label>
          <input
            type="text"
            id="assname"
            required
            onChange={(event) => {
              setname(event.target.value);
            }}
          />
        </div>
        <div className="data">
          <label htmlFor="branch">Department</label>
          <select
            type="text"
            id="branch"
            required
            onChange={(e) => {
              handleBranch(e);
            }}
          >
            <option value="">Please select</option>
            {depts.map((title) => (
              <option value={title} key={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <div className="data">
          <label htmlFor="Semester">Semester</label>
          <select type="text" id="Semester" required onChange={handleSem}>
            <option value="">Please select</option>
            {numbers.map((title) => (
              <option value={title} key={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <div className="data">
          <label htmlFor="Course">Course</label>
          <select
            type="text"
            id="Course"
            required
            onChange={(e) => {
              setCourse(e.target.value);
            }}
          >
            <option value="">Please select</option>
            {Object.keys(options).map((title) => (
              <option value={title} key={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <div className="data">
          <label htmlFor="Due">Due date</label>
          <input
            type="date"
            id="Due"
            required
            onChange={(e) => {
              setDue(e.target.value);
            }}
          />
        </div>
        <div className="btn">
          <button type="submit">Create</button>
          <button type="button" onClick={handleCloseForm}>
            Close
          </button>
        </div>
        <div className={msgtyp}>{message} </div>
      </form>
    </div>
  );

  return <div>{form}</div>;
};

export default Assignment;

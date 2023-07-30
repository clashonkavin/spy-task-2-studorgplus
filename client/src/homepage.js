import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import { ReactComponent as TickIcon } from "./tick-icon.svg";
import Assignment from "./createAssignment";

const Home = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("radio-1");

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.id);
  };

  const AssignmentsContent = () => {
    const [isPending, setisPending] = useState(true);
    const [asses, setAsses] = useState([]);
    const currDate = new Date();

    const handleDelete = (index, id) => {
      setAsses((prevAsses) => {
        const updatedAsses = [...prevAsses];
        updatedAsses.splice(index, 1);
        return updatedAsses;
      });
      axios.post(
        "http://localhost:5000/assignment/mark-complete",
        { id },
        { withCredentials: true }
      );
    };

    useEffect(() => {
      axios
        .post(
          "http://localhost:5000/assignment/due-tasks",
          { currDate },
          { withCredentials: true }
        )
        .then((res) => {
          // console.log(res.data);
          const formattedtimeOverAssignments = res.data.timeOver.map((item) => {
            if (item.state === "incomplete") {
              return {
                id: item._id,
                name: item.name,
                sem: item.sem,
                branch: item.branch,
                course: item.course,
                due: item.due,
                status: "timeOver",
              };
            }
            return null;
          });
          const formattedtimeLeftAssignments = res.data.timeLeft.map((item) => {
            if (item.state === "incomplete") {
              return {
                id: item._id,
                name: item.name,
                sem: item.sem,
                branch: item.branch,
                course: item.course,
                due: item.due,
                status: "timeLeft",
              };
            }
            return null;
          });
          setisPending(false);
          setAsses(
            [
              ...formattedtimeOverAssignments,
              ...formattedtimeLeftAssignments,
            ].filter(Boolean)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);

    const [showEventForm, setShowEventForm] = useState(false);

    const handleShowForm = () => {
      setShowEventForm(true);
    };

    const handleCloseForm = () => {
      setShowEventForm(false);
    };
    return (
      <div>
        <div className="showcontent">
          {isPending ? (
            <div className="loading-card">Loading...</div>
          ) : (
            <div>
              {asses.length === 0 ? (
                <div className="no-events-card">No assignments Left {":)"}</div>
              ) : (
                <div className="events-card">
                  <h2 className="head">Pending Assignments</h2>
                  <ul className="event-list">
                    {asses.map((event, index) => (
                      <li key={index} className={`event-card ${event.status}`}>
                        <strong>{event.name}</strong>
                        <br />
                        <span>Semester : {event.sem}</span>
                        <span>Branch : {event.branch}</span>
                        <span>Course : {event.course}</span>
                        <br />
                        <span>
                          DueDate: {new Date(event.due).toLocaleString()}
                        </span>
                        <button
                          className="completed"
                          onClick={() => handleDelete(index, event.id)}
                        >
                          {"         Completed"}
                          <span className="tick-icon">
                            <TickIcon />
                          </span>
                        </button>
                        {event.status === "timeLeft" && (
                          <p className="status">You got some time {": )"}</p>
                        )}
                        {event.status === "timeOver" && (
                          <p className="status">Due date Over {":'("}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <button className="addassignment" onClick={handleShowForm}>
            Add Assignment
          </button>
        </div>
        {showEventForm && <Assignment handleCloseForm={handleCloseForm} />}
      </div>
    );
  };

  const EventsContent = () => {
    const [isPending, setisPending] = useState(true);
    const [gevents, setEvents] = useState([]);

    const getEvents = (startDate, endDate) => {
      axios
        .post(
          "http://localhost:5000/gclndr/get-event",
          { startDate, endDate },
          { withCredentials: true }
        )
        .then((res) => {
          // console.log(res.data);
          const formattedEvents = res.data.map((item) => {
            if (item.colorId === "9") {
              return {
                title: item.summary,
                description: item.description,
                location: item.location,
                start: item.start.dateTime,
                end: item.end.dateTime,
              };
            }
            return null;
          });
          console.log(formattedEvents);
          setisPending(false);
          setEvents(formattedEvents.filter(Boolean));
        })
        .catch((error) => {
          console.log(error);
        });
    };

    useEffect(() => {
      const today = new Date();
      const next2date = new Date(today);
      next2date.setDate(today.getDate() + 3);
      getEvents(
        today.toISOString().split("T")[0],
        next2date.toISOString().split("T")[0]
      );
    }, []);

    return (
      <div className="showcontent">
        {isPending ? (
          <div className="loading-card">Loading...</div>
        ) : (
          <div>
            {gevents.length === 0 ? (
              <div className="no-events-card">No events found.</div>
            ) : (
              <div className="events-card">
                <h2 className="head">Upcoming Events</h2>
                <ul className="event-list">
                  {gevents.map((event, index) => (
                    <li key={index} className="event-card">
                      <strong>Event: {event.title}</strong>
                      <br />
                      <span>Description: {event.description}</span>
                      <span>Location: {event.location}</span>
                      <br />
                      <span>
                        Time: {new Date(event.start).toLocaleString()} --{" "}
                        {new Date(event.end).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const NotificationsContent = () => (
    <div className="showcontent">Notifications Content</div>
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/check-auth", { withCredentials: true })
      .then((res) => {
        if (res.data === "notvalid") {
          console.log("invalid Token");
          navigate("/googleAuth");
        }
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="tagcont">
        <div className="tabs">
          <input
            type="radio"
            id="radio-1"
            name="tabs"
            checked={selectedOption === "radio-1"}
            onChange={handleRadioChange}
          />
          <label className="tab" htmlFor="radio-1">
            Assignments
          </label>
          <input
            type="radio"
            id="radio-2"
            name="tabs"
            checked={selectedOption === "radio-2"}
            onChange={handleRadioChange}
          />
          <label className="tab" htmlFor="radio-2">
            Events
          </label>
          <input
            type="radio"
            id="radio-3"
            name="tabs"
            checked={selectedOption === "radio-3"}
            onChange={handleRadioChange}
          />
          <label className="tab" htmlFor="radio-3">
            Notifications<span className="notification">2</span>
          </label>
          <span
            className="glider"
            style={{
              transform: `translateX(${
                (selectedOption.charAt(selectedOption.length - 1) - 1) * 100
              }%)`,
            }}
          ></span>
        </div>
      </div>
      {selectedOption === "radio-1" && <AssignmentsContent />}
      {selectedOption === "radio-2" && <EventsContent />}
      {selectedOption === "radio-3" && <NotificationsContent />}
    </div>
  );
};

export default Home;

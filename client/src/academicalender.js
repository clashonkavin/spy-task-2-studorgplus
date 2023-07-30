import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import plusImage from "./fotor_2023-7-25_20_9_54-fotor-20230725201025.png";

const Events = () => {
  const navigate = useNavigate();

  const calendarRef = useRef(null);
  const [isPending, setisPending] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [asses, setAsses] = useState([]);
  const [gevents, setEvents] = useState([]);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const year = dateObj.getFullYear().toString();
    console.log(`${year}-${month}-${day}`);
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e) => {
    setFailure(false);
    setSuccess(false);
    setWaiting(true);
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/gclndr/create-event",
        { summary, description, location, startDateTime, endDateTime },
        { withCredentials: true }
      )
      .then((response) => {
        setFailure(false);
        setSuccess(true);
        setWaiting(false);
        const newEvent = {
          title: summary,
          start: startDateTime,
          end: endDateTime,
        };
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        setSummary("");
        setDescription("");
        setLocation("");
        setStartDateTime("");
        setEndDateTime("");
      })
      .catch((error) => {
        setFailure(true);
        setSuccess(false);
        setWaiting(false);
        console.log(error);
      });
  };
  const handleDateClick = (arg) => {
    console.log(arg);
  };

  const updateDateRange = async () => {
    setisPending(true);
    if (calendarRef.current) {
      const fullCalendar = calendarRef.current.getApi();
      const view = fullCalendar.view;
      const startDate = view.currentStart;
      const endDate = view.currentEnd;
      getEvents(startDate, endDate);
    }
  };

  const [showEventForm, setShowEventForm] = useState(false);

  const handleShowForm = () => {
    setShowEventForm(true);
  };

  const handleCloseForm = () => {
    setShowEventForm(false);
  };

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
          return {
            title: item.summary,
            start: item.start.dateTime,
            end: item.end.dateTime,
          };
        });
        console.log(formattedEvents);
        setisPending(false);
        setEvents(formattedEvents);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/check-auth", { withCredentials: true })
      .then((res) => {
        if (res.data === "notvalid") {
          console.log("invalid Token");
          navigate("/googleAuth");
        }
      });

    //mark1
    const currDate = new Date();
    axios
      .post(
        "http://localhost:5000/assignment/due-tasks",
        { currDate },
        { withCredentials: true }
      )
      .then((res) => {
        const formattedtimeOverAssignments = res.data.timeOver.map((item) => {
          return {
            title: item.name,
            date: formatDate(item.due),
            backgroundColor: "red",
          };
        });
        const formattedtimeLeftAssignments = res.data.timeLeft.map((item) => {
          return {
            title: item.name,
            date: formatDate(item.due),
            backgroundColor: "red",
          };
        });
        console.log(formattedtimeOverAssignments);
        console.log(formattedtimeLeftAssignments);
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
    //mark2
    updateDateRange();
  }, [navigate]);

  return (
    <div className="App">
      <Navbar />
      <div className="clndr">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          weekends={true}
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={[...gevents, ...asses]}
          datesSet={updateDateRange}
        />
        {isPending && <span className="loading-card">Loading...</span>}
      </div>
      <div className="show-form-btn" onClick={handleShowForm}>
        <img src={plusImage} alt="gicon"></img>
      </div>

      {showEventForm && (
        <dialog open className="inputBox eventinput">
          <h1>Create Event</h1>
          <form onSubmit={handleSubmit}>
            <div className="data">
              <label htmlFor="summary">Summary</label>
              <input
                required
                type="text"
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              ></input>
            </div>
            <div className="data">
              <label htmlFor="descp">Description</label>
              <textarea
                required
                id="descp"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="data">
              <label htmlFor="loc">Location</label>
              <input
                required
                type="text"
                id="loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              ></input>
            </div>
            <div className="data">
              <label htmlFor="srtdate">Start DateTime</label>
              <input
                required
                type="datetime-local"
                id="srtdate"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              ></input>
            </div>
            <div className="data">
              <label htmlFor="endate">End DateTime</label>
              <input
                required
                type="datetime-local"
                id="endate"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
              ></input>
            </div>
            <div className="btn">
              <button type="submit">Create</button>
              <button type="button" onClick={handleCloseForm}>
                Close
              </button>
            </div>
          </form>
          {waiting && <div>Loading...</div>}
          {success && <div className="success">Event Creation Successful</div>}
          {failure && <div className="failure">Sorry, Server Error</div>}
        </dialog>
      )}
    </div>
  );
};

export default Events;

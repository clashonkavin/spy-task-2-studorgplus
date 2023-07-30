const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const Profile = require("../models/profileModel");
const axios = require("axios");
const { google } = require("googleapis");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

function convertFormat(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.calendarlist",
  ],
  prompt: "consent",
  version: "v3",
});

router.get("/Oauth2", (req, res) => {
  res.redirect(authUrl);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });
    await Profile.updateOne(
      { username: req.session.username },
      { $set: { refresh_token: response.data.refresh_token } }
    ).then(() => {
      console.log("RF_token update succesful");
      req.session.token = response.data.refresh_token;
      res.redirect("http://localhost:3000/events");
    });
  } catch (error) {
    console.log(error.data);
  }
});

router.post("/create-event", async (req, res) => {
  const { summary, description, location, startDateTime, endDateTime } =
    req.body;
  const profileInstance = await Profile.findOne({
    username: req.session.username,
  });
  oAuth2Client.setCredentials({ refresh_token: profileInstance.refresh_token });
  const calendar = google.calendar("v3");
  const response = await calendar.events.insert({
    auth: oAuth2Client,
    calendarId: "primary",
    requestBody: {
      summary: summary,
      description: description,
      location: location,
      colorId: 9,
      start: {
        dateTime: new Date(startDateTime),
      },
      end: {
        dateTime: new Date(endDateTime),
      },
    },
  });
  res.send(response);
});

router.post("/get-event", async (req, res) => {
  try {
    const profileInstance = await Profile.findOne({
      username: req.session.username,
    });

    oAuth2Client.setCredentials({
      refresh_token: profileInstance.refresh_token,
    });

    const calendar = google.calendar("v3");

    const response = await calendar.events.list({
      auth: oAuth2Client,
      calendarId: "primary",
      timeMin: new Date(convertFormat(req.body.startDate)).toISOString(),
      timeMax: new Date(convertFormat(req.body.endDate)).toISOString(),
      orderBy: "startTime",
      singleEvents: true,
      showDeleted: false,
    });

    res.send(response.data.items);
  } catch (error) {
    console.log("Error fetching events:", error.data);
  }
});

// router.post("/create-tokens", async (req, res) => {
//   try {
//     const { code } = req.body;
//     const response = await oAuth2Client.getToken(code);
//     res.send(response);
//     if (response.tokens.refresh_token) {
//       await Profile.updateOne(
//         { username: req.session.username },
//         { $set: { refresh_token: response.tokens.refresh_token } }
//       )
//         .then(console.log("RF token update succes"))
//         .catch((err) => console.log(err));
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;

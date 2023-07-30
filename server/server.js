const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Profile = require("./models/profileModel");
const { checkToken } = require("./utils/tokenCheck");

const dbURI =
  "mongodb+srv://clashonkavin:test1234@rocket.j9vwrao.mongodb.net/spidertask2?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
    cookie: { secure: false, path: "/", domain: "localhost" },
  })
);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const gclndr = require("./routes/gclndr");
app.use("/gclndr", gclndr);

const assignment = require("./routes/assignment");
app.use("/assignment", assignment);

app.get("/profile", async (req, res) => {
  const profileInstance = await Profile.findOne({
    username: req.session.username,
  });
  res.send(profileInstance);
});

app.get("/check-auth", async (req, res) => {
  if (req.session) {
    if (req.session.isLoggedIn) {
      const profileInstance = await Profile.findOne({
        username: req.session.username,
      });
      const valid = await checkToken(profileInstance.refresh_token);
      if (!profileInstance.refresh_token || !valid) {
        res.send("notvalid");
      }
    } else {
      res.send("notloggedin");
    }
  } else {
    res.send("notloggedin");
  }
});

app.listen(5000, () => console.log("Port Connected to 5000"));

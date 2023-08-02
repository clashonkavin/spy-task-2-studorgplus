const express = require("express");
const router = express.Router();
const Profile = require("../models/profileModel");
const Expense = require("../models/expenseModel");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const profileInstance = await Profile.findOne({
    username: req.body.username,
  });
  req.session.isLoggedIn = false;
  if (profileInstance) {
    if (await bcrypt.compare(req.body.password, profileInstance.password)) {
      req.session.isLoggedIn = true;
      req.session.name = profileInstance.name;
      req.session.username = profileInstance.username;
      req.session.userid = profileInstance._id.toString();
      return res.send({ message: "Login Successful", msg_type: "success" });
    } else {
      return res.send({ message: "Password Incorrect", msg_type: "error" });
    }
  } else {
    return res.send({ message: "No user with that Email", msg_type: "error" });
  }
});

router.post("/register", async (req, res) => {
  const profileInstance = await Profile.findOne({
    username: req.body.username,
  });
  if (profileInstance) {
    res.send({ message: "Email id  already Taken", msg_type: "error" });
  } else {
    const data = new Profile({
      name: req.body.name,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
    });
    const exp = new Expense({
      username: req.body.username,
    });
    data
      .save()
      .then((result) => {
        exp.save();
        res.send({ message: "Registration Successful", msg_type: "success" });
      })
      .catch((err) => console.log(err));
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("User logged OUT");
});

module.exports = router;

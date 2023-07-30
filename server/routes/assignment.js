const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Ass = require("../models/assignmentModel");

router.get("/courses", (req, res) => {
  const filePath = path.join(__dirname, "../utils", "courses.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      return res.status(500).send({ error: "Error reading data" });
    }

    try {
      const coursesData = JSON.parse(data);
      res.send({ response: coursesData });
    } catch (parseError) {
      console.log("Error parsing JSON:", parseError);
      res.status(500).send({ error: "Error parsing JSON data" });
    }
  });
});

router.post("/create", async (req, res) => {
  const data = new Ass({
    name: req.body.name,
    branch: req.body.branch,
    sem: req.body.sem,
    course: req.body.course,
    due: req.body.due,
  });
  data
    .save()
    .then((result) => {
      res.send({ msg_type: "success" });
    })
    .catch((err) => console.log(err));
});

router.post("/due-tasks", async (req, res) => {
  await Ass.find({ due: { $lt: req.body.currDate } })
    .then((data) => {
      lt = data;
    })
    .catch((err) => {
      console.log(err);
    });
  await Ass.find({ due: { $gt: req.body.currDate } })
    .then((data) => {
      gt = data;
    })
    .catch((err) => {
      console.log(err);
    });
  res.send({ timeOver: lt, timeLeft: gt });
});

router.post("/mark-complete", async (req, res) => {
  await Ass.updateOne({ _id: req.body.id }, { $set: { state: "completed" } })
    .then((data) => {
      lt = data;
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

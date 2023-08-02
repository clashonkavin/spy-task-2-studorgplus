const express = require("express");
const router = express.Router();
const expenses = require("../models/expenseModel");

router.get("/", async (req, res) => {
  await expenses.findOne({ username: req.session.username }).then((data) => {
    res.send(data);
  });
});

router.post("/add", async (req, res) => {
  await expenses
    .updateOne(
      { username: req.session.username },
      {
        $push: {
          transac: [Number(req.body.amount), req.body.categ, req.body.spentOn],
        },
        $inc: {
          ["cat_list.0." + req.body.categ + ".1"]: Number(req.body.amount),
        },
      }
    )
    .then((data) => {
      console.log(data);
      res.send("succes");
    })
    .catch((err) => console.log(err));
});

router.post("/update", async (req, res) => {
  await expenses
    .updateOne(
      { username: req.session.username },
      {
        $set: {
          ["cat_list.0." + req.body.updateCat + ".0"]: Number(req.body.limit),
        },
      }
    )
    .then((data) => {
      res.send("successfull");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/clear", async (req, res) => {
  console.log("4");
  await expenses
    .updateOne(
      { username: req.session.username },
      {
        $set: {
          transac: [],
          "cat_list.0.Tuition": [0, 0],
          "cat_list.0.Accomodation": [0, 0],
          "cat_list.0.Food": [0, 0],
          "cat_list.0.Clothes": [0, 0],
          "cat_list.0.Health": [0, 0],
          "cat_list.0.Phone": [0, 0],
          "cat_list.0.Travel": [0, 0],
          "cat_list.0.Entertainment": [0, 0],
          "cat_list.0.Misc": [0, 0],
          "cat_list.0.Stationary": [0, 0],
        },
      }
    )
    .then(res.send("suc"));
});

module.exports = router;

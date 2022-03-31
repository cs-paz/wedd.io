const express = require("express");
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const { getAllBars, getBarById } = require("../data/bars");

router.get("/", async (req, res) => {
  try {
    const bars = await getAllBars();
    res.json(bars);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const bar = await getBarById(id);
    res.json(bar);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;

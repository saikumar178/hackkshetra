const express =require("express");
const { readJSON } =require("../db/jsonStore.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await readJSON("assessments.json");
  res.json(data);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { readJSON, writeJSON } = require("../db/jsonStore.js");

router.post("/complete-course", async (req, res) => {
  const users = await readJSON("users.json");
  const user = users.find((u) => u.role === "guest");

  user.credits = (user.credits || 0) + 50;
  await writeJSON("users.json", users);

  res.json({ creditsEarned: 50 });
});

module.exports = router;

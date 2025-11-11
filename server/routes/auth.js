const express = require("express");
const router = express.Router();
const { readJSON, writeJSON } = require("../db/jsonStore.js");
const { v4: uuid } = require("uuid");

// ✅ Get guest profile
router.get("/profile", async (req, res) => {
  const users = await readJSON("users.json");

  let guest = users.find((u) => u.role === "guest");

  if (!guest) {
    guest = {
      id: uuid(),
      role: "guest",
      name: "Guest User",
      email: "guest@sarvasva.com",
      credits: 0,
      skills: [],
      bio: "",
      completedCourses: [],
      createdCourses: []
    };
    users.push(guest);
    await writeJSON("users.json", users);
  }

  res.json(guest);
});

// ✅ Update guest profile
router.put("/profile", async (req, res) => {
  const users = await readJSON("users.json");
  let guest = users.find((u) => u.role === "guest");

  guest = { ...guest, ...req.body };

  const index = users.findIndex((u) => u.id === guest.id);
  users[index] = guest;

  await writeJSON("users.json", users);
  res.json(guest);
});

module.exports = router;

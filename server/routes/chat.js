const express = require("express");
const router = express.Router();
const { readJSON, writeJSON } = require("../db/jsonStore.js");
const { v4: uuid } = require("uuid");

// ✅ Get chat for course
router.get("/course/:id", async (req, res) => {
  const chats = await readJSON("chats.json");
  const guestId = req.headers["x-guest-id"] || "guest";

  let chat = chats.find((c) => c.courseId === req.params.id);

  if (!chat) {
    chat = {
      id: uuid(),
      courseId: req.params.id,
      participants: [{ guestId }],
      messages: []
    };
    chats.push(chat);
    await writeJSON("chats.json", chats);
  }

  res.json(chat);
});

// ✅ Send message
router.post("/course/:id/message", async (req, res) => {
  const chats = await readJSON("chats.json");
  const guestId = req.headers["x-guest-id"] || "guest";

  let chat = chats.find((c) => c.courseId === req.params.id);

  if (!chat) return res.status(404).json({ message: "Chat not found" });

  const newMsg = {
    id: uuid(),
    guestId,
    message: req.body.message,
    timestamp: Date.now()
  };

  chat.messages.push(newMsg);
  await writeJSON("chats.json", chats);

  res.json(newMsg);
});

module.exports = router;

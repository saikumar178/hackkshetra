const express = require("express");
const router = express.Router();
const { readJSON, writeJSON } = require("../db/jsonStore.js");
const { v4: uuid } = require("uuid");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// ✅ Get documents
router.get("/students/:id/documents", async (req, res) => {
  const docs = await readJSON("documents.json");
  const userDocs = docs.filter((d) => d.userId === req.params.id);
  res.json(userDocs);
});

// ✅ Upload
router.post("/students/:id/documents/upload", upload.single("file"), async (req, res) => {
  const docs = await readJSON("documents.json");

  const newDoc = {
    id: uuid(),
    userId: req.params.id,
    title: req.body.title,
    type: req.body.type,
    fileName: req.file.filename,
    summary: "",
    isSummarized: false
  };

  docs.push(newDoc);
  await writeJSON("documents.json", docs);

  res.json(newDoc);
});

// ✅ Summarize
router.post("/students/:id/documents/:docId/summarize", async (req, res) => {
  const docs = await readJSON("documents.json");
  const doc = docs.find((d) => d.id === req.params.docId);

  doc.summary = "This is a generated summary (demo mode).";
  doc.isSummarized = true;

  await writeJSON("documents.json", docs);

  res.json(doc);
});

// ✅ Delete
router.delete("/students/:id/documents/:docId", async (req, res) => {
  let docs = await readJSON("documents.json");
  docs = docs.filter((d) => d.id !== req.params.docId);
  await writeJSON("documents.json", docs);

  res.json({ message: "Deleted" });
});

module.exports = router;

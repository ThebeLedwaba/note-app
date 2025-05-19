const express = require("express");
const Note = require("../models/Note");

const router = express.Router();

// Get all notes
router.get("/", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Create a new note
router.post("/", async (req, res) => {
  const note = new Note({ content: req.body.content });
  await note.save();
  res.json(note);
});

// Delete a note
router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted" });
});

module.exports = router;

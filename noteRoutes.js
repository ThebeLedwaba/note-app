const express = require("express");
const Note = require("../models/Note");
const router = express.Router();

// Get all notes with sorting and searching
router.get("/", async (req, res) => {
  try {
    const { search, sort } = req.query;
    const query = {};
    
    if (search) {
      query.content = { $regex: search, $options: 'i' };
    }
    
    const sortOption = sort === 'oldest' ? 'createdAt' : '-createdAt';
    const notes = await Note.find(query).sort(sortOption);
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notes" });
  }
});

// Create a new note
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Note content is required" });
    }
    
    const note = new Note({ content });
    await note.save();
    
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "Error creating note" });
  }
});

// Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting note" });
  }
});

module.exports = router;

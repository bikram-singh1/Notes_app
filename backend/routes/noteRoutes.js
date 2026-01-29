import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.send("Note added");
});

router.get("/", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.send("Note deleted");
});

export default router;

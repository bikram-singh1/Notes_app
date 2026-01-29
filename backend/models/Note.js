import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: String,
  content: String
});

export default mongoose.model("Note", noteSchema);

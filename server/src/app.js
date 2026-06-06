const express = require("express");
const cors = require("cors");

const notesRoutes = require("./routes/notesRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NoteFlow API is running",
  });
});

app.use("/api/notes", notesRoutes);

app.use(errorHandler);

module.exports = app;

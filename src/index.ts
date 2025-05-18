import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (_req, res) => {
  res.send("Server is runningggg!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

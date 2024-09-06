const express = require("express");
const cors = require("cors");
const path = require("path");

require("express-async-errors");
require("dotenv").config();

const apiRoute = require("./routes/api");

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.setTimeout(600000);
  next();
});

app.use("/api", apiRoute);
app.use("/outputs", express.static(path.join(__dirname, "outputs")));

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    const server = app.listen(PORT, () =>
      console.log(`server is listening on port ${PORT}`)
    );
    server.timeout = 120000;
  } catch (error) {
    console.log(error);
  }
};
start();

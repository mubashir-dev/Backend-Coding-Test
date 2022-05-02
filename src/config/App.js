const express = require("express");
const cors = require("cors");
const CallRoutes = require("../routes/CallRoutes");

const app = express();

//global level middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//routes
app.use("/", CallRoutes);

module.exports = app;
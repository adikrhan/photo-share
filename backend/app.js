const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const photosRoutes = require("./routes/photos-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();
const port = 3001;

const corsOptions = {
  "allowedHeaders": "Authorization, Content-Type, Accept",
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use("/api/photos", photosRoutes);
app.use("/api/users/", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find the page you are looking for.", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    "mongodb+srv://adikrhan:oGLZYSH9uy4vSqZj@cluster0.6kx2m.mongodb.net/photos?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log("Listening on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });

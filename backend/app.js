const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/user");
const restaurantRouter = require("./routes/restaurant");
const authJwt = require("./helpers/jwt");

let facverif = "placeholder";

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());

// Routes
app.use(authJwt());
app.use("/api/restaurants", restaurantRouter);
app.use("/api/users", userRouter);

const dblink =
  "mongodb+srv://User:Password@cluster0.zsnyd.mongodb.net/NS-App?retryWrites=true&w=majority";

mongoose
  .connect(dblink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected! **********************");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("Server started!");
});

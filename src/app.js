const express = require("express");
const connectDB = require("./config/Database");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/requests");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json()); // middleware
const cookieParser = require("cookie-parser");
app.use(cookieParser()); // middleware
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

connectDB()
  .then(() => {
    console.log("connection suceessfully done");

    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("DB Connection Failed err:", err);
  });

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
// just like a middleware we write a router, when the request come
// for example /profile it will go to authRouter if found it will match and run the router code
// if not found it will go to the next router profile router - here its found then it sends the response back

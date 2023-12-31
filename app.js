import express from "express";
import cors from "cors";
import {
  userRoute,
  authRoute,
  adminRouter,
  productRouter,
} from "./routes/index.js";
import { configureSession } from "./utils/auth-config.js";
import passport from "passport";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
// export function configureSession() {
//   return session({
//     secret: "keyboard cat",
//     resave: true,
//     saveUninitialized: true,
//   });
// }

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors());
app.use("/", userRoute);
app.use(configureSession());
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", cors(), express.static("./uploads"));
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp",
//   })
// );

app.use("/", authRoute);
app.use("/", adminRouter);
app.use("/", productRouter);

export default app;

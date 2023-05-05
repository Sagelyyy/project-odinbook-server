import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import https from "https";
import fs from "fs";
import session from "express-session";
import morgan from "morgan";

import { connectToDatabase } from "./database";
import passport from "./passport";
import router from "./routes";

const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.cert", "utf8");

const credentials = { key: privateKey, cert: certificate };

dotenv.config();

const app = express();
const httpsServer = https.createServer(credentials, app);

connectToDatabase();

app.use(morgan("dev"));

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: "none" },
  })
);

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(router);

httpsServer.listen(9000, () => console.log("HTTPS Listening on port 9000"));

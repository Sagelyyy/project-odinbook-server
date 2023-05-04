import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { router as authRouter } from "./routes/auth";
import { router as postRouter } from "./routes/posts";
import { router as commentRouter } from "./routes/comments";
import passport from "passport";
import mongoose from "mongoose";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import User from "./models/User";
import https from "https";
import fs from "fs";
import session from "express-session";
import morgan from "morgan";

const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.cert", "utf8");

const credentials = { key: privateKey, cert: certificate };

dotenv.config();

const app = express();
const httpsServer = https.createServer(credentials, app);

mongoose
  .connect(process.env.MONGO as string)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Failed to connect to the database:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(morgan("dev"));

app.set("trust proxy", 1);
app.use(
  session({
    secret: "superNova",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: "https://localhost:9000/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "name",
        "email",
        "picture.type(large)",
      ], // Request additional profile fields from Facebook
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb
    ) {
      try {
        await User.findOne({ facebookId: profile.id }).then(async (user) => {
          if (user) {
            console.log("existing user...");
            return cb(null, user);
          }

          console.log("adding new user...");
          const newUser = new User({
            facebookId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile.emails?.[0].value,
            profilePictureUrl: profile.photos?.[0].value,
          });

          await newUser.save();
          return cb(null, newUser);
        });
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser(function (user: any, done) {
  done(null, user.facebookId);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user: any = await User.findOne({ facebookId: id }).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);
app.use("/api/", postRouter);
app.use("/api/", commentRouter);

httpsServer.listen(9000, () => console.log("HTTPS Listening on port 9000"));

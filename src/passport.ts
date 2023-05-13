import passport from "passport";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import User from "./models/User";
import dotenv from "dotenv";

dotenv.config();

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
            return cb(null, user);
          }

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

export default passport;

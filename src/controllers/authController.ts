import express from "express";
import passport from "passport";

export const auth_facebook = passport.authenticate("facebook");

export const auth_facebook_cb = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  passport.authenticate(
    "facebook",
    { failureRedirect: "/" },
    function (err: Error, user: any, info: any) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/");
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    }
  )(req, res, next);
};

export const facebook_error = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.json({ message: "Error logging in" });
};

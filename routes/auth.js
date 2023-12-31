import { Router } from "express";
import passport from "../utils/auth-config.js";
import { SUCCESSROUTE, FAILUREROUTE, JWTSCECRETKEY } from "../config/app.js";
import jwt from "jsonwebtoken";

export const authRoute = Router();

authRoute.get("/fbLogin", (req, res) => {
  try {
    // Redirect to Facebook's authentication page
    passport.authenticate("facebook")(req, res);
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: err,
    });
  }
});
authRoute.get("/facebook/callback", (req, res, next) => {
  passport.authenticate("facebook", (err, user) => {
    if (err) {
      return res.redirect(FAILUREROUTE);
    }

    if (!user) {
      return res.redirect(FAILUREROUTE);
    }

    // Create a payload for the JWT
    const payload = {
      userId: user.id, // Assuming user ID is available in user object
    };

    // Sign the JWT with the secret key and set an expiration time
    const token = jwt.sign(payload, JWTSCECRETKEY, { expiresIn: "3h" });

    // Redirect to the success route with the JWT token as a query parameter
    return res.redirect(`${SUCCESSROUTE}?token=${encodeURIComponent(token)}`);
  })(req, res, next);
});

// Define the callback route for Facebook authentication
// authRoute.get("/facebook/callback", (req, res, next) => {
//   passport.authenticate("facebook", {
//     successRedirect: SUCCESSROUTE,
//     failureRedirect: FAILUREROUTE,
//   })(req, res, next);
// });

authRoute.get("/success", (req, res) => {
  res.send("Successful");
});

authRoute.get("/fail", (req, res) => {
  res.send("fail");
});

authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: false,
    failureRedirect: FAILUREROUTE,
  }),
  (req, res) => {
    // Create a payload for the JWT (using user data from req.user)
    const payload = {
      userId: req.user.id,
    };

    // Sign the JWT with a secret key and set an expiration time
    const token = jwt.sign(payload, JWTSCECRETKEY, { expiresIn: "3h" });

    // Send the JWT to the frontend as a response
    // console.log("Token generated:", token);
    res.redirect(`${SUCCESSROUTE}?token=${encodeURIComponent(token)}`);
  }
);

// authRoute.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: SUCCESSROUTE,
//     failureRedirect: FAILUREROUTE,
//   })
// );
// Assuming you're using Express.js

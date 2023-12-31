import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { dbConnection } from "../index.js";
import Session from "express-session";
import { DEPLOYED_URL } from "../config/app.js";

passport.serializeUser((user, done) => {
  // console.log(user);
  done(null, user[0].provider_id);
  //   done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    // console.log("Deserializing user with id:", id);
    dbConnection.query(
      "SELECT DISTINCT * FROM thirdpartyUsers WHERE provider_id = ?",
      [id],
      (error, user) => {
        if (error) {
          done(error);
        } else {
          // console.log(user);
          done(null, user);
        }
      }
    );
  } catch (err) {
    done(err);
  }
});

passport.use(
  new FacebookStrategy(
    {
      clientID: "955892859041917",
      clientSecret: "eab8c1cf8ae4eccfc7efe2d5687f9b51",
      callbackURL: `${DEPLOYED_URL}/facebook/callback`,
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "email",
        "picture.type(large)",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        dbConnection.query(
          "SELECT * FROM thirdpartyUsers WHERE provider = 'facebook' AND provider_id = ?",
          [profile.id],
          (error, existingUser) => {
            if (error) {
              return done(error);
            }

            if (existingUser.length !== 0) {
              done(null, existingUser);
              // console.log("Existing user", existingUser);
            } else {
              // console.log(profile);
              const newUser = {
                provider: "facebook",
                provider_id: profile.id,
                name: profile.displayName,
              };

              dbConnection.query(
                "INSERT INTO thirdpartyUsers SET ?",
                newUser,
                async (error, insertResult) => {
                  if (error) {
                    return done(error);
                  }

                  const [insertedUser] = await dbConnection.query(
                    "SELECT * FROM thirdpartyUsers WHERE id = ?",
                    [insertResult.insertId]
                  );

                  done(null, insertedUser);
                }
              );
            }
          }
        );
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1049795714660-ml4b1cblb85ffi8jbgbs0c76ct71agiu.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: `${DEPLOYED_URL}/google/callback`,
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "email",
        "picture.type(large)",
      ],
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        dbConnection.query(
          "SELECT * FROM thirdpartyUsers WHERE provider = 'google' AND provider_id = ?",
          [profile.id],
          (error, existingUser) => {
            if (error) {
              return done(error);
            }

            if (existingUser.length !== 0) {
              done(null, existingUser);
              // console.log("hi");
            } else {
              // console.log(profile);
              const newUser = {
                provider: "google",
                provider_id: profile.id,
                name: profile.displayName,
              };

              dbConnection.query(
                "INSERT INTO thirdpartyUsers SET ?",
                newUser,
                (error, insertResult) => {
                  if (error) {
                    return done(error);
                  }

                  dbConnection.query(
                    "SELECT * FROM thirdpartyUsers WHERE id = ?",
                    [insertResult.insertId],
                    (error, insertedUser) => {
                      if (error) {
                        return done(error);
                      }

                      done(null, insertedUser);
                    }
                  );
                }
              );
            }
          }
        );
      } catch (error) {
        done(error);
      }
    }
  )
);
export const configureSession = () => {
  return Session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: {
      name: "user", // Specify your desired cookie name here
      maxAge: 2 * 60 * 60 * 1000, // Set cookie to expire in 2 hours
    },
  });
};

export default passport;

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  handleEmailOnSuccessfulAuth,
  verifyEmailToken,
} from "@/lib/utils/auth";

import logger from "@/configs/logger";
import configs from "@/configs/vars";

/**
 *
 * @param {import('passport')} passport
 */
const configPassport = (passport) => {
  // custom fields because passport expects `username` and `password` by default
  /**
   * @typedef {Object} LocalStrategyOptions
   * @property {string} usernameField
   * @property {string} passwordField
   *
   */

  /**
   * @type {LocalStrategyOptions}
   */
  const localStrategyOptions = {
    usernameField: "email",
    passwordField: "token",
  };

  const verifyCallback = async (username, password, done) => {
    try {
      const isValid = await verifyEmailToken(username, password);
      if (isValid) {
        const { error, user } = await handleEmailOnSuccessfulAuth(username);

        if (error) done(error, false);
        else done(null, user);
      } else done("Invalid token", false);
    } catch (error) {
      logger.error("Verify Callback error: ", error);
      return done(error);
    }
  };

  const localStrategy = new LocalStrategy(localStrategyOptions, verifyCallback);
  passport.use("local", localStrategy);

  // google strategy
  const googleCallback = async (accessToken, refreshToken, profile, done) => {
    const email = profile._json.email;

    const { error, user } = await handleEmailOnSuccessfulAuth(email);

    if (error) return done(error, null);

    return done(null, user);
  };
  passport.use(
    new GoogleStrategy(
      {
        clientID: configs.google.clientID,
        clientSecret: configs.google.clientSecret,
        callbackURL: configs.google.callbackURL,
      },
      googleCallback
    )
  );

  passport.serializeUser((user, done) => {
    // save user id to passport session
    done(null, { id: user.id });
  });

  passport.deserializeUser(({ id }, done) => {
    // get user id from passport session and pass to req.user
    done(null, {
      id,
    });
  });
};

export default configPassport;

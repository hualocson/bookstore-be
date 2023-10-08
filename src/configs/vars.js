import * as dotenv from "dotenv";
import osHelpers from "@/lib/helpers.js";
import ms from "ms";

dotenv.config();
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

export default {
  port: osHelpers.toNumber(osHelpers.getOsEnvOptional("SERVER_PORT")) || 5000,
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  isDevelopment: process.env.NODE_ENV === "development",
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

  // db
  dbHost: osHelpers.getOsEnv("PG_HOST"),
  dbPort: osHelpers.getOsEnv("PG_PORT"),
  dbUser: osHelpers.getOsEnv("PG_USER"),
  dbPassword: osHelpers.getOsEnv("PG_PASSWORD"),
  dbName: osHelpers.getOsEnv("PG_DATABASE"),
  /**
   * API configs
   */
  api: {
    prefix_v1: "/api/v1",
  },

  // redis
  redisHost: osHelpers.getOsEnv("REDIS_HOST"),
  redisPort: osHelpers.getOsEnv("REDIS_PORT"),
  redisPassword: osHelpers.getOsEnvOptional("REDIS_PASSWORD"),
  redisSessionPrefix: osHelpers.getOsEnv("REDIS_SESSION_PREFIX"),

  // session
  sessionSecret: osHelpers.getOsEnv("SESSION_SECRET"),
  sessionName: osHelpers.getOsEnv("SESSION_NAME"),
  sessionMaxAge: ms(osHelpers.getOsEnv("SESSION_MAX_AGE")),

  // nodemailer
  nodemailer: {
    host: osHelpers.getOsEnv("MAILTRAP_HOST"),
    port: osHelpers.getOsEnv("MAILTRAP_PORT"),
    user: osHelpers.getOsEnv("MAILTRAP_USER"),
    pass: osHelpers.getOsEnv("MAILTRAP_PASSWORD"),
  },

  // google passport
  google: {
    clientID: osHelpers.getOsEnv("GOOGLE_CLIENT_ID"),
    clientSecret: osHelpers.getOsEnv("GOOGLE_CLIENT_SECRET"),
    callbackURL: osHelpers.getOsEnv("GOOGLE_CALLBACK_URL"),
  },
};

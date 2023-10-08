import cors from "cors";
import bodyParser from "body-parser";
import morgan from "@/configs/morgan.js";
import configs from "@/configs/vars.js";
import helmet from "helmet";
import { errorConverter, errorHandler } from "@/middlewares/error.handler";
import routes from "@/apis";
import sessionMiddleware from "@/middlewares/redis-session";
import passport from "passport";
import configPassport from "@/configs/passport";
import cookieParser from "cookie-parser";

export default (app) => {
  // set session
  app.set("trust proxy", 1); // trust first proxy
  app.use(sessionMiddleware);
  app.use(cookieParser(configs.sessionSecret));

  if (!configs.isTest) {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
  }

  app.use(helmet());

  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  app.enable("trust proxy");

  app.use(cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // init passport
  configPassport(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  // Load API routes
  app.use(configs.api.prefix_v1, routes());

  app.use(errorConverter);
  app.use(errorHandler);
};

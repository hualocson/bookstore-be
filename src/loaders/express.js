import cors from "cors";
import bodyParser from "body-parser";
import morgan from "@/configs/morgan.js";
import configs from "@/configs/vars.js";
import helmet from "helmet";
import { errorConverter, errorHandler } from "@/middlewares/error.handler";
import routes from "@/apis";

export default (app) => {
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

  // Load API routes
  app.use(configs.api.prefix_v1, routes());

  app.use(errorConverter);
  app.use(errorHandler);
};

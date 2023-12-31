import startApp from "@/app";
import logger from "@/configs/logger";
import configs from "@/configs/vars";
import http from "http";

startApp()
  .then((app) => {
    const server = http.createServer(app);

    server.listen(configs.port, () => {
      logger.info(`Listening to port ${configs.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info("Server closed");
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error) => {
      logger.error(error);
      exitHandler();
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received");
      if (server) {
        server.close();
      }
    });
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });

import httpStatus from "http-status";
import ApiError from "@/lib/api-error";
import configs from "@/configs/vars";
import sql from "@/configs/db";
import logger from "@/configs/logger";

const errorConverter = (err, req, res, next) => {
  let error = err;
  let statusCode;
  let message;
  if (!(error instanceof ApiError)) {
    if (error.error) {
      statusCode = error.error.http_code || httpStatus.INTERNAL_SERVER_ERROR;
      message = error.error.message || httpStatus[statusCode];
    } else {
      statusCode =
        error.statusCode || error instanceof sql.PostgresError
          ? httpStatus.BAD_REQUEST
          : httpStatus.INTERNAL_SERVER_ERROR;
      message = error.message || httpStatus[statusCode];
    }
    error = new ApiError(statusCode, message, false, error.stack);
  }
  next(error);
};

const errorHandler = (err, req, res) => {
  let { statusCode, message } = err;
  if (configs.isProduction && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[statusCode];
  }
  res.locals.errorMessage = err.message;

  const error = {
    message,
  };
  if (configs.isDevelopment) {
    logger.error(err);
    if (!err.isOperational) error.stack = err.stack;
  }
  return res.status(statusCode).json({
    success: false,
    error,
  });
};

export { errorConverter, errorHandler };

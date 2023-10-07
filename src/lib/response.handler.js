import httpStatus from "http-status";
/* Format for response
Success:
{
    "success": "false",
    "data": {
      payload object
      message: "This is message for success response",
    },
}
Error
{
    "success": "false",
    "error": {
      "message": "This is error",
    },
}
*/

/**
 * This function is used to send error response to client with standard format
 * @callback ErrorResponse
 * @param {string} message
 * @param {number} [statusCode=500]
 * @returns {void}
 */

/**
 *  This function is used to send success response to client with standard format
 * @callback SuccessResponse
 * @param {Object} payload
 * @param {string} message
 * @param {number} [statusCode=200]
 * @returns {void}
 */

/**
 * @function
 * @param {import('express').Response} res
 * @returns {{errorResponse: ErrorResponse, successResponse: SuccessResponse}}
 */
const createResponseHandler = (res) => {
  /**
   * @type {ErrorResponse} errorResponse
   */
  const errorResponse = (
    message,
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
  ) => {
    res.status(statusCode).json({
      success: false,
      error: {
        message: message || httpStatus[statusCode],
      },
    });
  };

  /**
   * @type {SuccessResponse} successResponse
   */
  const successResponse = (payload, message, statusCode = httpStatus.OK) => {
    res.status(statusCode).json({
      success: true,
      data: {
        ...payload,
        message,
      },
    });
  };

  return {
    errorResponse,
    successResponse,
  };
};

export default createResponseHandler;

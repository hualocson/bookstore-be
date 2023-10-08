import { body } from "express-validator";

const sanitizeEmail = (email) => {
  // Remove leading and trailing white-spaces
  const trimmedEmail = email.trim();

  // Convert the email to lowercase for consistency
  const sanitizedEmail = trimmedEmail.toLowerCase();

  return sanitizedEmail;
};

/**
 * This function is used to create a chain of express-validator to check if the email is valid and sanitize it.
 * @returns express-validator chain
 */
export const emailValidationChain = () =>
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email is invalid!")
    .customSanitizer((value) => sanitizeEmail(value));

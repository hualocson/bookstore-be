import logger from "@/configs/logger";
import ApiError from "@/lib/api-error";
import transporter from "@/configs/nodemailer";

const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `Bookstore <hello@bookstore.io>`,
      to,
      subject,
      text,
      html,
    });

    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error(error);
    throw new ApiError(500, "Error sending email");
  }
};

export default sendEmail;

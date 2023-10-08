import nodemailer from "nodemailer";
import configs from "@/configs/vars";

const transporter = nodemailer.createTransport({
  host: configs.nodemailer.host,
  port: configs.nodemailer.port,
  auth: {
    user: configs.nodemailer.user,
    pass: configs.nodemailer.pass,
  },
});

export default transporter;

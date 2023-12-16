import sql from "@/configs/db";
import redisClient from "@/configs/redis";
import { CustomerStatus } from "@/lib/constants";
import { saveUser } from "@/redis-om/user/user.services";
import crypto from "crypto";
import sendEmail from "./email-sender";

const handleEmailOnSuccessfulAuth = async (email) => {
  try {
    const [user] =
      await sql`SELECT id, email, status FROM customers WHERE email = ${email}`;

    if (!user) {
      const [newUser] =
        await sql`INSERT INTO customers (email, status) VALUES (${email}, ${CustomerStatus.PENDING}) RETURNING id, email, status`;

      await saveUser({ ...newUser });
      return {
        error: null,
        user: newUser,
      };
    }

    await saveUser({ ...user });
    return {
      error: null,
      user,
    };
  } catch (error) {
    return {
      error,
      user: null,
    };
  }
};
// Generate 6 digit token and save key-value to redis
async function generateEmailToken(email) {
  // Redis key in this format `token-${email}`
  const redisKey = `token--${email}`;

  // Randomly generate a number
  const num = crypto.randomBytes(3).readUIntBE(0, 3);

  let token;
  // if numString is less 6 chars, add 0s to the front to get 6 char
  if (num < 1000000) {
    token = num.toString().padStart(6, "0");
  } else {
    token = num.toString().slice(0, 6);
  }

  const expiration = 60 * 60; // 1 hour

  // set token and email on redis
  await redisClient.set(redisKey, token, { EX: expiration });

  return token;
}

const verifyEmailToken = async (email, token) => {
  const redisKey = `token--${email}`;
  const redisToken = await redisClient.get(redisKey);

  if (parseInt(redisToken, 10) === parseInt(token, 10)) return true;
  return false;
};

const sendTokenEmail = async (email) => {
  // Redis key in this format `token-${email}`
  const redisKey = `token--${email}`;
  // check token exists
  const existTokens = await redisClient.get(redisKey);

  if (existTokens) return;
  const token = await generateEmailToken(email);
  await sendEmail(
    email,
    "Email verification",
    `Your verification code is ${token}`,
    `<p>Your verification code is <b>${token}</b></p>`
  );
};

export {
  generateEmailToken,
  handleEmailOnSuccessfulAuth,
  sendTokenEmail,
  verifyEmailToken,
};

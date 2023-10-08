import configs from "@/configs/vars";
import redisClient from "@/configs/redis";
import session from "express-session";
import RedisStore from "connect-redis";

// config session redis store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: configs.redisSessionPrefix,
});

const sessionMiddleware = session({
  store: redisStore,
  secret: configs.sessionSecret,
  resave: false,
  saveUninitialized: false,
  name: configs.sessionName,
  cookie: {
    httpOnly: true,
    secure: configs.isProduction,
    maxAge: configs.sessionMaxAge,
    sameSite: "strict",
  },
});

export default sessionMiddleware;

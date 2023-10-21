import postgres from "postgres";
import configs from "@/configs/vars.js";

const { dbHost, dbPort, dbUser, dbPassword, dbName } = configs;

const sql = postgres({
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  transform: {
    ...postgres.camel,
    undefined: null,
  },
});

export default sql;

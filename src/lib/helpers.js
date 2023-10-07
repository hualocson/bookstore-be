import path from "path";

const getOsEnv = (key) => {
  if (typeof process.env[key] === "undefined") {
    throw new Error(`Environment variable ${key} is undefined`);
  }
  return process.env[key];
};

const getOsEnvOptional = (key) => {
  return process.env[key];
};

const getRootPath = () => {
  const basePath = path.join(__dirname, "../../");
  return basePath;
};

const getPath = (p) => {
  return process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), `${p.replace("src/", "build/").slice(0, -3)}.js`)
    : path.join(process.cwd(), p);
};

const toNumber = (value) => {
  return parseInt(value, 10);
};

const toBool = (value) => {
  return value === "true";
};

export default {
  getOsEnv,
  getOsEnvOptional,
  getPath,
  getRootPath,
  toNumber,
  toBool,
};

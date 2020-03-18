const path = require("path");

const loadEnv = network => {
  let envFile = "";
  let constsFile = "";

  if (network !== "live" && network !== "live-fork") {
    envFile = "./.env.test";
    constsFile = "./consts.test";
  } else {
    envFile = "./.env";
    constsFile = "./consts";
  }

  const dotEnvPath = path.resolve(envFile);
  require("dotenv").config({ path: dotEnvPath });
  const consts = require(constsFile);
  return consts;
};

module.exports = loadEnv;

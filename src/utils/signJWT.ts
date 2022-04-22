import jwt from "jsonwebtoken";
import config from "../config";
import Iuser from "../interfaces/user";

const signJWT = (
  user: Iuser,
  callback: (error: Error | null, token: string | null) => void
): void => {
  const { username, password } = user;
  console.info(`Attempting to sign token for ${username}`);

  try {
    jwt.sign(
      { username },
      config.SERVER.token.secret,
      {
        issuer: config.SERVER.token.issuer,
        algorithm: "HS256",
        expiresIn: "1d",
      },
      (error: any, token) => {
        if (error) {
          {
            callback(error, null);
          }
        } else if (token) {
          {
            callback(null, token);
          }
        }
      }
    );
  } catch (error: any) {
    console.error(error.message, error);
    callback(error, null);
  }
};

export default signJWT;

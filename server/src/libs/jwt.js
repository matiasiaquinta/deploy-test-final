import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from "../config.js";

//token
export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
                expiresIn: "1d",
            },
            (err, token) => {
                if (err) {
                    reject("Token error, because: ", err);
                } else {
                    resolve(token);
                }
            }
        );
    });
}

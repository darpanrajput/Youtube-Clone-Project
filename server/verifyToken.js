import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    // console.log("req.cookies=", req.cookies)

    // console.log("token=", token)

    if (!token) {
        return next(createError(401, " You Are Not Authenticated"));
    }

    jwt.verify(token, process.env.JWT_KEY, (err, userIdFromCookies) => {
        if (err) {
            return next(createError(401, "Invalid Token"));
        }
        // console.log("userIdFromCookies=", userIdFromCookies);
        // console.log("req=", req);
        req.user = userIdFromCookies;
        /* we are saving the req.user object to token obtained after the verification
        in this we can call and use and req.user.id everywhere in our project
        */
        // console.log("req.user=", req.user)
        next();
    });
}

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyAUTH=async (socket, next) => {
    try {
        const token = socket.handshake.query.token || socket.handshake.headers.authorization?.replace("Bearer ", "");
        if (!token) {
        return next(new Error("Unauthorized request"));
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user={
            _id: decodedToken._id,
            username: decodedToken.username,
            email: decodedToken.email
        }
        socket.user = user;
        next();
    } catch (error) {
        console.error(error);
        return next(new Error("Unauthorized request"));
      }
      
}


import {io, app,server} from "./app.js";
import { connectDB } from "./db/connectDB.js";
import { connectRedisDB ,redis} from "./db/connectRedisDB.js";
import { verifyAUTH } from "./middlewares/auth.socket.middleware.js";
import {handleUser} from "./controllers/dataPopulate.controller.js"
connectDB();
connectRedisDB();
const codeIo=io.of("/code")
codeIo.use(verifyAUTH)
codeIo.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} , user: ${socket?.user?._id}`);
    handleUser(socket);
})
server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});

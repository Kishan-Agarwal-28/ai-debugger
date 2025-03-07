export const handleUser = (socket) => {
    socket.on("getUser", (data) => {
        socket.emit("getUser", socket.user);
    });
};
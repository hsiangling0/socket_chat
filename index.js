const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:3000" });
let onlineUser = [];
io.on("connection", (socket) => {
  console.log("new connection", socket.id);
  socket.on("addUser", (userName, userAccount) => {
    !onlineUser.some((user) => user.userAccount == userAccount) &&
      onlineUser.push({ userName, userAccount, socketID: socket.id });
    console.log(onlineUser);
  });
  socket.on("sendMessage", (message) => {
    console.log(message);
    const user = onlineUser.find(
      (user) => user.userName === message.receiverName
    );
    console.log(user);
    if (user) {
      io.to(user.socketID).emit("getMessage", message);
      io.to(user.socketID).emit("getNotification", {
        sender: message.name1,
        isRead: false,
        date: new Date(),
      });
    }
  });
  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => user.socketID !== socket.id);
  });
  //socket.on("sendMessage", (message) => {});
});

io.listen(5844);

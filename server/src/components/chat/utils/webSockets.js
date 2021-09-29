const chatController = require("../controller/chatRoom.controller");
let users = [];
function connection(client) {
  // event fired when the chat room is disconnected
  client.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== client.id);
  });
  // add identity of user mapped to the socket id
  client.on("identity", (userId) => {
    users.push({
      socketId: client.id,
      userId: userId,
    });
    console.log("connected user");
    console.log(users);
  });
  // subscribe person to chat & other user as well
  client.on("subscribe", (data) => {
    subscribeOtherUser(data.room, data.otherUserId);
    client.join(data.room);
  });
  // mute a chat room
  client.on("unsubscribe", (room) => {
    client.leave(room);
  });

  client.on("chat", (messageObject) => {
    // console.log(
    //   messageObject.currentLoggedInUserId,
    //   messageObject.roomId,
    //   messageObject.messageText
    // );
    chatController.postMessage(
      messageObject.currentLoggedInUserId,
      messageObject.roomId,
      messageObject.messageText
    );
  });
}

function subscribeOtherUser(room, otherUserId) {
  const userSockets = users.filter((user) => user.userId === otherUserId);
  userSockets.map((userInfo) => {
    // const socketConn = global.io.sockets.connected(userInfo.socketId);
    // if (socketConn) {
    //  socketConn.join(room);
    // }
  });
  if(users.length > 0)
  //console.log(global.io.sockets.connected(users[0].socketId))
  console.log(users);
}

module.exports = {
  connection,
};

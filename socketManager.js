const {
  io
} = require('./server.js');

const {
  VERIFY_USER,
  LOGOUT,
  USER_CONNECTED,
  USER_DISCONNECTED,
  USER_LOGOUT,
  COMMUNITY_CHAT,
  MESSAGE_RECEIVED,
  MESSAGE_SENT
} = require('./events.js');

const {
  createUser,
  createMessage,
  createChat
} = require('./factories.js');

const connnectedUsers = {};

const communityChat = createChat();

module.exports = function (socket) {
  console.log(`Client Connected with socket ID: ${socket.id}`);

  let sendMessageToChatFromUser;

  // Verify user
  socket.on(VERIFY_USER, (username, callback) => {
    if (isUser(connectedUsers, username)) {
      callback({
        isUser: true,
        user: null
      });
    } else {
      callback({
        isUser: false,
        user: createUser({
          name: username
        })
      });
    }
  });

  socket.on(USER_CONNECTED, (user) => {
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    sendMessageToChatFromUser = sendMessageToChat(user.username);

    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });

  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  });

  socket.on(MESSAGE_SENT, ({
    message,
    sender
  }) => {
    sendMessageToChatFromUser(chatId, message);
  });
}

function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({
      message,
      sender
    }));
  }
}

function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

function removeUser(userList, username) {
  let newList = Object.assign({}.userList);
  delete newList[username];
  return newList;
}

function isUser(userList, username) {
  return username in userList;
}

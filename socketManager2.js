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

let connectedUsers = []
const messages = [];

module.exports = function (socket) {
  console.log(`Client Connected with socket ID: ${socket.id}`);

  let sendMessageToChatFromUser;

  // let connectedUsers = {};


  // Verify user
  // socket.on(VERIFY_USER, (username, callback) => {
  //   if (isUser(connectedUsers, username)) {
  //     callback({
  //       isUser: true,
  //       user: null
  //     });
  //   } else {
  //     callback({
  //       isUser: false,
  //       user: createUser({
  //         name: username
  //       })
  //     });
  //   }
  // });

  // socket.on(USER_CONNECTED, (user) => {
  //   connectedUsers = addUser(connectedUsers, user);
  //   socket.user = user;
  //
  //   sendMessageToChatFromUser = sendMessageToChat(user.username);
  //
  //   io.emit(USER_CONNECTED, connectedUsers);
  //   console.log(connectedUsers);
  // });

  // socket.on(COMMUNITY_CHAT, (callback) => {
  //   callback(communityChat);
  // });
  //
  // socket.on(MESSAGE_SENT, ({
  //   message,
  //   sender
  // }) => {
  //   sendMessageToChatFromUser(chatId, message);
  // });
  socket.on('disconnect', (username) => {
    connectedUsers = removeUser2(connectedUsers, username);
    socket.broadcast.emit('disconnect', connectedUsers);
    // socket.emit('disconnect', connectedUsers);
  })

  socket.on(MESSAGE_SENT, (message) => {
    if (message.message.includes('@guide.ai')) {
      console.log('guide woken');
      if (message.message.includes('-help')) {
        socket.emit(MESSAGE_SENT, {
          message: '(for you only) If you need help see the wiki page or review the list of options: -chat -feedback -commands',
          username: 'guide.ai',

        })
      } else if (message.message.includes('-commands')) {
        socket.emit(MESSAGE_SENT, {
          message: `(for only you) Available Commands: \n1. /ui color <color>\n2./message <@user> <message>\n3. /message_all <@user>... <message>`,
          username: 'guide.ai'
        })
      } else if (message.message.includes('-chat')) {
        const chats = [`Hi ${message.username}. What kind of projects are you thinking about working on?`, `${message.username}, what's the most important thing to do right now?`, `Hi ${message.username}. Have you used any of the power user command features?`, "What's on your mind ${message.username}?", "How's work going?"];
        // const rand = Math.floor(Math.random() * chats.length);
        socket.emit(MESSAGE_SENT, {
          message: `(for you only) ${chats[Math.floor(Math.random() * chats.length)]}`,
          username: "guide.ai"
        });
      } else if (message.message.includes('-feedback')) {
        const chats = ['Amazing job. Keep up the good work.', "I think you're on the right track.", "Incredible job on that.", "Fantastic work.", "There's no stopping you.", "Impressive.", "Great work inspires more great work.", "Bring it all the way to the finish line.", "You've go all the green lights. Go go go.", "Don't stop, you can do it."];
        // const rand = Math.floor(Math.random() * chats.length);
        socket.emit(MESSAGE_SENT, {
          message: `(for you only) ${chats[Math.floor(Math.random() * chats.length)]}`,
          username: "guide.ai"
        });
      } else {
        const chats = ['That is quite interesting', "Is that so...", "Tell me more.", 'I have to go clean the data servers. brb.', 'Hold on to that thought, while I upgrade my communication circuits.', 'Out to lunch. Leave a message.', "Busy web scrapping, I'll get back to you on that"];
        // const rand = Math.floor(Math.random() * chats.length);
        socket.emit(MESSAGE_SENT, {
          message: `(for you only) ${chats[Math.floor(Math.random() * chats.length)]}`,
          username: "guide.ai"
        });
      }
    } else {
      addMessage(messages, message);
      socket.broadcast.emit(MESSAGE_SENT, message);
      console.log(messages);
    }
  });

  socket.on(USER_CONNECTED, (username) => {
    console.log(`${username} connected`);
    addUser2(connectedUsers, username);
    socket.broadcast.emit(USER_CONNECTED, {
      users: connectedUsers
    });
    socket.emit(USER_CONNECTED, {
      users: connectedUsers,
      messages
    });
    console.log(connectedUsers);
  });

  socket.on(USER_DISCONNECTED, (username) => {
    console.log(`${username} disconnected`);
    connectedUsers = removeUser2(connectedUsers, username);
    socket.broadcast.emit(USER_DISCONNECTED, connectedUsers);
    console.log(connectedUsers);
  })
}

function addMessage(messages, message) {
  messages.push(message);
}

function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({
      message,
      sender
    }));
  }
}

function addUser2(usersList, username) {
  if (!usersList.includes(username)) {
    usersList.push(username);
  } else {
    console.log('user already joined');
  }
}

function removeUser2(usersList, username) {
  usersList = usersList.filter((uname) => {
    if (uname === username) {
      return false;
    }
    return true;
  });
  return usersList;
}

function addUser(usersList, username) {
  let newList = Object.assign({}, usersList);
  newList[username] = username;
  return newList;
}

function removeUser(userList, username) {
  let newList = Object.assign({}.usersList);
  delete newList[username];
  return newList;
}

function isUser(userList, username) {
  return username in userList;
}

const uuidv4 = require('uuid/v4');

const createUser = ({
  name = ""
} = {}) => {
  return {
    id: uuidv4(),
    name
  }
}

const createMessage = ({
  message = "",
  sender = ""
} = {}) => {
  return {
    id: uuidv4(),
    time: getTime(new Date(Date.now())),
    message,
    sender
  }
}

const createChat = ({
  message = [],
  name = "Community",
  users = []
} = {}) => {
  return {
    id: uuidv4(),
    name,
    // messages,
    users,
    typingUsers: []
  }
}

const getTime = (date) => {
  return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`;
}

module.exports = {
  createUser,
  createMessage,
  createChat
}

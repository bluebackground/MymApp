require('./variables/processConfig.js');

const mongoose = require('mongoose');
const server = require('./server.js');

const {
  SERVER_PORT
} = require('./variables/serverConfig.js');

mongoose.Promise = global.Promise;

const connect = mongoose.connect(process.env.MONGODB_URI);
// Use Mongo Client is removed for Mongo 5.x

if (process.env.NODE_ENV === 'test') {
  server.listen(SERVER_PORT, () => {
    console.log('Note: Server-Test does not check if mongod is running.');
    console.log('Note: Check to make sure MongoDB is running manually.');
    console.log(`Status: Server started on port ${SERVER_PORT}...`);
  });
} else {
  connect.then(() => {
    server.listen(SERVER_PORT);
    console.log(`Status: Server connecting to database URI: ${process.env.MONGODB_URI}`);
    console.log(`Status: Server started on port ${SERVER_PORT}`);
  }, (err) => {
    console.log(`Status: Error in connection to database URI: ${process.env.MONGODB_URI}`);
  });
}

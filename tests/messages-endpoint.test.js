const { TEST } = require('../variables/serverConfig.js');

process.env.NODE_ENV = TEST;

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/MymApp-Test');

const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');

chai.use(chaiHTTP);

const server = require('../server.js');

const Log = require('../models/Log.js');

const Message = require('../models/Message.js');

const ROUTE = '/messages';
const SINGLE_ROUTE = '/messages/:messageID';
const [GET, PUT, POST, DELETE] = ['GET',
  'PUT', 'POST', 'DELETE'
];

const {
  SUCCESS,
  SERVER_ERR,
  USER_ERR
} = require('../variables/statuses.js');

const objectsArray = [{
  _id: new mongoose.Types.ObjectId(),
  text: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  priority: 1
}, {
  _id: new mongoose.Types.ObjectId(),
  text: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  priority: 1
}, {
  _id: new mongoose.Types.ObjectId(),
  text: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  priority: 1
}]

const newMessage = {
  _id: new mongoose.Types.ObjectId(),
  text: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  priority: 1
}

const invalidMessage1 = {
  _id: "123",
  text: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  priority: 1
}

const invalidMessage2 = {
  _id: new mongoose.Types.ObjectId(),
  text: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  priority: 1
}

describe('API Endpoints for /messages', () => {

  before(() => {
    // console.log('Starting - before()');
    Log.remove({})
      .then()
      .catch();
  });
  //
  // after(() => {
  //   console.log('Ending - after()');
  // });

  beforeEach((done) => {
    // console.log('Starting - beforeEach()');
    Message.remove({})
      .then(() => {
        Message.insertMany(objectsArray);
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log('Error in beforeEach()');
        done();
      });
  });

  afterEach((done) => {
    // console.log('Starting - afterEach()');
    Message.remove({})
      .then(() => {
        // console.log('after ')
        done();
      })
      .catch((err) => {
        console.log('Error in afterEach()');
        done();
      });
  });

  describe(`${GET}  ${ROUTE}`, () => {
    // GET /messages
    it('should return MULTIPLE message objects as an array', function (done) {
      chai.request(server)
        .get(ROUTE)
        .send({
          "options": {}
        })
        .then(function (res) {
          try {

            const body = res.body;
            const status = res.status;

            expect(status).to.equal(SUCCESS);

            expect(Array.isArray(body)).to.equal(true);

            expect(body.length).to.equal(objectsArray.length);

            const objects = body;

            if (objects.length > 0) {
              for (const [index, object] of objects.entries()) {
                expect(object).to.be.an('object');

                expect(object).to.have.property('text');
                expect(object).to.have.property('from');
                expect(object).to.have.property('to');
                expect(object).to.have.property('priority');

                expect(object.text).to.equal(objectsArray[index].text);
                expect(object.text).to.be.a('string');
                expect(object.from).to.equal(objectsArray[index].from.toHexString());
                expect(object.from).to.be.a('string');
                expect(object.to).to.equal(objectsArray[index].to.toHexString());
                expect(object.to).to.be.a('string');
                expect(object.priority).to.equal(objectsArray[index].priority);
                expect(object.priority).to.be.a('number');

              }
              done();
            } else {
              done(new Error('No objects found in DB'));
            }
          } catch (e) {
            done(e);
          }
        })
        .catch(function (err) {
          // console.log(err.message);
          done(err);
        });
    });
  });

  // GET /messages/:messageID
  describe(`${GET}  ${SINGLE_ROUTE}`, () => {
    it(`should return a SINGLE message from ${GET} ${SINGLE_ROUTE}`, (done) => {

      chai.request(server)
        .get(ROUTE)
        .send({
          "options": {}
        })
        .end((error, response) => {
          if (error) return done();

          const body = response.body;
          const status = response.status;

          const objects = body;
          const index = 0;

          if (objects.length > 0) {
            chai.request(server)
              .get(ROUTE + '/' + objects[index]._id)
              .send({
                "options": {}
              })
              .end((err, res) => {
                if (err) return done();

                const body = res.body;
                const status = res.status;

                expect(body).to.be.an('object');

                const object = body;

                expect(object).to.have.property('text');
                expect(object).to.have.property('from');
                expect(object).to.have.property('to');
                expect(object).to.have.property('priority');

                expect(object.text).to.equal(objectsArray[index].text);
                expect(object.text).to.be.a('string');
                expect(object.from).to.equal(objectsArray[index].from.toHexString());
                expect(object.from).to.be.a('string');
                expect(object.to).to.equal(objectsArray[index].to.toHexString());
                expect(object.to).to.be.a('string');
                expect(object.priority).to.equal(objectsArray[index].priority);
                expect(object.priority).to.be.a('number');

                done();
              });

          } else {
            done(new Error('No messages were found in DB'));
          }
        });
    });

    it.skip('should return an ERROR for invalid id param', function (done) {
      const invalidID = '123';

      chai.request(server)
        .get(ROUTE + '/' + invalidID)
        .send({
          "options": {}
        })
        .then(function (res) {
          try {

            const body = res.body;
            const status = res.status;

            undefined

            done();
          } catch (e) {
            done(e);
          }
        })
        .catch(function (err) {
          // console.log(err);
          done(err);
        });
    });
  });

  // POST /messages
  describe(`${POST}  ${ROUTE}`, () => {
    it(`should return a SINGLE object from ${POST} ${SINGLE_ROUTE}`, function (done) {
      chai.request(server)
        .post(ROUTE)
        .send(newMessage)
        .then(function (res) {
          try {

            const body = res.body;
            const status = res.status;

            expect(status).to.equal(SUCCESS);

            expect(body).to.be.an('object');

            const object = body;

            expect(object).to.have.property('text');
            expect(object).to.have.property('from');
            expect(object).to.have.property('to');
            expect(object).to.have.property('priority');

            expect(object.text).to.equal(newMessage.text);
            expect(object.text).to.be.a('string');
            expect(object.from).to.equal(newMessage.from.toHexString());
            expect(object.from).to.be.a('string');
            expect(object.to).to.equal(newMessage.to.toHexString());
            expect(object.to).to.be.a('string');
            expect(object.priority).to.equal(newMessage.priority);
            expect(object.priority).to.be.a('number');

            done();
          } catch (e) {
            done(e);
          }
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('should return MULTIPLE message objects, including newly added message', async function () {
      try {
        await chai.request(server)
          .post(ROUTE)
          .send(newMessage)
          .then(function (res) {

            const body = res.body;
            const status = res.status;
            // Don't need to do anything to handle the response.
          })
          .catch(function (err) {
            throw err;
            // done(err);
          });

        await chai.request(server)
          .get(ROUTE)
          .send({
            "options": {}
          })
          .then(function (res) {

            const body = res.body;
            const status = res.status;

            expect(status).to.equal(SUCCESS);

            expect(Array.isArray(body)).to.equal(true);

            expect(body.length).to.equal(objectsArray.length + 1);

            objectsArray.push(newGroup);

            const objects = body;

            if (objects.length > 0) {
              for (const [index, object] of objects.entries()) {

                expect(object).to.be.an('object');

                expect(object).to.have.property('text');
                expect(object).to.have.property('from');
                expect(object).to.have.property('to');
                expect(object).to.have.property('priority');

                expect(object.text).to.equal(objectsArray[index].text);
                expect(object.text).to.be.a('string');
                expect(object.from).to.equal(objectsArray[index].from.toHexString());
                expect(object.from).to.be.a('string');
                expect(object.to).to.equal(objectsArray[index].to.toHexString());
                expect(object.to).to.be.a('string');
                expect(object.priority).to.equal(objectsArray[index].priority);
                expect(object.priority).to.be.a('number');

              }
              // done();
            } else {
              // done(new Error('No objects found in DB'));
            }
          })
          .catch(function (err) {
            throw err;
            // done(err);
          });
      } catch (e) {
        // done(e);
      }
    });

    // Check for invalid input.
    it.skip('should return an ERROR for invalid request body', function (done) {
      chai.request(server)
        .post(ROUTE)
        .send(invalidMessage1)
        .then(function (res) {
          try {

            const body = res.body;
            const status = res.status;

            undefined

            done();
          } catch (e) {
            done(e);
          }
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  // PUT /messages/:messageID
  describe(`${PUT}  ${SINGLE_ROUTE}`, () => {
    it(`should update a SINGLE object with updated fields from ${PUT} ${SINGLE_ROUTE}`, (done) => {
      const updatedValue = 'updatedValue';
      const updatedMessage = {
        // TODO: Select a property to update.
        text: 'string',
        from: new mongoose.Types.ObjectId(),
        to: new mongoose.Types.ObjectId(),
        priority: 1
      };

      chai.request(server)
        .get(ROUTE)
        .send({
          "options": {}
        })
        .end((error, response) => {
          if (error) return done();

          const body = response.body;
          const status = response.status;

          const index = 0;
          const id = body[index]._id;

          expect(status).to.equal(SUCCESS);

          if (id) {
            // TODO: Test for original property value here.
            // expect(object.property).to.equal(objectsArray[index].property);

            // TODO: Then, test for updated property value.
            chai.request(server)
              .put(ROUTE + '/' + id)
              .send(updatedMessage)
              .end((err, res) => {
                if (err) return done();

                const body = res.body;
                const status = res.status;

                expect(status).to.equal(SUCCESS);

                expect(body).to.be.an('object');

                const object = body;

                expect(object).to.have.property('text');
                expect(object).to.have.property('from');
                expect(object).to.have.property('to');
                expect(object).to.have.property('priority');

                // TODO: Check property for updated value.
                //expect(res.body.property).to.equal(updatedValue);
                done();
              });
          } else {
            done(new Error('No objects found in database'));
          }
        });
    });
    // TODO: Create test to check for invalid input.
  });

  // DELETE /messages/:messageID
  describe(`${DELETE}  ${SINGLE_ROUTE}`, () => {
    it(`should return a SINGLE object from ${DELETE} ${SINGLE_ROUTE}`, (done) => {
      chai.request(server)
        .get(ROUTE)
        .send({
          "options": {}
        })
        .end((error, response) => {
          if (error) return done();

          const body = response.body;
          const status = response.status;

          const index = 0;
          const id = body[index]._id;

          if (id) {
            chai.request(server)
              .delete(ROUTE + '/' + id)
              .end((err, res) => {
                if (err) return done();

                const body = res.body;
                const status = res.status;

                expect(status).to.equal(SUCCESS);

                expect(body).to.be.an('object');

                const object = body;

                expect(object).to.have.property('text');
                expect(object).to.have.property('from');
                expect(object).to.have.property('to');
                expect(object).to.have.property('priority');

                expect(object.text).to.equal(objectsArray[index].text);
                expect(object.text).to.be.a('string');
                expect(object.from).to.equal(objectsArray[index].from.toHexString());
                expect(object.from).to.be.a('string');
                expect(object.to).to.equal(objectsArray[index].to.toHexString());
                expect(object.to).to.be.a('string');
                expect(object.priority).to.equal(objectsArray[index].priority);
                expect(object.priority).to.be.a('number');

                done();
              });
          } else {
            done(new Error('No objects found in DB'));
          }

        });
    });

    it('should remove SINGLE object in the DB', (done) => {

      chai.request(server)
        .get(ROUTE)
        .send({
          "options": {}
        })
        .end((error, response) => {
          if (error) return done();

          const body = response.body;
          const status = response.status;

          expect(body.length).to.equal(objectsArray.length);

          const index = 0;
          const id = body[index]._id;

          // Now delete one object.
          if (id) {
            chai.request(server)
              .delete(ROUTE + '/' + id)
              .end((err, res) => {
                if (err) return done(new Error('Object could not be removed'));

                const body = res.body;
                const status = res.status;

                expect(status).to.equal(SUCCESS);

                chai.request(server)
                  .get(ROUTE)
                  .send({
                    "options": {}
                  })
                  .end((er, re) => {
                    if (er) return done();

                    const body = re.body;
                    const status = re.status;

                    expect(body.length).to.equal(objectsArray.length - 1);

                    done();
                  });
              });

          } else {
            done(new Error('No objects found in DB'));
          }
        });
    });
  });

});

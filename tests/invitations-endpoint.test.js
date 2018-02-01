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

const Invitation = require('../models/Invitation.js');

const ROUTE = '/invitations';
const SINGLE_ROUTE = '/invitations/:invitationID';
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
  title: 'string',
  description: 'string',
  role: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId()
}, {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  role: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId()
}, {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  role: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId()
}]

const newInvitation = {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  role: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId()
}

const invalidInvitation1 = {
  _id: "123",
  title: 'string',
  description: 'string',
  role: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId()
}

const invalidInvitation2 = {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  role: 'string',
  from: new mongoose.Types.ObjectId(),
  to: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId()
}

describe('API Endpoints for /invitations', () => {

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
    Invitation.remove({})
      .then(() => {
        Invitation.insertMany(objectsArray);
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
    Invitation.remove({})
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
    // GET /invitations
    it('should return MULTIPLE invitation objects as an array', function (done) {
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

                expect(object).to.have.property('title');
                expect(object).to.have.property('description');
                expect(object).to.have.property('role');
                expect(object).to.have.property('from');
                expect(object).to.have.property('to');
                expect(object).to.have.property('project');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.role).to.equal(objectsArray[index].role);
                expect(object.role).to.be.a('string');
                expect(object.from).to.equal(objectsArray[index].from.toHexString());
                expect(object.from).to.be.a('string');
                expect(object.to).to.equal(objectsArray[index].to.toHexString());
                expect(object.to).to.be.a('string');
                expect(object.project).to.equal(objectsArray[index].project.toHexString());
                expect(object.project).to.be.a('string');

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

  // GET /invitations/:invitationID
  describe(`${GET}  ${SINGLE_ROUTE}`, () => {
    it(`should return a SINGLE invitation from ${GET} ${SINGLE_ROUTE}`, (done) => {

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

                expect(object).to.have.property('title');
                expect(object).to.have.property('description');
                expect(object).to.have.property('role');
                expect(object).to.have.property('from');
                expect(object).to.have.property('to');
                expect(object).to.have.property('project');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.role).to.equal(objectsArray[index].role);
                expect(object.role).to.be.a('string');
                expect(object.from).to.equal(objectsArray[index].from.toHexString());
                expect(object.from).to.be.a('string');
                expect(object.to).to.equal(objectsArray[index].to.toHexString());
                expect(object.to).to.be.a('string');
                expect(object.project).to.equal(objectsArray[index].project.toHexString());
                expect(object.project).to.be.a('string');

                done();
              });

          } else {
            done(new Error('No invitations were found in DB'));
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

  // POST /invitations
  describe(`${POST}  ${ROUTE}`, () => {
    it(`should return a SINGLE object from ${POST} ${SINGLE_ROUTE}`, function (done) {
      chai.request(server)
        .post(ROUTE)
        .send(newInvitation)
        .then(function (res) {
          try {

            const body = res.body;
            const status = res.status;

            expect(status).to.equal(SUCCESS);

            expect(body).to.be.an('object');

            const object = body;

            expect(object).to.have.property('title');
            expect(object).to.have.property('description');
            expect(object).to.have.property('role');
            expect(object).to.have.property('from');
            expect(object).to.have.property('to');
            expect(object).to.have.property('project');

            expect(object.title).to.equal(newInvitation.title);
            expect(object.title).to.be.a('string');
            expect(object.description).to.equal(newInvitation.description);
            expect(object.description).to.be.a('string');
            expect(object.role).to.equal(newInvitation.role);
            expect(object.role).to.be.a('string');
            expect(object.from).to.equal(newInvitation.from.toHexString());
            expect(object.from).to.be.a('string');
            expect(object.to).to.equal(newInvitation.to.toHexString());
            expect(object.to).to.be.a('string');
            expect(object.project).to.equal(newInvitation.project.toHexString());
            expect(object.project).to.be.a('string');

            done();
          } catch (e) {
            done(e);
          }
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('should return MULTIPLE invitation objects, including newly added invitation', async function () {
      try {
        await chai.request(server)
          .post(ROUTE)
          .send(newInvitation)
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

                expect(object).to.have.property('title');
                expect(object).to.have.property('description');
                expect(object).to.have.property('role');
                expect(object).to.have.property('from');
                expect(object).to.have.property('to');
                expect(object).to.have.property('project');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.role).to.equal(objectsArray[index].role);
                expect(object.role).to.be.a('string');
                expect(object.from).to.equal(objectsArray[index].from.toHexString());
                expect(object.from).to.be.a('string');
                expect(object.to).to.equal(objectsArray[index].to.toHexString());
                expect(object.to).to.be.a('string');
                expect(object.project).to.equal(objectsArray[index].project.toHexString());
                expect(object.project).to.be.a('string');

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
        .send(invalidInvitation1)
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

  // PUT /invitations/:invitationID
  describe(`${PUT}  ${SINGLE_ROUTE}`, () => {
    it(`should update a SINGLE object with updated fields from ${PUT} ${SINGLE_ROUTE}`, (done) => {
      const updatedValue = 'updatedValue';
      const updatedInvitation = {
        // TODO: Select a property to update.
        title: 'string',
        description: 'string',
        role: 'string',
        from: new mongoose.Types.ObjectId(),
        to: new mongoose.Types.ObjectId(),
        project: new mongoose.Types.ObjectId()
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
              .send(updatedInvitation)
              .end((err, res) => {
                if (err) return done();

                const body = res.body;
                const status = res.status;

                expect(status).to.equal(SUCCESS);

                expect(body).to.be.an('object');

                const object = body;

                expect(object).to.have.property('title');
                expect(object).to.have.property('description');
                expect(object).to.have.property('role');
                expect(object).to.have.property('from');
                expect(object).to.have.property('to');
                expect(object).to.have.property('project');

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

  // DELETE /invitations/:invitationID
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

                expect(object).to.have.property('title');
                expect(object).to.have.property('description');
                expect(object).to.have.property('role');
                expect(object).to.have.property('from');
                expect(object).to.have.property('to');
                expect(object).to.have.property('project');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.role).to.equal(objectsArray[index].role);
                expect(object.role).to.be.a('string');
                expect(object.from).to.equal(objectsArray[index].from.toHexString());
                expect(object.from).to.be.a('string');
                expect(object.to).to.equal(objectsArray[index].to.toHexString());
                expect(object.to).to.be.a('string');
                expect(object.project).to.equal(objectsArray[index].project.toHexString());
                expect(object.project).to.be.a('string');

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

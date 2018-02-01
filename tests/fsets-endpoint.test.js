const {
  TEST
} = require('../variables/serverConfig.js');

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

const Fset = require('../models/Fset.js');

const ROUTE = '/fsets';
const SINGLE_ROUTE = '/fsets/:fsetID';
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
  creator: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId(),
  type: 'string',
  category: 'string'
}, {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  creator: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId(),
  type: 'string',
  category: 'string'
}, {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  creator: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId(),
  type: 'string',
  category: 'string'
}]

const newFset = {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  creator: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId(),
  type: 'string',
  category: 'string'
}

const invalidFset1 = {
  _id: "123",
  title: 'string',
  description: 'string',
  creator: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId(),
  type: 'string',
  category: 'string'
}

const invalidFset2 = {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  creator: new mongoose.Types.ObjectId(),
  project: new mongoose.Types.ObjectId(),
  type: 'string',
  category: 'string'
}

describe('API Endpoints for /fsets', () => {

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
    Fset.remove({})
      .then(() => {
        Fset.insertMany(objectsArray);
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
    Fset.remove({})
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
    // GET /fsets
    it('should return MULTIPLE fset objects as an array', function (done) {
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
                expect(object).to.have.property('creator');
                expect(object).to.have.property('project');
                expect(object).to.have.property('type');
                expect(object).to.have.property('category');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.creator).to.equal(objectsArray[index].creator.toHexString());
                expect(object.creator).to.be.a('string');
                expect(object.project).to.equal(objectsArray[index].project.toHexString());
                expect(object.project).to.be.a('string');
                expect(object.type).to.equal(objectsArray[index].type);
                expect(object.type).to.be.a('string');
                expect(object.category).to.equal(objectsArray[index].category);
                expect(object.category).to.be.a('string');

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

  // GET /fsets/:fsetID
  describe(`${GET}  ${SINGLE_ROUTE}`, () => {
    it(`should return a SINGLE fset from ${GET} ${SINGLE_ROUTE}`, (done) => {

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
                expect(object).to.have.property('creator');
                expect(object).to.have.property('project');
                expect(object).to.have.property('type');
                expect(object).to.have.property('category');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.creator).to.equal(objectsArray[index].creator.toHexString());
                expect(object.creator).to.be.a('string');
                expect(object.project).to.equal(objectsArray[index].project.toHexString());
                expect(object.project).to.be.a('string');
                expect(object.type).to.equal(objectsArray[index].type);
                expect(object.type).to.be.a('string');
                expect(object.category).to.equal(objectsArray[index].category);
                expect(object.category).to.be.a('string');

                done();
              });

          } else {
            done(new Error('No fsets were found in DB'));
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

  // POST /fsets
  describe(`${POST}  ${ROUTE}`, () => {
    it(`should return a SINGLE object from ${POST} ${SINGLE_ROUTE}`, function (done) {
      chai.request(server)
        .post(ROUTE)
        .send(newFset)
        .then(function (res) {
          try {

            const body = res.body;
            const status = res.status;

            expect(status).to.equal(SUCCESS);

            expect(body).to.be.an('object');

            const object = body;

            expect(object).to.have.property('title');
            expect(object).to.have.property('description');
            expect(object).to.have.property('creator');
            expect(object).to.have.property('project');
            expect(object).to.have.property('type');
            expect(object).to.have.property('category');

            expect(object.title).to.equal(newFset.title);
            expect(object.title).to.be.a('string');
            expect(object.description).to.equal(newFset.description);
            expect(object.description).to.be.a('string');
            expect(object.creator).to.equal(newFset.creator.toHexString());
            expect(object.creator).to.be.a('string');
            expect(object.project).to.equal(newFset.project.toHexString());
            expect(object.project).to.be.a('string');
            expect(object.type).to.equal(newFset.type);
            expect(object.type).to.be.a('string');
            expect(object.category).to.equal(newFset.category);
            expect(object.category).to.be.a('string');

            done();
          } catch (e) {
            done(e);
          }
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('should return MULTIPLE fset objects, including newly added fset', async function () {
      try {
        await chai.request(server)
          .post(ROUTE)
          .send(newFset)
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
                expect(object).to.have.property('creator');
                expect(object).to.have.property('project');
                expect(object).to.have.property('type');
                expect(object).to.have.property('category');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.creator).to.equal(objectsArray[index].creator.toHexString());
                expect(object.creator).to.be.a('string');
                expect(object.project).to.equal(objectsArray[index].project.toHexString());
                expect(object.project).to.be.a('string');
                expect(object.type).to.equal(objectsArray[index].type);
                expect(object.type).to.be.a('string');
                expect(object.category).to.equal(objectsArray[index].category);
                expect(object.category).to.be.a('string');

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
        .send(invalidFset1)
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

  // PUT /fsets/:fsetID
  describe(`${PUT}  ${SINGLE_ROUTE}`, () => {
    it(`should update a SINGLE object with updated fields from ${PUT} ${SINGLE_ROUTE}`, (done) => {
      const updatedValue = 'updatedValue';
      const updatedFset = {
        // TODO: Select a property to update.
        title: 'string',
        description: 'string',
        creator: new mongoose.Types.ObjectId(),
        project: new mongoose.Types.ObjectId(),
        type: 'string',
        category: 'string'
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
              .send(updatedFset)
              .end((err, res) => {
                if (err) return done();

                const body = res.body;
                const status = res.status;

                expect(status).to.equal(SUCCESS);

                expect(body).to.be.an('object');

                const object = body;

                expect(object).to.have.property('title');
                expect(object).to.have.property('description');
                expect(object).to.have.property('creator');
                expect(object).to.have.property('project');
                expect(object).to.have.property('type');
                expect(object).to.have.property('category');

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

  // DELETE /fsets/:fsetID
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
                expect(object).to.have.property('creator');
                expect(object).to.have.property('project');
                expect(object).to.have.property('type');
                expect(object).to.have.property('category');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.creator).to.equal(objectsArray[index].creator.toHexString());
                expect(object.creator).to.be.a('string');
                expect(object.project).to.equal(objectsArray[index].project.toHexString());
                expect(object.project).to.be.a('string');
                expect(object.type).to.equal(objectsArray[index].type);
                expect(object.type).to.be.a('string');
                expect(object.category).to.equal(objectsArray[index].category);
                expect(object.category).to.be.a('string');

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

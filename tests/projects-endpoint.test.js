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

const Project = require('../models/Project.js');

const ROUTE = '/projects';
const SINGLE_ROUTE = '/projects/:projectID';
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
  github: 'string',
  likes: [],
  visibility: 'string',
  stories: [],
  featuresets: [],
  features: [],
  access: 'string',
  status: 'string',
  requests: [],
  invitations: [],
  polls: [],
  history: [],
  comments: [],
  technologies: [],
  tags: [],
  followers: [],
  advisors: [],
  participants: [],
  owner: new mongoose.Types.ObjectId()
}, {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  github: 'string',
  likes: [],
  visibility: 'string',
  stories: [],
  featuresets: [],
  features: [],
  access: 'string',
  status: 'string',
  requests: [],
  invitations: [],
  polls: [],
  history: [],
  comments: [],
  technologies: [],
  tags: [],
  followers: [],
  advisors: [],
  participants: [],
  owner: new mongoose.Types.ObjectId()
}, {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  github: 'string',
  likes: [],
  visibility: 'string',
  stories: [],
  featuresets: [],
  features: [],
  access: 'string',
  status: 'string',
  requests: [],
  invitations: [],
  polls: [],
  history: [],
  comments: [],
  technologies: [],
  tags: [],
  followers: [],
  advisors: [],
  participants: [],
  owner: new mongoose.Types.ObjectId()
}]

const newProject = {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  github: 'string',
  likes: [],
  visibility: 'string',
  stories: [],
  featuresets: [],
  features: [],
  access: 'string',
  status: 'string',
  requests: [],
  invitations: [],
  polls: [],
  history: [],
  comments: [],
  technologies: [],
  tags: [],
  followers: [],
  advisors: [],
  participants: [],
  owner: new mongoose.Types.ObjectId()
}

const invalidProject1 = {
  _id: "123",
  title: 'string',
  description: 'string',
  github: 'string',
  likes: [],
  visibility: 'string',
  stories: [],
  featuresets: [],
  features: [],
  access: 'string',
  status: 'string',
  requests: [],
  invitations: [],
  polls: [],
  history: [],
  comments: [],
  technologies: [],
  tags: [],
  followers: [],
  advisors: [],
  participants: [],
  owner: new mongoose.Types.ObjectId()
}

const invalidProject2 = {
  _id: new mongoose.Types.ObjectId(),
  title: 'string',
  description: 'string',
  github: 'string',
  likes: [],
  visibility: 'string',
  stories: [],
  featuresets: [],
  features: [],
  access: 'string',
  status: 'string',
  requests: [],
  invitations: [],
  polls: [],
  history: [],
  comments: [],
  technologies: [],
  tags: [],
  followers: [],
  advisors: [],
  participants: [],
  owner: new mongoose.Types.ObjectId()
}

describe('API Endpoints for /projects', () => {

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
    Project.remove({})
      .then(() => {
        Project.insertMany(objectsArray);
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
    Project.remove({})
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
    // GET /projects
    it('should return MULTIPLE project objects as an array', function (done) {
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
                expect(object).to.have.property('github');
                expect(object).to.have.property('likes');
                expect(object).to.have.property('visibility');
                expect(object).to.have.property('stories');
                expect(object).to.have.property('featuresets');
                expect(object).to.have.property('features');
                expect(object).to.have.property('access');
                expect(object).to.have.property('status');
                expect(object).to.have.property('requests');
                expect(object).to.have.property('invitations');
                expect(object).to.have.property('polls');
                expect(object).to.have.property('history');
                expect(object).to.have.property('comments');
                expect(object).to.have.property('technologies');
                expect(object).to.have.property('tags');
                expect(object).to.have.property('followers');
                expect(object).to.have.property('advisors');
                expect(object).to.have.property('participants');
                expect(object).to.have.property('owner');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.github).to.equal(objectsArray[index].github);
                expect(object.github).to.be.a('string');
                expect(object.likes).to.be.a('array');
                expect(object.visibility).to.equal(objectsArray[index].visibility);
                expect(object.visibility).to.be.a('string');
                expect(object.stories).to.deep.equal(objectsArray[index].stories);
                expect(object.stories).to.be.a('array');
                expect(object.featuresets).to.deep.equal(objectsArray[index].featuresets);
                expect(object.featuresets).to.be.a('array');
                expect(object.features).to.deep.equal(objectsArray[index].features);
                expect(object.features).to.be.a('array');
                expect(object.access).to.equal(objectsArray[index].access);
                expect(object.access).to.be.a('string');
                expect(object.status).to.equal(objectsArray[index].status);
                expect(object.status).to.be.a('string');
                expect(object.requests).to.deep.equal(objectsArray[index].requests);
                expect(object.requests).to.be.a('array');
                expect(object.invitations).to.deep.equal(objectsArray[index].invitations);
                expect(object.invitations).to.be.a('array');
                expect(object.polls).to.deep.equal(objectsArray[index].polls);
                expect(object.polls).to.be.a('array');
                expect(object.history).to.deep.equal(objectsArray[index].history);
                expect(object.history).to.be.a('array');
                expect(object.comments).to.deep.equal(objectsArray[index].comments);
                expect(object.comments).to.be.a('array');
                expect(object.technologies).to.be.a('array');
                expect(object.tags).to.deep.equal(objectsArray[index].tags);
                expect(object.tags).to.be.a('array');
                expect(object.followers).to.be.a('array');
                expect(object.advisors).to.be.a('array');
                expect(object.participants).to.be.a('array');
                expect(object.owner).to.equal(objectsArray[index].owner.toHexString());
                expect(object.owner).to.be.a('string');

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

  // GET /projects/:projectID
  describe(`${GET}  ${SINGLE_ROUTE}`, () => {
    it(`should return a SINGLE project from ${GET} ${SINGLE_ROUTE}`, (done) => {

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
                expect(object).to.have.property('github');
                expect(object).to.have.property('likes');
                expect(object).to.have.property('visibility');
                expect(object).to.have.property('stories');
                expect(object).to.have.property('featuresets');
                expect(object).to.have.property('features');
                expect(object).to.have.property('access');
                expect(object).to.have.property('status');
                expect(object).to.have.property('requests');
                expect(object).to.have.property('invitations');
                expect(object).to.have.property('polls');
                expect(object).to.have.property('history');
                expect(object).to.have.property('comments');
                expect(object).to.have.property('technologies');
                expect(object).to.have.property('tags');
                expect(object).to.have.property('followers');
                expect(object).to.have.property('advisors');
                expect(object).to.have.property('participants');
                expect(object).to.have.property('owner');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.github).to.equal(objectsArray[index].github);
                expect(object.github).to.be.a('string');
                expect(object.likes).to.be.a('array');
                expect(object.visibility).to.equal(objectsArray[index].visibility);
                expect(object.visibility).to.be.a('string');
                expect(object.stories).to.deep.equal(objectsArray[index].stories);
                expect(object.stories).to.be.a('array');
                expect(object.featuresets).to.deep.equal(objectsArray[index].featuresets);
                expect(object.featuresets).to.be.a('array');
                expect(object.features).to.deep.equal(objectsArray[index].features);
                expect(object.features).to.be.a('array');
                expect(object.access).to.equal(objectsArray[index].access);
                expect(object.access).to.be.a('string');
                expect(object.status).to.equal(objectsArray[index].status);
                expect(object.status).to.be.a('string');
                expect(object.requests).to.deep.equal(objectsArray[index].requests);
                expect(object.requests).to.be.a('array');
                expect(object.invitations).to.deep.equal(objectsArray[index].invitations);
                expect(object.invitations).to.be.a('array');
                expect(object.polls).to.deep.equal(objectsArray[index].polls);
                expect(object.polls).to.be.a('array');
                expect(object.history).to.deep.equal(objectsArray[index].history);
                expect(object.history).to.be.a('array');
                expect(object.comments).to.deep.equal(objectsArray[index].comments);
                expect(object.comments).to.be.a('array');
                expect(object.technologies).to.be.a('array');
                expect(object.tags).to.deep.equal(objectsArray[index].tags);
                expect(object.tags).to.be.a('array');
                expect(object.followers).to.be.a('array');
                expect(object.advisors).to.be.a('array');
                expect(object.participants).to.be.a('array');
                expect(object.owner).to.equal(objectsArray[index].owner.toHexString());
                expect(object.owner).to.be.a('string');

                done();
              });

          } else {
            done(new Error('No projects were found in DB'));
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

  // POST /projects
  describe(`${POST}  ${ROUTE}`, () => {
    it(`should return a SINGLE object from ${POST} ${SINGLE_ROUTE}`, function (done) {
      chai.request(server)
        .post(ROUTE)
        .send(newProject)
        .then(function (res) {
          try {

            const body = res.body;
            const status = res.status;

            expect(status).to.equal(SUCCESS);

            expect(body).to.be.an('object');

            const object = body;

            expect(object).to.have.property('title');
            expect(object).to.have.property('description');
            expect(object).to.have.property('github');
            expect(object).to.have.property('likes');
            expect(object).to.have.property('visibility');
            expect(object).to.have.property('stories');
            expect(object).to.have.property('featuresets');
            expect(object).to.have.property('features');
            expect(object).to.have.property('access');
            expect(object).to.have.property('status');
            expect(object).to.have.property('requests');
            expect(object).to.have.property('invitations');
            expect(object).to.have.property('polls');
            expect(object).to.have.property('history');
            expect(object).to.have.property('comments');
            expect(object).to.have.property('technologies');
            expect(object).to.have.property('tags');
            expect(object).to.have.property('followers');
            expect(object).to.have.property('advisors');
            expect(object).to.have.property('participants');
            expect(object).to.have.property('owner');

            expect(object.title).to.equal(newProject.title);
            expect(object.title).to.be.a('string');
            expect(object.description).to.equal(newProject.description);
            expect(object.description).to.be.a('string');
            expect(object.github).to.equal(newProject.github);
            expect(object.github).to.be.a('string');
            expect(object.likes).to.be.a('array');
            expect(object.visibility).to.equal(newProject.visibility);
            expect(object.visibility).to.be.a('string');
            expect(object.stories).to.deep.equal(newProject.stories);
            expect(object.stories).to.be.a('array');
            expect(object.featuresets).to.deep.equal(newProject.featuresets);
            expect(object.featuresets).to.be.a('array');
            expect(object.features).to.deep.equal(newProject.features);
            expect(object.features).to.be.a('array');
            expect(object.access).to.equal(newProject.access);
            expect(object.access).to.be.a('string');
            expect(object.status).to.equal(newProject.status);
            expect(object.status).to.be.a('string');
            expect(object.requests).to.deep.equal(newProject.requests);
            expect(object.requests).to.be.a('array');
            expect(object.invitations).to.deep.equal(newProject.invitations);
            expect(object.invitations).to.be.a('array');
            expect(object.polls).to.deep.equal(newProject.polls);
            expect(object.polls).to.be.a('array');
            expect(object.history).to.deep.equal(newProject.history);
            expect(object.history).to.be.a('array');
            expect(object.comments).to.deep.equal(newProject.comments);
            expect(object.comments).to.be.a('array');
            expect(object.technologies).to.be.a('array');
            expect(object.tags).to.deep.equal(newProject.tags);
            expect(object.tags).to.be.a('array');
            expect(object.followers).to.be.a('array');
            expect(object.advisors).to.be.a('array');
            expect(object.participants).to.be.a('array');
            expect(object.owner).to.equal(newProject.owner.toHexString());
            expect(object.owner).to.be.a('string');

            done();
          } catch (e) {
            done(e);
          }
        })
        .catch(function (err) {
          done(err);
        });
    });

    it('should return MULTIPLE project objects, including newly added project', async function () {
      try {
        await chai.request(server)
          .post(ROUTE)
          .send(newProject)
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
                expect(object).to.have.property('github');
                expect(object).to.have.property('likes');
                expect(object).to.have.property('visibility');
                expect(object).to.have.property('stories');
                expect(object).to.have.property('featuresets');
                expect(object).to.have.property('features');
                expect(object).to.have.property('access');
                expect(object).to.have.property('status');
                expect(object).to.have.property('requests');
                expect(object).to.have.property('invitations');
                expect(object).to.have.property('polls');
                expect(object).to.have.property('history');
                expect(object).to.have.property('comments');
                expect(object).to.have.property('technologies');
                expect(object).to.have.property('tags');
                expect(object).to.have.property('followers');
                expect(object).to.have.property('advisors');
                expect(object).to.have.property('participants');
                expect(object).to.have.property('owner');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.github).to.equal(objectsArray[index].github);
                expect(object.github).to.be.a('string');
                expect(object.likes).to.be.a('array');
                expect(object.visibility).to.equal(objectsArray[index].visibility);
                expect(object.visibility).to.be.a('string');
                expect(object.stories).to.deep.equal(objectsArray[index].stories);
                expect(object.stories).to.be.a('array');
                expect(object.featuresets).to.deep.equal(objectsArray[index].featuresets);
                expect(object.featuresets).to.be.a('array');
                expect(object.features).to.deep.equal(objectsArray[index].features);
                expect(object.features).to.be.a('array');
                expect(object.access).to.equal(objectsArray[index].access);
                expect(object.access).to.be.a('string');
                expect(object.status).to.equal(objectsArray[index].status);
                expect(object.status).to.be.a('string');
                expect(object.requests).to.deep.equal(objectsArray[index].requests);
                expect(object.requests).to.be.a('array');
                expect(object.invitations).to.deep.equal(objectsArray[index].invitations);
                expect(object.invitations).to.be.a('array');
                expect(object.polls).to.deep.equal(objectsArray[index].polls);
                expect(object.polls).to.be.a('array');
                expect(object.history).to.deep.equal(objectsArray[index].history);
                expect(object.history).to.be.a('array');
                expect(object.comments).to.deep.equal(objectsArray[index].comments);
                expect(object.comments).to.be.a('array');
                expect(object.technologies).to.be.a('array');
                expect(object.tags).to.deep.equal(objectsArray[index].tags);
                expect(object.tags).to.be.a('array');
                expect(object.followers).to.be.a('array');
                expect(object.advisors).to.be.a('array');
                expect(object.participants).to.be.a('array');
                expect(object.owner).to.equal(objectsArray[index].owner.toHexString());
                expect(object.owner).to.be.a('string');

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
        .send(invalidProject1)
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

  // PUT /projects/:projectID
  describe(`${PUT}  ${SINGLE_ROUTE}`, () => {
    it(`should update a SINGLE object with updated fields from ${PUT} ${SINGLE_ROUTE}`, (done) => {
      const updatedValue = 'updatedValue';
      const updatedProject = {
        // TODO: Select a property to update.
        title: 'string',
        description: 'string',
        github: 'string',
        likes: [],
        visibility: 'string',
        stories: [],
        featuresets: [],
        features: [],
        access: 'string',
        status: 'string',
        requests: [],
        invitations: [],
        polls: [],
        history: [],
        comments: [],
        technologies: [],
        tags: [],
        followers: [],
        advisors: [],
        participants: [],
        owner: new mongoose.Types.ObjectId()
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
              .send(updatedProject)
              .end((err, res) => {
                if (err) return done();

                const body = res.body;
                const status = res.status;

                expect(status).to.equal(SUCCESS);

                expect(body).to.be.an('object');

                const object = body;

                expect(object).to.have.property('title');
                expect(object).to.have.property('description');
                expect(object).to.have.property('github');
                expect(object).to.have.property('likes');
                expect(object).to.have.property('visibility');
                expect(object).to.have.property('stories');
                expect(object).to.have.property('featuresets');
                expect(object).to.have.property('features');
                expect(object).to.have.property('access');
                expect(object).to.have.property('status');
                expect(object).to.have.property('requests');
                expect(object).to.have.property('invitations');
                expect(object).to.have.property('polls');
                expect(object).to.have.property('history');
                expect(object).to.have.property('comments');
                expect(object).to.have.property('technologies');
                expect(object).to.have.property('tags');
                expect(object).to.have.property('followers');
                expect(object).to.have.property('advisors');
                expect(object).to.have.property('participants');
                expect(object).to.have.property('owner');

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

  // DELETE /projects/:projectID
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
                expect(object).to.have.property('github');
                expect(object).to.have.property('likes');
                expect(object).to.have.property('visibility');
                expect(object).to.have.property('stories');
                expect(object).to.have.property('featuresets');
                expect(object).to.have.property('features');
                expect(object).to.have.property('access');
                expect(object).to.have.property('status');
                expect(object).to.have.property('requests');
                expect(object).to.have.property('invitations');
                expect(object).to.have.property('polls');
                expect(object).to.have.property('history');
                expect(object).to.have.property('comments');
                expect(object).to.have.property('technologies');
                expect(object).to.have.property('tags');
                expect(object).to.have.property('followers');
                expect(object).to.have.property('advisors');
                expect(object).to.have.property('participants');
                expect(object).to.have.property('owner');

                expect(object.title).to.equal(objectsArray[index].title);
                expect(object.title).to.be.a('string');
                expect(object.description).to.equal(objectsArray[index].description);
                expect(object.description).to.be.a('string');
                expect(object.github).to.equal(objectsArray[index].github);
                expect(object.github).to.be.a('string');
                expect(object.likes).to.be.a('array');
                expect(object.visibility).to.equal(objectsArray[index].visibility);
                expect(object.visibility).to.be.a('string');
                expect(object.stories).to.deep.equal(objectsArray[index].stories);
                expect(object.stories).to.be.a('array');
                expect(object.featuresets).to.deep.equal(objectsArray[index].featuresets);
                expect(object.featuresets).to.be.a('array');
                expect(object.features).to.deep.equal(objectsArray[index].features);
                expect(object.features).to.be.a('array');
                expect(object.access).to.equal(objectsArray[index].access);
                expect(object.access).to.be.a('string');
                expect(object.status).to.equal(objectsArray[index].status);
                expect(object.status).to.be.a('string');
                expect(object.requests).to.deep.equal(objectsArray[index].requests);
                expect(object.requests).to.be.a('array');
                expect(object.invitations).to.deep.equal(objectsArray[index].invitations);
                expect(object.invitations).to.be.a('array');
                expect(object.polls).to.deep.equal(objectsArray[index].polls);
                expect(object.polls).to.be.a('array');
                expect(object.history).to.deep.equal(objectsArray[index].history);
                expect(object.history).to.be.a('array');
                expect(object.comments).to.deep.equal(objectsArray[index].comments);
                expect(object.comments).to.be.a('array');
                expect(object.technologies).to.be.a('array');
                expect(object.tags).to.deep.equal(objectsArray[index].tags);
                expect(object.tags).to.be.a('array');
                expect(object.followers).to.be.a('array');
                expect(object.advisors).to.be.a('array');
                expect(object.participants).to.be.a('array');
                expect(object.owner).to.equal(objectsArray[index].owner.toHexString());
                expect(object.owner).to.be.a('string');

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

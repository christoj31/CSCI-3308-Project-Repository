// ********************** Initialize server **********************************

const server = require('../src/index.js'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;


// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});


// *********************** TODO: WRITE 2 UNIT TESTCASES **************************
describe('Testing Register API', () => {
  it('Positive: Should register a user successfully', done => {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'testuser1',
        email: 'testuser@gmail.com',
        phoneNumber: '123-456-7890',
        password: 'Pasword@1',
        'retype password': 'Pasword@1'
      })
      .end((err, res) => {
        if (err) {
          console.error("Error during test:", err);
        } else {
          console.log("Response body:", res.body);
        }
        expect(res).to.have.status(200);
        done();
      });
  });
  
  it('Negative: Should fail when passwords do not match', done => {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'uniqueuser2',
        email: 'uniqueuser2@gmail.com',
        phoneNumber: '223-456-7890',
        password: 'Pasword@1',
        'retype password': 'Pasword@2'
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        assert.include(res.text, 'Passwords do not match.');
        done();
      });
  });
});

describe('Testing Additional APIs', () => {
  // Test the /login endpoint
  it('Positive: Should login successfully with correct credentials', done => {
    chai
      .request(server)
      .post('/login')
      .send({
        username: 'johnDoe',
        password: 'pass12'
      })
      .end((err, res) => {
        expect(res).to.have.status(200); // Expecting redirect on successful login
        expect(res).to.redirectTo(/^http:\/\/127\.0\.0\.1:\d{5}\/home$/);
        done();
      });
  });
    // Test the /login endpoint
    it('Negitive: Should login successfully with correct credentials', done => {
      chai
        .request(server)
        .post('/login')
        .send({
          username: 'johnDoe',
          password: 'pass121524@'
        })
        .end((err, res) => {
          expect(res).to.have.status(400); // Expecting redirect on successful login
          assert.include(res.text, 'Incorrect username or password.');;
          done();
        });
    });

  // Test the /jobs endpoint
  it('Positive: Should retrieve list of jobs', done => {
    chai
      .request(server)
      .get('/jobs')
      .end((err, res) => {
        expect(res).to.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });
});


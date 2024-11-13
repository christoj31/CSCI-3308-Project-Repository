const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server/routes/dropdownRoutes'); // Adjust path to your app’s entry file

chai.use(chaiHttp);
const { expect } = chai;

describe('Dropdown Routes', () => {
    it('should get dropdown options successfully', (done) => {
        chai.request(app)
            .get('/dropdown/') // Replace with your actual route
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array'); // Expecting an array of options
                done();
            });
    });

    it('should add a new dropdown option', (done) => {
        chai.request(app)
            .post('/dropdown/options') // Replace with your actual POST route
            .send({ optionName: 'New Option' }) // Replace with required body fields
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'Option added');
                done();
            });
    });
});
/* eslint-env mocha */
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';
import data from '../dataStorage/data';

chai.use(chaiHttp);

const testingQuestion1 = 'What is this?';
const testingAnswer1 = 'It ia a ball';
const emptyQuestion = '   ';

describe('Server', () => {
  beforeEach((done) => {
    data.deleteAllQuestions();
    done();
  });

  describe('/GET /api/v1/questions', () => {
    it('should GET an empty array when are no questions', (done) => {
      chai.request(app)
        .get('/api/v1/questions')
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isArray(res.body);
          assert.isEmpty(res.body);
          done();
        });
    });

    it('should GET an array of all questions', (done) => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      chai.request(app)
        .get('/api/v1/questions')
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isArray(res.body);
          assert.isNotEmpty(res.body);
          assert.lengthOf(res.body, 1);
          assert.isObject(res.body[0]);
          assert.hasAllKeys(res.body[0], ['id', 'question', 'answers']);
          assert.isString(res.body[0].id);
          assert.strictEqual(res.body[0].id, qtnId);
          assert.isString(res.body[0].question);
          assert.strictEqual(res.body[0].question, testingQuestion1);
          assert.isArray(res.body[0].answers);
          assert.isEmpty(res.body[0].answers);
          done();
        });
    });

    it('should GET all questions and their answers', (done) => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      const { answers: [{ id: ansId }] } = data.addAnswer(qtnId, testingAnswer1);

      chai.request(app)
        .get('/api/v1/questions')
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isArray(res.body);
          assert.isNotEmpty(res.body);
          assert.lengthOf(res.body, 1);
          assert.isObject(res.body[0]);
          assert.hasAllKeys(res.body[0], ['id', 'question', 'answers']);
          assert.isString(res.body[0].id);
          assert.strictEqual(res.body[0].id, qtnId);
          assert.isString(res.body[0].question);
          assert.strictEqual(res.body[0].question, testingQuestion1);
          assert.hasAllKeys(res.body[0].answers[0], ['id', 'answer']);
          assert.isString(res.body[0].answers[0].id);
          assert.strictEqual(res.body[0].answers[0].id, ansId);
          assert.isString(res.body[0].answers[0].answer);
          assert.deepEqual(res.body[0].answers[0].answer, testingAnswer1);
          done();
        });
    });
  });

  describe('/POST /api/v1/questions', () => {
    it('should not POST an empty question', (done) => {
      chai.request(app)
        .post('/api/v1/questions')
        .send({ emptyQuestion })
        .end((err, res) => {
          assert.strictEqual(res.status, 422);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Unsuccessful. Empty input field');
          done();
        });
    });

    it('should POST a question', (done) => {
      chai.request(app)
        .post('/api/v1/questions')
        .send({ testingQuestion1 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message', 'question']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Question successfully posted');
          assert.isObject(res.body.question);
          assert.isNotEmpty(res.body.question);
          assert.hasAllKeys(res.body.question, ['id', 'question', 'answers']);
          assert.isString(res.body.question.id);
          assert.isString(res.body.question.question);
          assert.strictEqual(res.body.question.question, testingQuestion1);
          assert.isArray(res.body.question.answers);
          assert.isEmpty(res.body.question.answers);
          done();
        });
    });
  });
});

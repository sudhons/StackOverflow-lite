/* eslint-env mocha */
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/app';
import Question from '../src/dataStorage/data';

chai.use(chaiHttp);

const title = 'Computer';
const testingQuestion1 = 'What is this?';
const testingQuestion2 = 'This is what?';
const testingAnswer1 = 'It is a ball';
const testingAnswer2 = 'It is an egg';
const emptyQuestion = '   ';
const emptyAnswer = '   ';
const nonExistingQuestionId = '3bttte';
const nonExistingAnswerId = 'qw754w';

describe('App', () => {
  beforeEach((done) => {
    Question.deleteAllQuestions();
    done();
  });

  describe('/GET /', () => {
    it('should GET an Object with a message key', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.strictEqual(res.body.message, 'StackOverflow-lite');
          done();
        });
    });
  });

  describe('/GET /api/v1', () => {
    it('should GET an Object with a message key', (done) => {
      chai.request(app)
        .get('/api/v1')
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.strictEqual(res.body.message, 'StackOverflow-lite');
          done();
        });
    });
  });

  describe('/GET /api/v1/questions', () => {
    it('should GET an empty array when there are no questions', (done) => {
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
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      chai.request(app)
        .get('/api/v1/questions')
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isArray(res.body);
          assert.isNotEmpty(res.body);
          assert.lengthOf(res.body, 1);
          assert.isObject(res.body[0]);
          assert.hasAllKeys(res.body[0], ['id', 'title', 'date', 'question', 'answers']);
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
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      const { answers: [{ id: ansId }] } = Question.addAnswer(qtnId, testingAnswer1);

      chai.request(app)
        .get('/api/v1/questions')
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isArray(res.body);
          assert.isNotEmpty(res.body);
          assert.lengthOf(res.body, 1);
          assert.isObject(res.body[0]);
          assert.hasAllKeys(res.body[0], ['id', 'title', 'question', 'date', 'answers']);
          assert.isString(res.body[0].id);
          assert.strictEqual(res.body[0].id, qtnId);
          assert.isString(res.body[0].question);
          assert.strictEqual(res.body[0].question, testingQuestion1);
          assert.hasAllKeys(res.body[0].answers[0], ['id', 'answer', 'date']);
          assert.isString(res.body[0].answers[0].id);
          assert.strictEqual(res.body[0].answers[0].id, ansId);
          assert.isString(res.body[0].answers[0].answer);
          assert.deepEqual(res.body[0].answers[0].answer, testingAnswer1);
          done();
        });
    });
  });

  describe('/POST /api/v1/questions', () => {
    it('should not POST an empty question title', (done) => {
      chai.request(app)
        .post('/api/v1/questions')
        .send({ title: '  ', question: testingQuestion1 })
        .end((err, res) => {
          assert.strictEqual(res.status, 422);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Unsuccessful. Title field is Empty');
          done();
        });
    });

    it('should not POST an empty question', (done) => {
      chai.request(app)
        .post('/api/v1/questions')
        .send({ title, question: emptyQuestion })
        .end((err, res) => {
          assert.strictEqual(res.status, 422);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Unsuccessful. Question field is Empty');
          done();
        });
    });

    it('should POST a question', (done) => {
      chai.request(app)
        .post('/api/v1/questions')
        .send({ title, question: testingQuestion1 })
        .end((err, res) => {
          assert.strictEqual(res.status, 201);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message', 'question']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Question successfully posted');
          assert.isObject(res.body.question);
          assert.isNotEmpty(res.body.question);
          assert.hasAllKeys(res.body.question, ['id', 'title', 'question', 'date', 'answers']);
          assert.isString(res.body.question.id);
          assert.isString(res.body.question.question);
          assert.strictEqual(res.body.question.question, testingQuestion1);
          assert.isArray(res.body.question.answers);
          assert.isEmpty(res.body.question.answers);
          done();
        });
    });
  });

  describe('/GET /api/v1/questions/:id', () => {
    it('should not GET any question when the given question id does not exist', (done) => {
      Question.addQuestion(title, testingQuestion1);
      chai.request(app)
        .get(`/api/v1/questions/${nonExistingQuestionId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 404);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, `Unsuccessful. Question with id ${nonExistingQuestionId} is not found`);
          done();
        });
    });

    it('should GET a question by the given id', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      chai.request(app)
        .get(`/api/v1/questions/${qtnId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['id', 'title', 'question', 'date', 'answers']);
          assert.isString(res.body.id);
          assert.strictEqual(res.body.id, qtnId);
          assert.isString(res.body.question);
          assert.strictEqual(res.body.question, testingQuestion1);
          assert.isArray(res.body.answers);
          assert.isEmpty(res.body.answers);
          done();
        });
    });

    it('should GET a question by the given id and it answers', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      Question.addAnswer(qtnId, testingAnswer1);
      chai.request(app)
        .get(`/api/v1/questions/${qtnId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['id', 'title', 'question', 'date', 'answers']);
          assert.isString(res.body.id);
          assert.strictEqual(res.body.id, qtnId);
          assert.isString(res.body.question);
          assert.strictEqual(res.body.question, testingQuestion1);
          assert.isArray(res.body.answers);
          assert.isNotEmpty(res.body.answers);
          assert.lengthOf(res.body.answers, 1);
          assert.hasAllKeys(res.body.answers[0], ['id', 'answer', 'date']);
          assert.strictEqual(res.body.answers[0].answer, testingAnswer1);
          done();
        });
    });
  });

  describe('/PUT /api/v1/questions/:id', () => {
    it('should not UPDATE any question when the given question id does not exist', (done) => {
      Question.addQuestion(title, testingQuestion1);
      chai.request(app)
        .put(`/api/v1/questions/${nonExistingQuestionId}`)
        .send({ title, question: testingQuestion2 })
        .end((err, res) => {
          assert.strictEqual(res.status, 404);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, `Unsuccessful. Question with id ${nonExistingQuestionId} is not found`);
          done();
        });
    });

    it('should not UPDATE with an empty question', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingAnswer1);
      chai.request(app)
        .put(`/api/v1/questions/${qtnId}`)
        .send({ title, question: emptyQuestion })
        .end((err, res) => {
          assert.strictEqual(res.status, 422);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Unsuccessful. Question field is Empty');
          done();
        });
    });

    it('should UPDATE a question of a given id', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      chai.request(app)
        .put(`/api/v1/questions/${qtnId}`)
        .send({ title, question: testingQuestion2 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message', 'question']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Question successfully updated');
          assert.isObject(res.body.question);
          assert.isNotEmpty(res.body.question);
          assert.hasAllKeys(res.body.question, ['id', 'title', 'question', 'date', 'answers']);
          assert.isString(res.body.question.id);
          assert.strictEqual(res.body.question.id, qtnId);
          assert.isString(res.body.question.question);
          assert.strictEqual(res.body.question.question, testingQuestion2);
          assert.isArray(res.body.question.answers);
          assert.isEmpty(res.body.question.answers);
          done();
        });
    });
  });

  describe('/DELETE /api/v1/questions/:id', () => {
    it('should not DELETE any question when the given question id does not exist', (done) => {
      Question.addQuestion(title, testingQuestion1);
      chai.request(app)
        .delete(`/api/v1/questions/${nonExistingQuestionId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 404);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, `Unsuccessful. Question with id ${nonExistingQuestionId} is not found`);
          done();
        });
    });

    it('should DELETE a question by the given id', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      chai.request(app)
        .delete(`/api/v1/questions/${qtnId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message', 'question']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Question successfully deleted');
          assert.isObject(res.body.question);
          assert.isNotEmpty(res.body.question);
          done();
        });
    });
  });

  describe('/POST /api/v1/questions/:id/answers', () => {
    it('should not POST an answer when the given question id does not exist', (done) => {
      Question.addQuestion(title, testingQuestion1);
      chai.request(app)
        .post(`/api/v1/questions/${nonExistingQuestionId}/answers`)
        .send({ answer: testingAnswer1 })
        .end((err, res) => {
          assert.strictEqual(res.status, 404);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, `Unsuccessful. Question with id ${nonExistingQuestionId} is not found`);
          done();
        });
    });

    it('should not POST an empty answer', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      chai.request(app)
        .post(`/api/v1/questions/${qtnId}/answers`)
        .send({ answer: emptyAnswer })
        .end((err, res) => {
          assert.strictEqual(res.status, 422);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Unsuccessful. Answer field is Empty');
          done();
        });
    });

    it('should POST an answer to the question of the given id', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      chai.request(app)
        .post(`/api/v1/questions/${qtnId}/answers`)
        .send({ answer: testingAnswer1 })
        .end((err, res) => {
          assert.strictEqual(res.status, 201);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message', 'question']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Answer successfully posted');
          assert.isObject(res.body.question);
          assert.isNotEmpty(res.body.question);
          assert.hasAllKeys(res.body.question, ['id', 'title', 'question', 'answers', 'date']);
          assert.lengthOf(res.body.question.answers, 1);
          assert.isObject(res.body.question.answers[0]);
          assert.hasAllKeys(res.body.question.answers[0], ['id', 'answer', 'date']);
          assert.isString(res.body.question.answers[0].id);
          assert.isString(res.body.question.answers[0].answer);
          assert.strictEqual(res.body.question.answers[0].answer, testingAnswer1);
          done();
        });
    });
  });

  describe('/GET /api/v1/questions/:qtnId/answers/:ansId', () => {
    it('should not GET any answer when the given question id does not exist', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      const { answers: [{ id: ansId }] } = Question.addAnswer(qtnId, testingAnswer1);
      chai.request(app)
        .get(`/api/v1/questions/${nonExistingQuestionId}/answers/${ansId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 404);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, `Unsuccessful. Question with id ${nonExistingQuestionId} is not found`);
          done();
        });
    });

    it('should not GET any answer when the given answer id does not exist', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      Question.addAnswer(qtnId, testingAnswer1);
      chai.request(app)
        .get(`/api/v1/questions/${qtnId}/answers/${nonExistingAnswerId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 404);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, `Unsuccessful. Answer with id ${nonExistingAnswerId} is not found`);
          done();
        });
    });

    it('should GET an answer by the given answer id', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      const { answers: [{ id: ansId }] } = Question.addAnswer(qtnId, testingAnswer1);
      chai.request(app)
        .get(`/api/v1/questions/${qtnId}/answers/${ansId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['id', 'answer', 'date']);
          assert.isString(res.body.id);
          assert.strictEqual(res.body.id, ansId);
          assert.isString(res.body.answer);
          assert.strictEqual(res.body.answer, testingAnswer1);
          done();
        });
    });
  });

  describe('/PUT /api/vi/questions/:qtnId/answers/:ansId', () => {
    it('should not UPDATE any answer when the given question id does not exist', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      const { answers: [{ id: ansId }] } = Question.addAnswer(qtnId, testingAnswer1);
      chai.request(app)
        .put(`/api/v1/questions/${nonExistingQuestionId}/answers/${ansId}`)
        .send({ answer: testingAnswer2 })
        .end((err, res) => {
          assert.strictEqual(res.status, 404);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, `Unsuccessful. Question with id ${nonExistingQuestionId} is not found`);
          done();
        });
    });

    it('should not UPDATE any answer when the given answer id does not exist', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      Question.addAnswer(qtnId, testingAnswer1);
      chai.request(app)
        .put(`/api/v1/questions/${qtnId}/answers/${nonExistingAnswerId}`)
        .send({ answer: testingAnswer2 })
        .end((err, res) => {
          assert.strictEqual(res.status, 404);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, `Unsuccessful. Answer with id ${nonExistingAnswerId} is not found`);
          done();
        });
    });

    it('should not UPDATE with an empty answer', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      const { answers: [{ id: ansId }] } = Question.addAnswer(qtnId, testingAnswer1);
      chai.request(app)
        .put(`/api/v1/questions/${qtnId}/answers/${ansId}`)
        .send({ answer: emptyAnswer })
        .end((err, res) => {
          assert.strictEqual(res.status, 422);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Unsuccessful. Answer field is Empty');
          done();
        });
    });

    it('should UPDATE an answer of the given answer id', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      const { answers: [{ id: ansId }] } = Question.addAnswer(qtnId, testingAnswer1);
      chai.request(app)
        .put(`/api/v1/questions/${qtnId}/answers/${ansId}`)
        .send({ answer: testingAnswer2 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message', 'question']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Answer successfully updated');
          assert.isObject(res.body.question);
          assert.isNotEmpty(res.body.question);
          assert.hasAllKeys(res.body.question, ['id', 'title', 'question', 'answers', 'date']);
          assert.lengthOf(res.body.question.answers, 1);
          assert.isObject(res.body.question.answers[0]);
          assert.hasAllKeys(res.body.question.answers[0], ['id', 'answer', 'date']);
          assert.strictEqual(res.body.question.answers[0].answer, testingAnswer2);
          done();
        });
    });
  });

  describe('/DELETE /api/v1/questions/:qtnId/answers/:ansId', () => {
    it('should not DELETE any answer when the given question id does not exist', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      const { answers: [{ id: ansId }] } = Question.addAnswer(qtnId, testingAnswer1);

      chai.request(app)
        .delete(`/api/v1/questions/${nonExistingQuestionId}/answers/${ansId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 404);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, `Unsuccessful. Question with id ${nonExistingQuestionId} is not found`);
          done();
        });
    });

    it('should not DELETE any answer when the given answer id does not exist', (done) => {
      const { id: qtnId } = Question.addQuestion(testingQuestion1);
      Question.addAnswer(qtnId, testingAnswer1);

      chai.request(app)
        .delete(`/api/v1/questions/${qtnId}/answers/${nonExistingAnswerId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 404);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, `Unsuccessful. Answer with id ${nonExistingAnswerId} is not found`);
          done();
        });
    });

    it('should DELETE an answer of the given answer id', (done) => {
      const { id: qtnId } = Question.addQuestion(title, testingQuestion1);
      const { answers: [{ id: ansId }] } = Question.addAnswer(qtnId, testingAnswer1);

      chai.request(app)
        .delete(`/api/v1/questions/${qtnId}/answers/${ansId}`)
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isNotEmpty(res.body);
          assert.hasAllKeys(res.body, ['message', 'question']);
          assert.isString(res.body.message);
          assert.strictEqual(res.body.message, 'Answer successfully deleted');
          assert.isObject(res.body.question);
          assert.isNotEmpty(res.body.question);
          assert.hasAllKeys(res.body.question, ['id', 'title', 'question', 'answers', 'date']);
          assert.isArray(res.body.question.answers);
          assert.isEmpty(res.body.question.answers);
          done();
        });
    });
  });
});

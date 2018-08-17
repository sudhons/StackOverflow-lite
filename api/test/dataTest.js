/* eslint-env mocha */
import { assert } from 'chai';

import data from '../dataStorage/data';

const testingQuestion1 = 'What is this?';
const testingQuestion2 = 'This is what?';
const testingAnswer1 = 'It ia a ball';
const testingAnswer2 = 'It is an egg';
const emptyQuestion = '   ';
const emptyAnswer = '   ';
const nonExistingQuestionId = '3bttte';
const nonExistingAnswerId = 'qw754w';

describe('data', () => {
  beforeEach((done) => {
    data.deleteAllQuestions();
    done();
  });

  describe('data.addQuestion', () => {
    it('should not add an empty question', (done) => {
      const result = data.addQuestion(emptyQuestion);

      assert.isNull(result);
      done();
    });

    it('should add a question', (done) => {
      const result = data.addQuestion(testingQuestion1);

      assert.isObject(result);
      assert.isNotEmpty(result);
      assert.hasAllKeys(result, ['id', 'question', 'answers']);
      assert.isString(result.id);
      assert.isString(result.question);
      assert.strictEqual(result.question, testingQuestion1);
      assert.isArray(result.answers);
      assert.isEmpty(result.answers);
      done();
    });
  });

  describe('data.getQuestions', () => {
    it('should return an empty array when there are no questions', () => {
      const result = data.getQuestions();

      assert.isArray(result);
      assert.isEmpty(result);
    });

    it('should return an array of questions', () => {
      data.addQuestion(testingQuestion1);
      const result = data.getQuestions();

      assert.isArray(result);
      assert.isNotEmpty(result);
      assert.lengthOf(result, 1);
      assert.isObject(result[0]);
      assert.hasAllKeys(result[0], ['id', 'question', 'answers']);
      assert.isString(result[0].id);
      assert.isString(result[0].question);
      assert.isArray(result[0].answers);
      assert.isEmpty(result[0].answers);
    });
  });

  describe('data.getQuestion', () => {
    it('should not get any question by a non-existing id', () => {
      data.addQuestion(testingQuestion1);
      const result = data.getQuestion(nonExistingQuestionId);

      assert.isNull(result);
    });

    it('should get a question by its id', () => {
      const { id } = data.addQuestion(testingQuestion1);
      const result = data.getQuestion(id);

      assert.isObject(result);
      assert.isNotEmpty(result);
      assert.hasAllKeys(result, ['id', 'question', 'answers']);
      assert.isString(result.id);
      assert.strictEqual(result.id, id);
      assert.isString(result.question);
      assert.strictEqual(result.question, testingQuestion1);
      assert.isArray(result.answers);
      assert.isEmpty(result.answers);
    });
  });

  describe('data.deleteQuestion', () => {
    it('should not delete any question by a non-existing question id', () => {
      data.addQuestion(testingQuestion1);
      const result = data.deleteQuestion(nonExistingQuestionId);

      assert.isNull(result);
    });

    it('should delete a question by its id', () => {
      const { id } = data.addQuestion(testingQuestion1);
      data.deleteQuestion(id);

      const result = data.getQuestion(id);
      assert.isNull(result);
    });
  });

  describe('data.updateQuestion', () => {
    it('should not update any question by a non-existing question id', () => {
      data.addQuestion(testingQuestion1);
      const result = data.updateQuestion(nonExistingQuestionId, testingQuestion2);

      assert.isNull(result);
    });

    it('should not update a question with an empty value', () => {
      const { id } = data.addQuestion(testingQuestion1);
      const result = data.updateQuestion(id, emptyQuestion);

      assert.isNull(result);
    });

    it('should update a question by its id', () => {
      const { id } = data.addQuestion(testingQuestion1);
      const result = data.updateQuestion(id, testingQuestion2);

      assert.isObject(result);
      assert.isNotEmpty(result);
      assert.hasAllKeys(result, ['id', 'question', 'answers']);
      assert.isString(result.id);
      assert.strictEqual(result.id, id);
      assert.isString(result.question);
      assert.strictEqual(result.question, testingQuestion2);
      assert.isArray(result.answers);
      assert.isEmpty(result.answers);
    });
  });

  describe('data.addAnswer', () => {
    it('should not add an answer by a non-existing question id', () => {
      data.addQuestion(testingQuestion1);
      const result = data.addAnswer(nonExistingQuestionId, testingAnswer1);

      assert.isNull(result);
    });

    it('should not add an empty answer', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      const result = data.addAnswer(qtnId, emptyAnswer);

      assert.isNull(result);
    });

    it('should add the first answer', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      const { answers } = data.addAnswer(qtnId, testingAnswer1);

      assert.isArray(answers);
      assert.isNotEmpty(answers);
      assert.lengthOf(answers, 1);
      assert.isObject(answers[0]);
      assert.hasAllKeys(answers[0], ['id', 'answer']);
      assert.strictEqual(answers[0].answer, testingAnswer1);
    });

    it('should add a new answer', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      data.addAnswer(qtnId, testingAnswer1);
      const { answers } = data.addAnswer(qtnId, testingAnswer2);

      assert.isArray(answers);
      assert.isNotEmpty(answers);
      assert.lengthOf(answers, 2);
      assert.isObject(answers[1]);
      assert.hasAllKeys(answers[1], ['id', 'answer']);
      assert.strictEqual(answers[1].answer, testingAnswer2);
    });
  });

  describe('data.getAnswer', () => {
    it('should not get an answer by a non-existing question id', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      const { answers: [{ id: ansId }] } = data.addAnswer(qtnId, testingAnswer1);
      const result = data.getAnswer(nonExistingQuestionId, ansId);

      assert.isNull(result);
    });

    it('should not get an answer by a non-existing answer id', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      data.addAnswer(qtnId, testingAnswer1);
      const result = data.getAnswer(qtnId, nonExistingAnswerId);

      assert.isNull(result);
    });

    it('should get an answer', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      const { answers: [{ id: ansId }] } = data.addAnswer(qtnId, testingAnswer1);
      const { answer } = data.getAnswer(qtnId, ansId);

      assert.isString(answer);
      assert.strictEqual(answer, testingAnswer1);
    });
  });

  describe('data.deleteAnswer', () => {
    it('should not delete an answer by a non-existing question id', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      const { answers: [{ id: ansId }] } = data.addAnswer(qtnId, testingAnswer1);
      const result = data.deleteAnswer(nonExistingQuestionId, ansId);

      assert.isNull(result);
    });

    it('should not delete an answer by a non-existing answer id', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      data.addAnswer(qtnId, testingAnswer1);
      const result = data.deleteAnswer(qtnId, nonExistingAnswerId);

      assert.isNull(result);
    });

    it('should delete an answer', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      const { answers: [{ id: ansId }] } = data.addAnswer(qtnId, testingAnswer1);
      data.deleteAnswer(qtnId, ansId);
      const result = data.getAnswer(qtnId, ansId);

      assert.isNull(result);
    });
  });

  describe('data.updateAnswer', () => {
    it('should not update an answer by a non-existing question id', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      const { answers: [{ id: ansId }] } = data.addAnswer(qtnId, testingAnswer1);
      const result = data.updateAnswer(nonExistingQuestionId, ansId, testingAnswer2);

      assert.isNull(result);
    });

    it('should not update an answer by a non-existing answer id', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      data.addAnswer(qtnId, testingAnswer1);
      const result = data.updateAnswer(qtnId, nonExistingAnswerId, testingAnswer2);

      assert.isNull(result);
    });

    it('should not update an answer with an empty value', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      const { answers: [{ id: ansId }] } = data.addAnswer(qtnId, testingAnswer1);
      const result = data.updateAnswer(qtnId, ansId, emptyAnswer);

      assert.isNull(result);
    });

    it('should update an answer', () => {
      const { id: qtnId } = data.addQuestion(testingQuestion1);
      const { answers: [{ id: ansId }] } = data.addAnswer(qtnId, testingAnswer1);
      const { answers: [{ answer }] } = data.updateAnswer(qtnId, ansId, testingAnswer2);

      assert.strictEqual(answer, testingAnswer2);
    });
  });
});

import express from 'express';

import Question from '../controllers/questionsController';
import Answer from '../controllers/answersController';
import Validator from '../validators/validator';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'StackOverflow-lite' });
});

router.get('/questions', Validator.authorizeUser, Question.getQuestionList);
router.post('/questions', Validator.authorizeUser, Validator.validateQuestion, Question.addQuestion);
router.get('/questions/:id', Validator.authorizeUser, Question.getQuestion);
router.put('/questions/:id', Validator.authorizeUser, Validator.validateQuestion, Question.updateQuestion);
router.delete('/questions/:id', Validator.authorizeUser, Question.deleteQuestion);

router.post('/questions/:qtnId/answers', Validator.authorizeUser, Validator.validateAnswer, Answer.addAnswer);
router.get('/questions/:qtnId/answers/:ansId', Validator.authorizeUser, Answer.getAnswer);
router.put('/questions/:qtnId/answers/:ansId', Validator.authorizeUser, Validator.validateAnswer, Answer.updateAnswer);
router.delete('/questions/:qtnId/answers/:ansId', Validator.authorizeUser, Answer.deleteAnswer);

export default router;

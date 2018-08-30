import express from 'express';

import Question from '../controllers/questionsController';
import Validator from '../validators/validator';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'StackOverflow-lite' });
});

router.get('/questions', Validator.authorizeUser, Question.getQuestionList);
router.post('/questions', Validator.authorizeUser, Validator.validateQuestion, Question.addQuestion);
router.get('/questions/:id', Validator.authorizeUser, Question.getQuestion);
router.put('/questions/:id', Validator.authorizeUser, Validator.validateQuestion, Question.updateQuestion);

export default router;

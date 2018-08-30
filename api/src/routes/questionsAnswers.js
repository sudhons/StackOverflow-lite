import express from 'express';

import Question from '../controllers/questionsController';
import Validator from '../validators/validator';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'StackOverflow-lite' });
});

router.get('/questions', Validator.authorizeUser, Question.getQuestionList);

export default router;

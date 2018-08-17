import express from 'express';

import questions from '../controllers/questionsController';

const router = express.Router();

router.get('/questions', questions.getQuestionList);

router.post('/questions', express.json(), questions.addQuestion);

export default router;

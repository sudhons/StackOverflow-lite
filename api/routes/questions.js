import express from 'express';

import questions from '../controllers/questionsController';

const router = express.Router();

router.get('/questions', questions.getQuestionList);

router.post('/questions', express.json(), questions.addQuestion);

router.get('/questions/:id', questions.getQuestion);

export default router;

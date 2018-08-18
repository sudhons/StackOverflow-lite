import express from 'express';

import questions from '../controllers/questionsController';

const router = express.Router();

router.get('/questions', questions.getQuestionList);

router.post('/questions', express.json(), questions.addQuestion);

router.get('/questions/:id', questions.getQuestion);

router.put('/questions/:id', express.json(), questions.updateQuestion);

router.delete('/questions/:id', express.json(), questions.deleteQuestion);

router.post('/questions/:id/answers', express.json(), questions.addAnswer);

router.get('/questions/:qtnId/answers/:ansId', questions.getAnswer);

export default router;

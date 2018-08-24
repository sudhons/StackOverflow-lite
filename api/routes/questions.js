import express from 'express';

import questions from '../controllers/questionsController';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'StackOverflow-lite' });
});

router.get('/questions', questions.getQuestionList);

router.post('/questions', express.json(), questions.addQuestion);

router.get('/questions/:id', questions.getQuestion);

router.put('/questions/:id', express.json(), questions.updateQuestion);

router.delete('/questions/:id', express.json(), questions.deleteQuestion);

router.post('/questions/:qtnId/answers', express.json(), questions.addAnswer);

router.get('/questions/:qtnId/answers/:ansId', questions.getAnswer);

router.put('/questions/:qtnId/answers/:ansId', express.json(), questions.updateAnswer);

router.delete('/questions/:qtnId/answers/:ansId', questions.deleteAnswer);

export default router;

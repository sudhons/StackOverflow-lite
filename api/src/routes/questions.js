import express from 'express';

import questions from '../controllers/questionsController';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'StackOverflow-lite' });
});

router.get('/questions', questions.getQuestionList);

router.post('/questions', questions.addQuestion);

router.get('/questions/:id', questions.getQuestion);

router.put('/questions/:id', questions.updateQuestion);

router.delete('/questions/:id', questions.deleteQuestion);

router.post('/questions/:qtnId/answers', questions.addAnswer);

router.get('/questions/:qtnId/answers/:ansId', questions.getAnswer);

router.put('/questions/:qtnId/answers/:ansId', questions.updateAnswer);

router.delete('/questions/:qtnId/answers/:ansId', questions.deleteAnswer);

export default router;

import express from 'express';

import getQuestionList from '../controllers/questionsController';

const router = express.Router();

router.get('/questions', getQuestionList);

export default router;

import Question from '../dataStorage/data';

const getQuestionList = (req, res) => {
  const resultData = Question.getQuestions();
  res.status(200);
  return res.json(resultData);
};

const addQuestion = (req, res) => {
  const title = req.body.title && req.body.title.trim();
  const questionBody = req.body.question && req.body.question.trim();

  if (!title) {
    res.status(422);
    return res.json({ message: 'Unsuccessful. Title field is Empty' });
  }

  if (!questionBody) {
    res.status(422);
    return res.json({ message: 'Unsuccessful. Question field is Empty' });
  }

  const question = Question.addQuestion(title, questionBody);

  res.status(201);
  return res.json({ message: 'Question successfully posted', question });
};

const getQuestion = (req, res) => {
  const questionId = req.params.id;
  const resultData = Question.getQuestion(questionId);

  if (!resultData) {
    res.status(404);
    return res.json({ message: `Unsuccessful. Question with id ${questionId} is not found` });
  }

  return res.json(resultData);
};

const updateQuestion = (req, res) => {
  const questionId = req.params.id;
  const title = req.body.title && req.body.title.trim();
  const questionBody = req.body.question && req.body.question.trim();

  if (!title) {
    res.status(422);
    return res.json({ message: 'Unsuccessful. Title field is Empty' });
  }

  if (!questionBody) {
    res.status(422);
    return res.json({ message: 'Unsuccessful. Question field is Empty' });
  }

  let question = Question.getQuestion(questionId);

  if (!question) {
    res.status(404);
    return res.json({ message: `Unsuccessful. Question with id ${questionId} is not found` });
  }

  question = Question.updateQuestion(questionId, title, questionBody);

  return res.json({ message: 'Question successfully updated', question });
};

const deleteQuestion = (req, res) => {
  const questionId = req.params.id;

  let question = Question.getQuestion(questionId);

  if (!question) {
    res.status(404);
    return res.json({ message: `Unsuccessful. Question with id ${req.params.id} is not found` });
  }

  question = Question.deleteQuestion(questionId);

  return res.json({ message: 'Question successfully deleted', question });
};

const addAnswer = (req, res) => {
  const questionId = req.params.qtnId;
  const answer = req.body.answer && req.body.answer.trim();

  if (!answer) {
    res.status(422);
    return res.json({ message: 'Unsuccessful. Answer field is Empty' });
  }

  let question = Question.getQuestion(questionId);

  if (!question) {
    res.status(404);
    return res.json({ message: `Unsuccessful. Question with id ${questionId} is not found` });
  }

  question = Question.addAnswer(questionId, answer);

  res.status(201);
  return res.json({ message: 'Answer successfully posted', question });
};

const getAnswer = (req, res) => {
  const questionId = req.params.qtnId;
  const answerId = req.params.ansId;

  const question = Question.getQuestion(questionId);

  if (!question) {
    res.status(404);
    return res.json({ message: `Unsuccessful. Question with id ${req.params.qtnId} is not found` });
  }

  const answer = Question.getAnswer(questionId, answerId);
  if (!answer) {
    res.status(404);
    return res.json({ message: `Unsuccessful. Answer with id ${req.params.ansId} is not found` });
  }

  return res.json(answer);
};

const updateAnswer = (req, res) => {
  const questionId = req.params.qtnId;
  const answerId = req.params.ansId;
  const newAnswer = req.body.answer && req.body.answer.trim();

  if (!newAnswer) {
    res.status(422);
    return res.json({ message: 'Unsuccessful. Answer field is Empty' });
  }

  let question = Question.getQuestion(questionId);

  if (!question) {
    res.status(404);
    return res.json({ message: `Unsuccessful. Question with id ${req.params.qtnId} is not found` });
  }

  const answer = Question.getAnswer(questionId, answerId);

  if (!answer) {
    res.status(404);
    return res.json({ message: `Unsuccessful. Answer with id ${answerId} is not found` });
  }

  question = Question.updateAnswer(questionId, answerId, newAnswer);

  res.status(200);
  return res.json({ message: 'Answer successfully updated', question });
};

const deleteAnswer = (req, res) => {
  const questionId = req.params.qtnId;
  const answerId = req.params.ansId;

  let question = Question.getQuestion(questionId);

  if (!question) {
    res.status(404);
    return res.json({ message: `Unsuccessful. Question with id ${questionId} is not found` });
  }

  const answer = Question.getAnswer(questionId, answerId);

  if (!answer) {
    res.status(404);
    return res.json({ message: `Unsuccessful. Answer with id ${answerId} is not found` });
  }

  question = Question.deleteAnswer(questionId, answerId);
  return res.json({ message: 'Answer successfully deleted', question });
};

const questions = {
  getQuestionList,
  addQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  getAnswer,
  updateAnswer,
  deleteAnswer,
};

export default questions;

import Question from '../dataStorage/data';

const getQuestionList = (req, res) => {
  const resultData = Question.getQuestions();

  const output = { status: 200, message: 'Successful', data: resultData };

  res.status(200);
  return res.json(output);
};

const addQuestion = (req, res) => {
  const title = req.body.title && req.body.title.trim();
  const questionBody = req.body.question && req.body.question.trim();

  let output;

  if (!title || !questionBody) {
    output = { status: 422, message: 'Unsuccessful. Please ensure all required inputs are supplied and correct' };

    res.status(422);
    return res.json(output);
  }

  const resultData = Question.addQuestion(title, questionBody);

  output = { status: 201, message: 'Successful', data: resultData };

  res.status(201);
  return res.json(output);
};

const getQuestion = (req, res) => {
  const questionId = req.params.id;

  let output;

  const resultData = Question.getQuestion(questionId);

  if (!resultData) {
    output = { status: 404, message: 'Unsuccessful. Invalid URL' };

    res.status(404);
    return res.json(output);
  }

  output = { status: 200, message: 'Successful', data: resultData };

  res.status(200);
  return res.json(output);
};

const updateQuestion = (req, res) => {
  const questionId = req.params.id;
  const title = req.body.title && req.body.title.trim();
  const questionBody = req.body.question && req.body.question.trim();

  let output;

  if (!title || !questionBody) {
    output = { status: 422, message: 'Unsuccessful. Please ensure all required inputs are supplied and correct' };

    res.status(422);
    return res.json(output);
  }

  const resultData = Question.updateQuestion(questionId, title, questionBody);

  if (!resultData) {
    output = { status: 404, message: 'Unsuccessful. Invalid URL' };

    res.status(404);
    return res.json(output);
  }


  output = { status: 200, message: 'Successful. Question successfully updated', data: resultData };

  res.status(200);
  return res.json(output);
};

const deleteQuestion = (req, res) => {
  const questionId = req.params.id;

  let output;

  const resultData = Question.deleteQuestion(questionId);

  if (!resultData) {
    output = { status: 404, message: 'Unsuccessful. Invalid URL' };

    res.status(404);
    return res.json(output);
  }

  output = { status: 200, message: 'Successful. Question successfully deleted', data: resultData };

  res.status(200);
  return res.json(output);
};

const addAnswer = (req, res) => {
  const questionId = req.params.qtnId;
  const answer = req.body.answer && req.body.answer.trim();

  let output;

  if (!answer) {
    output = { status: 422, message: 'Unsuccessful. Please ensure all required inputs are supplied and correct' };

    res.status(422);
    return res.json(output);
  }

  const resultData = Question.addAnswer(questionId, answer);

  if (!resultData) {
    output = { status: 404, message: 'Unsuccessful. Invalid URL' };

    res.status(404);
    return res.json(output);
  }

  output = { status: 201, message: 'Successful. Answer successfully posted', data: resultData };

  res.status(201);
  return res.json(output);
};

const getAnswer = (req, res) => {
  const questionId = req.params.qtnId;
  const answerId = req.params.ansId;

  let output;

  const resultData = Question.getAnswer(questionId, answerId);

  if (!resultData) {
    output = { status: 404, message: 'Unsuccessful. Invalid URL' };

    res.status(404);
    return res.json(output);
  }

  output = { status: 200, message: 'Successful', data: resultData };

  res.status(200);
  return res.json(output);
};

const updateAnswer = (req, res) => {
  const questionId = req.params.qtnId;
  const answerId = req.params.ansId;
  const newAnswer = req.body.answer && req.body.answer.trim();

  let output;

  if (!newAnswer) {
    output = { status: 422, message: 'Unsuccessful. Please ensure all required inputs are supplied and correct' };

    res.status(422);
    return res.json(output);
  }

  const resultData = Question.updateAnswer(questionId, answerId, newAnswer);

  if (!resultData) {
    output = { status: 404, message: 'Invalid URL' };

    res.status(404);
    return res.json(output);
  }

  output = { status: 200, message: 'Successful. Answer successfully updated', data: resultData };

  res.status(200);
  return res.json(output);
};

const deleteAnswer = (req, res) => {
  const questionId = req.params.qtnId;
  const answerId = req.params.ansId;

  let output;

  const resultData = Question.deleteAnswer(questionId, answerId);

  if (!resultData) {
    output = { status: 404, message: 'Unsuccessful. Invalid URL' };
    res.status(404);
    return res.json(output);
  }

  output = { status: 200, message: 'Answer successfully deleted', data: resultData };

  res.status(200);
  return res.json(output);
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

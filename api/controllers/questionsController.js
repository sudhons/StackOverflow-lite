import data from '../dataStorage/data';

const getQuestionList = (req, res) => {
  const resultData = data.getQuestions();
  return res.status(200).json(resultData);
};

const addQuestion = (req, res) => {
  const question = data.addQuestion(req.body.question.trim());
  if (!question) return res.status(422).json({ message: 'Unsuccessful. Empty input field' });
  return res.status(201).json({ message: 'Question successfully posted', question });
};

const getQuestion = (req, res) => {
  const resultData = data.getQuestion(req.params.id);
  if (!resultData) return res.status(404).json({ message: `Unsuccessful. Question with id ${req.params.id} is not found` });
  return res.json(resultData);
};

const updateQuestion = (req, res) => {
  let question = data.getQuestion(req.params.id);
  if (!question) return res.status(404).json({ message: `Unsuccessful. Question with id ${req.params.id} is not found` });
  question = data.updateQuestion(req.params.id, req.body.question.trim());
  if (!question) return res.status(422).json({ message: 'Unsuccessful. Empty input field' });
  return res.json({ message: 'Question successfully updated', question });
};

const deleteQuestion = (req, res) => {
  let question = data.getQuestion(req.params.id);
  if (!question) return res.status(404).json({ message: `Unsuccessful. Question with id ${req.params.id} is not found` });
  question = data.deleteQuestion(req.params.id);
  return res.json({ message: 'Question successfully deleted', question });
};

const addAnswer = (req, res) => {
  let question = data.getQuestion(req.params.id);
  if (!question) return res.status(404).json({ message: `Unsuccessful. Question with id ${req.params.id} is not found` });
  question = data.addAnswer(req.params.id, req.body.answer.trim());
  if (!question) return res.status(422).json({ message: 'Unsuccessful. Empty input field' });
  return res.status(201).json({ message: 'Answer successfully posted', question });
};

const questions = {
  getQuestionList,
  addQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswer,
};

export default questions;

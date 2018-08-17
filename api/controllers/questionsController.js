import data from '../dataStorage/data';

const getQuestionList = (req, res) => {
  const resultData = data.getQuestions();
  return res.status(200).json(resultData);
};

const addQuestion = (req, res) => {
  const question = data.addQuestion(req.body.question.trim());
  if (!question) return res.status(422).json({ message: 'Unsuccessful. Empty input field' });
  return res.json({ message: 'Question successfully posted', question });
};

const getQuestion = (req, res) => {
  const resultData = data.getQuestion(req.params.id);
  if (!resultData) return res.status(404).json({ message: `Unsuccessful. Question with id ${req.params.id} is not found` });
  return res.json(resultData);
};

const questions = { getQuestionList, addQuestion, getQuestion };

export default questions;

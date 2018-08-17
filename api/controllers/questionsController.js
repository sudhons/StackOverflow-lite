import data from '../dataStorage/data';

const getQuestionList = (req, res) => {
  const resultData = data.getQuestions();
  return res.status(200).json(resultData);
};

export default getQuestionList;

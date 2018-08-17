import uuid from 'uuid';

let questionsData = [
  {
    id: uuid(),
    question: 'what is Computer science',
    answers: [
      { id: uuid(), answer: 'It is about algorithms' },
      { id: uuid(), answer: 'It is programming' },
      { id: uuid(), answer: 'It is about computers' },
      { id: uuid(), answer: 'It is about softwares' },
    ],
  },
  {
    id: uuid(),
    question: 'what is python',
    answers: [
      { id: uuid(), answer: 'It is a snake' },
      { id: uuid(), answer: 'It is an animal' },
      { id: uuid(), answer: 'It is a programming laguage' },
      { id: uuid(), answer: 'It is a dangerous animal' },
    ],
  },
  {
    id: uuid(),
    question: 'what is do you know about algorithm',
    answers: [
      { id: uuid(), answer: 'No idea' },
      { id: uuid(), answer: 'Problem solving' },
      { id: uuid(), answer: 'A guide to computer' },
      { id: uuid(), answer: 'A software' },
    ],
  },
];

const data = {
  getQuestions() {
    return questionsData;
  },

  addQuestion(qtn) {
    const question = qtn.trim();
    if (!question) return null;
    const newQuestion = { question, id: uuid(), answers: [] };
    questionsData.push(newQuestion);
    return newQuestion;
  },

  getQuestion(questionId) {
    const question = questionsData.find(qtn => qtn.id === questionId);
    if (!question) return null;
    return question;
  },

  updateQuestion(questionId, qtn) {
    const editedQuestion = qtn.trim();
    if (!editedQuestion) return null;
    const question = this.getQuestion(questionId);
    if (!question) return null;
    question.question = editedQuestion;
    return question;
  },

  addAnswer(questionId, ans) {
    const answer = ans.trim();
    if (!answer) return null;
    const question = this.getQuestion(questionId);
    if (!question) return null;
    const newAnswer = { answer, id: uuid() + 1 };
    question.answers.push(newAnswer);
    return question;
  },

  getAnswer(questionId, answerId) {
    const targetQuestion = this.getQuestion(questionId);
    if (!targetQuestion) return null;
    const targetAnswer = targetQuestion.answers.find(answer => answer.id === answerId);
    if (!targetAnswer) return null;
    return targetAnswer;
  },

  updateAnswer(questionId, answerId, ans) {
    const editedAnswer = ans.trim();
    if (!editedAnswer) return null;
    const targetAnswer = this.getAnswer(questionId, answerId);
    if (!targetAnswer) return null;
    targetAnswer.answer = editedAnswer;
    return this.getQuestion(questionId);
  },

  deleteQuestion(questionId) {
    const question = this.getQuestion(questionId);
    if (!question) return null;
    const questionIndex = questionsData.indexOf(question);
    questionsData.splice(questionIndex, 1);
    return question;
  },

  deleteAnswer(questionId, answerId) {
    const answer = this.getAnswer(questionId, answerId);
    if (!answer) return null;
    const question = this.getQuestion(questionId);
    const answerIndex = question.answers.indexOf(answer);
    question.answers.splice(answerIndex, 1);
    return question;
  },

  deleteAllQuestions() {
    questionsData = [];
    return questionsData;
  },
};

export default data;

import uuid from 'uuid';

let questionsData = [
  {
    id: uuid(),
    title: 'Computer',
    question: 'what is Computer science',
    date: Date.now(),
    answers: [
      {
        id: uuid(),
        answer: 'It is about algorithms',
        date: Date.now(),
        upVote: 0,
        downVote: 0,
      },
      {
        id: uuid(),
        answer: 'It is programming',
        date: Date.now(),
        upVote: 0,
        downVote: 0,
      },
      {
        id: uuid(),
        answer: 'It is about computers',
        date: Date.now(),
        upVote: 0,
        downVote: 0,
      },
      {
        id: uuid(),
        answer: 'It is about softwares',
        date: Date.now(),
        upVote: 0,
        downVote: 0,
      },
    ],
  },
  {
    id: uuid(),
    title: 'Python',
    question: 'what is python',
    date: Date.now(),
    answers: [
      {
        id: uuid(),
        answer: 'It is a snake',
        date: Date.now(),
        upVote: 0,
        downVote: 0,
      },
      {
        id: uuid(),
        answer: 'It is an animal',
        date: Date.now(),
        upVote: 0,
        downVote: 0,
      },
      {
        id: uuid(),
        answer: 'It is a programming laguage',
        date: Date.now(),
        upVote: 0,
        downVote: 0,
      },
      {
        id: uuid(),
        answer: 'It is a dangerous animal',
        date: Date.now(),
        upVote: 0,
        downVote: 0,
      },
    ],
  },
  {
    id: uuid(),
    title: 'Algorithm',
    question: 'what is do you know about algorithm',
    date: Date.now(),
    answers: [
      {
        id: uuid(), answer: 'No idea', date: Date.now(),
      },
      { id: uuid(), answer: 'Problem solving', date: Date.now() },
      { id: uuid(), answer: 'A guide to computer', date: Date.now() },
      { id: uuid(), answer: 'A software', date: Date.now() },
    ],
  },
];

class Question {
  constructor(title, questionBody) {
    this.id = uuid();
    this.title = title;
    this.question = questionBody;
    this.date = Date.now();
    this.answers = [];
  }

  static getQuestions() {
    return questionsData;
  }

  static getQuestion(questionId) {
    const question = questionsData.find(qtn => qtn.id === questionId);
    if (!question) return null;
    return question;
  }

  static addQuestion(questionTitle, questionBody) {
    const newQuestion = new Question(questionTitle, questionBody);
    questionsData.push(newQuestion);
    return newQuestion;
  }

  static updateQuestion(questionId, questionTitle, questionBody) {
    const question = Question.getQuestion(questionId);
    if (!question) return null;
    question.title = questionTitle;
    question.question = questionBody;
    return question;
  }

  static deleteQuestion(questionId) {
    const question = Question.getQuestion(questionId);
    if (!question) return null;
    const questionIndex = questionsData.indexOf(questionId);
    questionsData.splice(questionIndex, 1);
    return question;
  }

  static deleteAllQuestions() {
    questionsData = [];
    return questionsData;
  }

  static getAnswer(questionId, answerId) {
    const targetQuestion = Question.getQuestion(questionId);
    if (!targetQuestion) return null;
    const targetAnswer = targetQuestion.answers.find(answer => answer.id === answerId);
    if (!targetAnswer) return null;
    return targetAnswer;
  }

  static addAnswer(questionId, answer) {
    const question = Question.getQuestion(questionId);
    if (!question) return null;
    const newAnswer = {
      answer,
      id: uuid(),
      date: Date.now(),
      upVotes: 0,
      downVotes: 0,
    };

    question.answers.push(newAnswer);
    return question;
  }

  static updateAnswer(questionId, answerId, newAnswer) {
    const targetAnswer = Question.getAnswer(questionId, answerId);
    if (!targetAnswer) return null;
    targetAnswer.answer = newAnswer;
    return Question.getQuestion(questionId);
  }

  static deleteAnswer(questionId, answerId) {
    const answer = Question.getAnswer(questionId, answerId);
    if (!answer) return null;
    const question = Question.getQuestion(questionId);
    const answerIndex = question.answers.indexOf(answer);
    question.answers.splice(answerIndex, 1);
    return question;
  }
}

export default Question;

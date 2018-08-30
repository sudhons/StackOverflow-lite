import { Client } from 'pg';
import jwt from 'jsonwebtoken';

const connectString = 'postgres://postgres:0099@localhost:5432/StackOverflow';
const client = new Client(connectString);

client.connect();

class Question {
  static getQuestionList(request, response) {
    return jwt.verify(request.token, 'secret', (error) => {
      if (error) {
        const output = { status: 403, message: 'Not authorized' };
        return response.status(403).json(output);
      }

      return client.query('SELECT * FROM question')
        .then((data) => {
          const output = { status: 200, message: 'Successful', data: data.rows };

          response.status(200);
          return response.json(output);
        });
    });
  }

  static addQuestion(request, response) {
    const { title, question } = request.body;

    let output;

    return jwt.verify(request.token, 'secret', (err, userData) => {
      if (err) {
        output = { status: 403, message: 'Not authorized' };
        return response.status(403).json(output);
      }

      return client.query(`INSERT INTO question (title, question, user_id)
      VALUES ('${title}', '${question}', ${userData.user.user_id})`)
        .then(() => {
          output = { status: 201, message: 'Successful. Question successfully added' };
          return response.status(201).json(output);
        });
    });
  }

  static getQuestion(request, response) {
    const questionId = request.params.id;

    let output;

    return jwt.verify(request.token, 'secret', (err) => {
      if (err) {
        output = { status: 403, message: 'Not authorized' };
        return response.status(403).json(output);
      }

      return client.query(`SELECT * FROM question WHERE question_id=${questionId}`)
        .then((questionData) => {
          if (questionData.rows.length > 0) {
            const result = questionData.rows[0];
            return client.query(`SELECT * FROM answer WHERE question_id=${questionId}`)
              .then((answerData) => {
                result.answers = answerData.rows;
                output = { status: 200, message: 'Successful', data: result };

                response.status(200);
                return response.json(output);
              });
          }

          output = { status: 404, message: 'Unsuccessful. Invalid route' };
          return response.status(404).json(output);
        });
    });
  }
}

export default Question;

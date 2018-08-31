import { Client } from 'pg';
import jwt from 'jsonwebtoken';

const connectString = 'postgres://eopqezcwnocylf:49ffe41ef3606a1060ea80f39eae4291981c6e3c886b1b122517f1bc4dfb7faf@ec2-50-16-196-57.compute-1.amazonaws.com:5432/dcve49n4q71mpj?ssl=true';
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

  static updateQuestion(request, response) {
    const questionId = request.params.id;
    const { title, question } = request.body;

    let output;

    return jwt.verify(request.token, 'secret', (err, userData) => {
      if (err) {
        output = { status: 403, message: 'Not authorized' };
        response.status(403);
        return response.json(output);
      }

      return client.query(`SELECT * FROM question WHERE question_id=${questionId}`)
        .then((data) => {
          if (data.rows.length > 0) {
            const questionData = data.rows[0];
            if (questionData.user_id === userData.user.user_id) {
              return client.query(`UPDATE question SET title='${title}', question='${question}' WHERE question_id=${questionId}`)
                .then(() => {
                  output = { status: 200, message: 'Successful. Question successfully updated' };
                  return response.status(200).json(output);
                });
            }

            output = { status: 403, message: 'Not authorized' };
            return response.status(403).json(output);
          }

          output = { status: 404, message: 'Unsuccessful. Invalid route' };
          return response.status(404).json(output);
        });
    });
  }

  static deleteQuestion(request, response) {
    const questionId = request.params.id;

    let output;

    return jwt.verify(request.token, 'secret', (err, userData) => {
      if (err) {
        output = { status: 403, message: 'Not authorized' };
        response.status(403);
        return response.json(output);
      }

      return client.query(`SELECT * FROM question WHERE question_id=${questionId}`)
        .then((data) => {
          if (data.rows.length > 0) {
            const questionData = data.rows[0];
            if (questionData.user_id === userData.user.user_id) {
              return client.query(`SELECT * FROM answer WHERE question_id=${questionId}`)
                .then((answersData) => {
                  if (answersData.rows.length === 0) {
                    return client.query(`DELETE FROM question WHERE question_id=${questionId}`)
                      .then(() => {
                        response.status(200);
                        output = { status: 200, message: 'Successful. Question successfully deleted' };
                        return response.json(output);
                      });
                  }

                  output = { status: 403, message: 'Unsuccessful. Unavailable for deletion, question has answer(s)' };
                  return response.status(403).json(output);
                });
            }

            output = { status: 403, message: 'Not authorized' };
            return response.status(403).json(output);
          }

          output = { status: 404, message: 'Unsuccessful. Invalid route' };
          return response.status(404).json(output);
        });
    });
  }
}

export default Question;

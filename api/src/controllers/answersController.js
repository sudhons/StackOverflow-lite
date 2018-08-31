import { Client } from 'pg';
import jwt from 'jsonwebtoken';

const connectString = 'postgres://eopqezcwnocylf:49ffe41ef3606a1060ea80f39eae4291981c6e3c886b1b122517f1bc4dfb7faf@ec2-50-16-196-57.compute-1.amazonaws.com:5432/dcve49n4q71mpj?ssl=true';
const client = new Client(connectString);

client.connect();

class Answer {
  static addAnswer(request, response) {
    const questionId = request.params.qtnId;

    const { answer } = request.body;

    let output;

    return jwt.verify(request.token, 'secret', (error, userData) => {
      if (error) {
        output = { status: 403, message: 'Not authorized' };
        return response.status(403).json(output);
      }

      return client.query(`SELECT * FROM question WHERE question_id=${questionId}`)
        .then((data) => {
          if (data.rows.length > 0) {
            return client.query(`INSERT INTO answer (answer, question_id, user_id) VALUES ('${answer}', ${questionId}, ${userData.user.user_id})`)
              .then(() => {
                response.status(201);
                output = { status: 201, message: 'Successful. Answer successfully added' };
                return response.json(output);
              });
          }

          output = { status: 404, message: 'Unsuccessful. Invalid route' };
          return response.status(404).json(output);
        });
    });
  }

  static getAnswer(request, response) {
    const questionId = request.params.qtnId;
    const answerId = request.params.ansId;

    let output;

    return jwt.verify(request.token, 'secret', (error) => {
      if (error) {
        output = { status: 403, message: 'Not authorized' };
        response.status(403);
        return response.json(output);
      }

      return client.query(`SELECT * FROM answer WHERE question_id=${questionId} AND answer_id=${answerId}`)
        .then((data) => {
          if (data.rows.length > 0) {
            output = { status: 200, message: 'Successful', data: data.rows[0] };
            return response.status(200).json(output);
          }

          output = { status: 404, message: 'Unsuccessful. Invalid route' };
          return response.status(404).json(output);
        });
    });
  }

  static updateAnswer(request, response) {
    const questionId = request.params.qtnId;
    const answerId = request.params.ansId;

    const { answer, isPreferred } = request.body;

    let output;

    return jwt.verify(request.token, 'secret', (error, userData) => {
      if (error) {
        output = { status: 403, message: 'Not authorized' };
        response.status(403);
        return response.json(output);
      }

      return client.query(`SELECT * FROM answer WHERE question_id=${questionId} AND answer_id=${answerId}`)
        .then((data) => {
          if (data.rows.length > 0) {
            return client.query(`SELECT * FROM question WHERE question_id=${questionId}`)
              .then((questionData) => {
                const questionOnwerId = questionData.rows[0].user_id;
                const currentUserId = userData.user.user_id;
                const answerOnwerId = data.rows[0].user_id;

                if (answerOnwerId === currentUserId && currentUserId === questionOnwerId) {
                  if (answer) {
                    return client.query(`UPDATE answer SET answer='${answer}' WHERE question_id=${questionId} AND answer_id=${answerId}`)
                      .then(() => {
                        output = { status: 201, message: 'Successful. Answer successfully updated' };
                        return response.status(201).json(output);
                      });
                  }

                  return client.query(`UPDATE answer SET is_preferred=${JSON.parse(isPreferred)} WHERE question_id=${questionId} AND answer_id=${answerId}`)
                    .then(() => {
                      output = { status: 201, message: 'Successful. Answer successfully updated' };
                      return response.status(201).json(output);
                    });
                }

                if (answerOnwerId === currentUserId && currentUserId !== questionOnwerId) {
                  if (answer) {
                    return client.query(`UPDATE answer SET answer='${answer}' WHERE question_id=${questionId} AND answer_id=${answerId}`)
                      .then(() => {
                        output = { status: 201, message: 'Successful. Answer successfully updated' };
                        return response.status(201).json(output);
                      });
                  }

                  output = { status: 422, message: 'Unsuccessful. Please ensure all required inputs are supplied and correct' };
                  return response.status(422).json(output);
                }

                if (questionOnwerId === currentUserId && answerOnwerId === currentUserId) {
                  if (isPreferred === 'true' || isPreferred === 'false') {
                    return client.query(`UPDATE answer SET is_preferred='${JSON.parse(isPreferred)}' WHERE question_id=${questionId} AND answer_id=${answerId}`)
                      .then(() => {
                        output = { status: 201, message: 'Successful. Answer successfully updated' };
                        return response.status(201).json(output);
                      });
                  }

                  output = { status: 422, message: 'Unsuccessful. Please ensure all required inputs are supplied and correct' };
                  return response.status(422).json(output);
                }

                output = { status: 403, message: 'Not authorized' };
                return response.status(403).json(output);
              });
          }
          output = { status: 404, message: 'Unsuccessful. Invalid route' };
          return response.status(404).json(output);
        });
    });
  }

  static deleteAnswer(request, response) {
    const questionId = request.params.qtnId;
    const answerId = request.params.ansId;

    let output;

    return jwt.verify(request.token, 'secret', (err, userData) => {
      if (err) {
        output = { status: 403, message: 'Not authorized' };
        response.status(403);
        return response.json(output);
      }

      return client.query(`SELECT * FROM answer WHERE question_id=${questionId} AND answer_id=${answerId}`)
        .then((data) => {
          if (data.rows.length > 0) {
            if (data.rows[0].user_id === userData.user.user_id) {
              return client.query(`DELETE FROM answer WHERE question_id=${questionId} AND answer_id=${answerId}`)
                .then(() => {
                  output = { status: 200, message: 'Successful. Answer successfully deleted' };
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
}

export default Answer;

import { Client } from 'pg';
import jwt from 'jsonwebtoken';

const connectString = 'postgres://postgres:0099@localhost:5432/StackOverflow';
const client = new Client(connectString);

client.connect();

class Answer {
  static addAnswer(request, response) {
    const questionId = request.params.qtnId;

    const { answer } = request.body;

    let output;

    return jwt.verify(request.token, 'secret', (err, userData) => {
      if (err) {
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
}

export default Answer;

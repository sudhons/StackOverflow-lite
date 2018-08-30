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
}

export default Question;

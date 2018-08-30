import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const connectString = 'postgres://postgres:0099@localhost:5432/StackOverflow';
const client = new Client(connectString);

client.connect();

class User {
  static signup(request, response) {
    const { username, email, password } = request.body;
    let output;

    client.query(`SELECT * FROM public.user WHERE username='${username}'`)
      .then((dataUsername) => {
        if (dataUsername.rows.length === 0) {
          return client.query(`SELECT * FROM public.user WHERE email='${email}'`)
            .then((dataEmail) => {
              if (dataEmail.rows.length === 0) {
                return bcrypt.hash(password, 10)
                  .then((hash) => {
                    client.query(`INSERT INTO public.user (username, password, email) VALUES ('${username}', '${hash}', '${email}')`)
                      .then(() => {
                        output = { status: 200, message: 'Successful. You are successfully registered' };
                        response.status(200);
                        return response.json(output);
                      });
                  });
              }
              output = { status: 401, message: 'Email already in use' };
              return response.status(401).json(output);
            });
        }
        output = { status: 401, message: 'Username already in use' };
        return response.status(401).json(output);
      });
  }

  static login(request, response) {
    const { username, password } = request.body;
    let output;


    client.query(`SELECT * FROM public.user WHERE username='${username}'`)
      .then((data) => {
        const user = data.rows[0];
        if (user) {
          return bcrypt.compare(password, user.password)
            .then((isMatch) => {
              if (isMatch) {
                return jwt.sign({ user }, 'secret', (error, token) => {
                  if (error) {
                    return console.log(error);
                  }

                  output = { token, status: 200, message: 'Successful. You are successfully are logged in' };
                  return response.status(200).json(output);
                });
              }

              output = { status: 401, message: 'Invalid credentials' };
              return response.status(401).json(output);
            });
        }

        output = { status: 401, message: 'Invalid credentials' };
        return response.status(401).json(output);
      });
  }
}

export default User;

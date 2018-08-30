import { Client } from 'pg';
import bcrypt from 'bcryptjs';

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
}

export default User;

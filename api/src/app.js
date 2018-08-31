import express from 'express';
import bodyParser from 'body-parser';

import users from './routes/users';
import questionsAnswers from './routes/questionsAnswers';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.redirect('/api/v1');
});

app.use('/api/v1', questionsAnswers);

app.use('/api/v1/auth', users);

app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Not Found' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, (err) => {
  if (err) return console.log('An error occured');
  return console.log(`Listening on port ${PORT}`);
});

export default app;

import express from 'express';
import bodyParser from 'body-parser';

import questions from './routes/questions';

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.redirect('/api/v1');
});

app.use('/api/v1', questions);

// catch 404
app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Unknonw url route' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, (err) => {
  if (err) return console.log('An error occured');
  return console.log(`Listening on port ${PORT}`);
});

export default app;

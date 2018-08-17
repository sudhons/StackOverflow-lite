import express from 'express';

import questions from './routes/questions';

const app = express();

app.use('/api/v1', questions);

// catch 404
app.use((req, res) => {
  res.status(404).json({ message: 'Page Not Found' });
});

export default app;

import express from 'express';

const app = express();

// catch 404
app.use((req, res) => {
  res.status(404).json({ message: 'Page Not Found' });
});

export default app;

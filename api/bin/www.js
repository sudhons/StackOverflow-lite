import app from '../app';

const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, (err) => {
  if (err) return console.log('An error occured');
  return console.log(`Listening on port ${PORT}`);
});

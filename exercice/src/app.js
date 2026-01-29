import express from 'express';
import routes from './routes';

const app = express();

app.use(routes);

app.get('/categories', async (req, res) => {
  const data = await db.query('SELECT * categories');
  res.send(data);
});

export default app;

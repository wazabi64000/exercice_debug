import express from 'express';

const router = express.Router();

router.get('/products', (req, res) => {
  db.query('SELECT * FROM product', (err, result) => {
    res.send(result);
  });
});

router.post('/product', (req, res) => {
  const name = req.body.title;
  db.query("INSERT INTO products VALUES ('" + name + "')");
});

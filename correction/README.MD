express-esm-mysql-correct/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── category.routes.js
│   │   └── product.routes.js
│   ├── controllers/
│   │   ├── category.controller.js
│   │   └── product.controller.js
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── schema.sql


```json 
{
  "name": "express-esm-mysql-correct",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "mysql2": "^3.9.4",
    "dotenv": "^16.4.5"
  }
}
```

```.env

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=eshop
PORT=3000
```

```sql
CREATE DATABASE IF NOT EXISTS eshop;
USE eshop;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

```js
// src/config/db.js

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// src/controllers/category.controller.js

import { db } from '../config/db.js';

export const getCategories = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categories');
  res.json(rows);
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
  res.status(201).json({ message: 'Category created' });
};

// src/controllers/product.controller.js

import { db } from '../config/db.js';

export const getProducts = async (req, res) => {
  const [rows] = await db.query(`
    SELECT p.*, c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `);
  res.json(rows);
};

export const createProduct = async (req, res) => {
  const { name, price, category_id } = req.body;
  await db.query(
    'INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)',
    [name, price, category_id]
  );
  res.status(201).json({ message: 'Product created' });
};

// src/routes/category.routes.js

import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/category.controller.js';

const router = Router();

router.get('/', getCategories);
router.post('/', createCategory);

export default router;


// src/routes/product.routes.js
import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/product.controller.js';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);

export default router;


//src/app.js 

import express from 'express';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();

app.use(express.json());

app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);

export default app;


// src/server.js

import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```
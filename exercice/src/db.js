import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  database: 'eshop'
});

connection.connect();

export default connection;

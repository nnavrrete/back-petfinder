const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DBNAME,
    password: process.env.PASSWORD,
    port: process.env.DBPORT, 
  });

  const connectdb = () => {
    pool.connect()
      .then(() => console.log('Conexión exitosa con la base de datos'))
      .catch(err => console.error('Error al conectar con la base de datos:', err));
  };

  module.exports = { pool, connectdb };
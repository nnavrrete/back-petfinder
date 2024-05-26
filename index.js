const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();

require('dotenv').config();

app.use(cors());

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DBNAME,
  password: process.env.PASSWORD,
  port: process.env.DBPORT, // Usa una variable de entorno diferente para el puerto de la base de datos
});

app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const { id_dueño, nombre, correo, telefono, direccion } = req.body;
    if (!id_dueño || !nombre || !correo || !telefono || !direccion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const query = 'INSERT INTO dueño (id_dueño, nombre, correo, telefono, dirección) VALUES ($1, $2, $3, $4, $5)';
    const values = [id_dueño, nombre, correo, telefono, direccion];
    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Registro creado exitosamente', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.listen(3000, () => {
  console.log('Servidor está corriendo en el puerto 3000');
});
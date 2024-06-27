const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

// Ruta para crear una nueva mascota
router.post('/mascota', async (req, res) => {
  try {
    const { nombre, tipo, raza, edad, dueno_id } = req.body;
    console.log('Received data:', req.body); // Log received data

    if (!nombre || !tipo || !raza || !edad || !dueno_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const insertQuery = 'INSERT INTO mascota (nombre, tipo, raza, edad, dueno_id) VALUES ($1, $2, $3, $4, $5)';
    const insertValues = [nombre, tipo, raza, edad, dueno_id];
    const result = await pool.query(insertQuery, insertValues);

    res.status(201).json({ message: 'Registro creado exitosamente', result });
  } catch (error) {
    console.error('Error occurred during query:', error); // Log detailed error
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
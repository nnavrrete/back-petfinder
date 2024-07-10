const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

// Ruta para crear una nueva mascota
router.post('/mascota', async (req, res) => {
  try {
    const { nombre, tipo, raza, edad, castrado, photoUrl, correo } = req.body;
    console.log('Received data:', req.body); // Log received data

    if (!nombre || !tipo || !raza || !edad || !correo) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Consulta para obtener el dueno_id basado en el correo
    const ownerQuery = 'SELECT id FROM dueno WHERE correo = $1';
    const ownerResult = await pool.query(ownerQuery, [correo]);

    if (ownerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Dueño no encontrado' });
    }

    const dueno_id = ownerResult.rows[0].id;

    const insertQuery = 'INSERT INTO mascota (nombre, tipo, raza, edad, castrado, photoUrl, dueno_id) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const insertValues = [nombre, tipo, raza, edad, castrado, photoUrl, dueno_id];
    const result = await pool.query(insertQuery, insertValues);

    res.status(201).json({ message: 'Registro creado exitosamente', result });
  } catch (error) {
    console.error('Error occurred during query:', error); // Log detailed error
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;

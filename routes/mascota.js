const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

// Ruta para crear una nueva mascota
router.post('/mascota', async (req, res) => {
  const { nombre, tipo, raza, edad, dueno_id, photoUrl, FechaNacimiento, castrado, vacunas } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO mascota (nombre, tipo, raza, edad, dueno_id, photoUrl, FechaNacimiento, castrado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_mascota',
      [nombre, tipo, raza, edad, dueno_id, photoUrl, FechaNacimiento, castrado]
    );
    
    const idMascota = result.rows[0].id_mascota;
    
    for (const vacuna of vacunas) {
      await pool.query(
        'INSERT INTO vacuna (nombre, fechaAplicacion, id_mascota) VALUES ($1, $2, $3)',
        [vacuna.type, vacuna.date, idMascota]
      );
    }

    res.status(201).json({ idMascota });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error inserting pet' });
  }
});

module.exports = router;

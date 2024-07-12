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

router.delete('/mascota/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Primero eliminar todas las referencias en la tabla vacuna
    await client.query('DELETE FROM vacuna WHERE id_mascota = $1', [id]);
    
    // Luego eliminar la mascota
    await client.query('DELETE FROM mascota WHERE id_mascota = $1', [id]);
    
    await client.query('COMMIT');
    res.status(200).json({ message: 'Pet deleted' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error deleting pet' });
  } finally {
    client.release();
  }
});

router.put ('/mascota/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, raza, edad, dueno_id, photoUrl, FechaNacimiento, castrado, vacunas } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'UPDATE mascota SET nombre = $1, tipo = $2, raza = $3, edad = $4, dueno_id = $5, photoUrl = $6, FechaNacimiento = $7, castrado = $8 WHERE id_mascota = $9',
      [nombre, tipo, raza, edad, dueno_id, photoUrl, FechaNacimiento, castrado, id]
    );
    
    // Eliminar todas las vacunas de la mascota
    await client.query('DELETE FROM vacuna WHERE id_mascota = $1', [id]);
    
    // Insertar las nuevas vacunas
    for (const vacuna of vacunas) {
      await client.query(
        'INSERT INTO vacuna (nombre, fechaAplicacion, id_mascota) VALUES ($1, $2, $3)',
        [vacuna.type, vacuna.date, id]
      );
    }
    
    await client.query('COMMIT');
    res.status(200).json({ message: 'Pet updated' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error updating pet' });
  } finally {
    client.release();
  }
});

module.exports = router;

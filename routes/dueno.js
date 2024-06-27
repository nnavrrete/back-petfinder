const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

// Ruta para crear un nuevo dueño
router.post('/dueno', async (req, res) => {
  try {
    const { nombre, correo, telefono, direccion } = req.body;
    console.log('Received data:', req.body); // Log received data

    if (!nombre || !correo || !telefono || !direccion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const checkQuery = 'SELECT * FROM dueno WHERE correo = $1';
    const checkResult = await pool.query(checkQuery, [correo]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    const insertQuery = 'INSERT INTO dueno (nombre, correo, telefono, direccion) VALUES ($1, $2, $3, $4)';
    const insertValues = [nombre, correo, telefono, direccion];
    const result = await pool.query(insertQuery, insertValues);

    res.status(201).json({ message: 'Registro creado exitosamente', result });
  } catch (error) {
    console.error('Error occurred during query:', error); // Log detailed error
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para obtener los dueños por su correo
router.get('/dueno', async (req, res) => {
  try {
    const { correo } = req.query;
    const query = 'SELECT * FROM dueno WHERE correo = $1';
    const result = await pool.query(query, [correo]);
    res.status(200).json(result.rows);
    console.log('Received data:', result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para obtener las mascotas de un dueño por su correo
router.get('/dueno/mascotas', async (req, res) => {
    try {
      const { correo } = req.query;
      const query = `
        SELECT d.id AS dueno_id, d.nombre AS dueno_nombre, d.correo, d.telefono, d.direccion,
               m.id_mascota AS mascota_id, m.nombre AS mascota_nombre, m.tipo, m.raza, m.edad
        FROM dueno d
        LEFT JOIN mascota m ON m.dueno_id = d.id
        WHERE d.correo = $1
      `;
      const result = await pool.query(query, [correo]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron datos para el correo proporcionado' });
      }
  
      // Formatear la respuesta
      const dueno = {
        id: result.rows[0].dueno_id,
        nombre: result.rows[0].dueno_nombre,
        correo: result.rows[0].correo,
        telefono: result.rows[0].telefono,
        direccion: result.rows[0].direccion,
        mascotas: result.rows.map(row => ({
          id: row.mascota_id,
          nombre: row.mascota_nombre,
          tipo: row.tipo,
          raza: row.raza,
          edad: row.edad
        })).filter(mascota => mascota.id !== null) // Filtrar las mascotas nulas (en caso de que el dueño no tenga mascotas)
      };
  
      res.status(200).json(dueno);
    } catch (error) {
      console.error('Error occurred during query:', error); // Log detailed error
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });

// Ruta para actualizar un dueño por su id
router.put('/dueno/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, telefono, direccion } = req.body;
    console.log('Received data:', req.body); // Log received data

    if (!nombre || !correo || !telefono || !direccion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const query = 'UPDATE dueno SET nombre = $1, correo = $2, telefono = $3, direccion = $4 WHERE id = $5';
    const values = [nombre, correo, telefono, direccion, id];
    const result = await pool.query(query, values);

    res.status(200).json({ message: 'Registro actualizado exitosamente', result });
  } catch (error) {
    console.error('Error occurred during query:', error); // Log detailed error
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

// Ruta para crear un nuevo dueño
router.post('/dueno', async (req, res) => {
  try {
    const { nombre, correo, telefono, direccion, photoUrl } = req.body;
    console.log('Received data:', req.body); // Log received data


    const checkQuery = 'SELECT * FROM dueno WHERE correo = $1';
    const checkResult = await pool.query(checkQuery, [correo]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    const insertQuery = 'INSERT INTO dueno (nombre, correo, telefono, direccion, photourl) VALUES ($1, $2, $3, $4, $5)';
    const insertValues = [nombre, correo, telefono, direccion, photoUrl ];
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
      SELECT 
        d.id, d.nombre AS dueno_nombre, d.correo, d.telefono, d.direccion, d.photourl,
        m.id_mascota AS mascota_id, m.nombre AS mascota_nombre, m.tipo, m.raza, m.edad, m.dueno_id, m.photourl, m.fechanacimiento, m.castrado,
        v.id_vacuna, v.nombre AS nombre_vacuna, v.fechaaplicacion
      FROM dueno d
      LEFT JOIN mascota m ON m.dueno_id = d.id
      LEFT JOIN vacuna v ON v.id_mascota = m.id_mascota
      WHERE d.correo = $1
    `;
    const result = await pool.query(query, [correo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron datos para el correo proporcionado' });
    }

    const dueno = {
      id: result.rows[0].id,
      nombre: result.rows[0].dueno_nombre,
      correo: result.rows[0].correo,
      telefono: result.rows[0].telefono,
      direccion: result.rows[0].direccion,
      photourl: result.rows[0].photourl || '', 
      mascotas: []
    };

    const mascotasMap = {};

    result.rows.forEach(row => {
      if (!mascotasMap[row.mascota_id]) {
        mascotasMap[row.mascota_id] = {
          id: row.mascota_id,
          nombre: row.mascota_nombre,
          tipo: row.tipo ,
          raza: row.raza ,
          edad: row.edad ,
          dueno_id: row.dueno_id, 
          photourl: row.photourl ,
          fechanacimiento: row.fechanacimiento, 
          castrado: row.castrado ,
          vacunas: []
        };
        dueno.mascotas.push(mascotasMap[row.mascota_id]);
      }

      if (row.id_vacuna) {
        mascotasMap[row.mascota_id].vacunas.push({
          id: row.id_vacuna,
          nombre: row.nombre_vacuna || null,
          fechaaplicacion: row.fechaaplicacion || null
        });
      }
    });

    res.status(200).json(dueno);
    console.log('Received data:', dueno);
  } catch (error) {
    console.error('Error occurred during query:', error); // Log detailed error
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});




// Ruta para actualizar un dueño por su id
router.put('/dueno/:correo', async (req, res) => {
  try {
    const { nombre, correo, telefono, direccion, photoUrl } = req.body; // Usa req.body para obtener los datos
    console.log('Received data:', req.body); // Registra los datos recibidos

    if (!nombre || !correo || !telefono || !direccion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const query = 'UPDATE dueno SET nombre = $1, telefono = $3, direccion = $4, photourl = $5 WHERE correo = $2';
    const values = [nombre, correo, telefono, direccion, photoUrl];
    const result = await pool.query(query, values);

    res.status(200).json({ message: 'Registro actualizado exitosamente', result });
  } catch (error) {
    console.error('Error occurred during query:', error); // Registra el error detallado
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});



router.get('/dueno/macotas/:id_mascota', async (req, res) => {

  try{
    const { id_mascota } = req.params;
    const query = 'SELECT * FROM mascota WHERE id_mascota = $1';
    
    const result = await pool.query(query, [id_mascota]);
    res.status(200).json(result.rows);

    console.log('Received data:', result.rows);
  }catch(error){
    console.error('Error occurred during query:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;



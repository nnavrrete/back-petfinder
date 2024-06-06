const { pool } = require('../db/db');

const Routes = (app) => {
  // Ruta para crear un nuevo dueño
  app.post('/dueno', async (req, res) => {
    try {
      const { nombre, correo, telefono, direccion, id_redsocial } = req.body;
      if (!id_redsocial  || !nombre || !correo || !telefono || !direccion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }
      const query = 'INSERT INTO dueno (nombre, correo, telefono, dirección, id_redsocial) VALUES ($1, $2, $3, $4, $5)';
      const values = [nombre, correo, telefono, direccion, id_redsocial];
      const result = await pool.query(query, values);
      res.status(201).json({ message: 'Registro creado exitosamente', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });

  // Ruta para obtener los dueños por su id_redsocial
  app.get('/:id_redsocial', async (req, res) => {
    try {
      const { id_redsocial } = req.params;
      const query = 'SELECT * FROM dueno WHERE id_redsocial = $1';
      const result = await pool.query(query, [id_redsocial]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
};

module.exports = { Routes };
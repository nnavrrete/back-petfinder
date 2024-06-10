const { pool } = require('../db/db');

const Routes = (app) => {
  // Ruta para crear un nuevo dueño
  app.post('/dueno', async (req, res) => {
    try {
      const { nombre, correo, telefono, dirección, id_redsocial } = req.body;
      console.log('Received data:', req.body); // Log received data
      
      if (!id_redsocial || !nombre || !correo || !telefono || !dirección) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }

      // Check if the user already exists
      const checkQuery = 'SELECT * FROM dueno WHERE correo = $1';
      const checkResult = await pool.query(checkQuery, [correo]);

      if (checkResult.rows.length > 0) {
        // User already exists
        return res.status(409).json({ message: 'El usuario ya existe' });
      }

      // Insert new user if not exists
      const insertQuery = 'INSERT INTO dueno (nombre, correo, telefono, dirección, id_redsocial) VALUES ($1, $2, $3, $4, $5)';
      const insertValues = [nombre, correo, telefono, dirección, id_redsocial];
      const result = await pool.query(insertQuery, insertValues);

      res.status(201).json({ message: 'Registro creado exitosamente', result });
    } catch (error) {
      console.error('Error occurred during query:', error); // Log detailed error
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

  app.get('/' , (req, res) => {
    res.send('Hola mundo');
  });

};



module.exports = { Routes };
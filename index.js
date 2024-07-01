const express = require('express');
const cors = require('cors');
const { connectdb } = require('./db/db');
const duenoRoutes = require('./routes/dueno');
const mascotaRoutes = require('./routes/mascota');
const mascotaDuenoRoutes = require('./routes/duenoMascota');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.json());

connectdb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(duenoRoutes);
app.use(mascotaRoutes);



app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
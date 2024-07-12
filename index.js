const express = require('express');
const cors = require('cors');
const { connectdb } = require('./db/db');
const duenoRoutes = require('./routes/dueno');
const mascotaRoutes = require('./routes/mascota');
const bucket = require('./routes/bucket');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());

connectdb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(duenoRoutes);
app.use(mascotaRoutes);
app.use(bucket);

app.listen(port, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
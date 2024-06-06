const express = require('express');
const cors = require('cors');
const {connectdb} = require('./db/db');
const { Routes } = require('./routes/routes');

const app = express();

app.use(cors());
app.use(express.json());

connectdb();
Routes(app);


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
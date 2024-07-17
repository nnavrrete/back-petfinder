const { Storage } = require('@google-cloud/storage');
const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

const storage = new Storage({
  projectId: 'petfinder-62461',
  keyFilename: 'credential/credential.json',
});

const bucketName = 'bucketpet23';

router.get('/image', async (req, res) => {
  try {
    const filename = req.query.filename;
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      contentType: 'image/jpeg',
    };

    const [url] = await storage.bucket(bucketName).file(filename).getSignedUrl(options);
    res.status(200).send(url);
    console.log('Generated GET signed URL:', url);
  } catch (error) {
    console.error('Error getting signed URL', error);
    res.status(500).send('Error getting signed URL');
  }
});

router.post('/image-public-url', async (req, res) => {
  try {
    const filename = req.body.filename;
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    res.status(200).json({ publicUrl: publicUrl });
    console.log('Generated public URL:', publicUrl);
  } catch (error) {
    console.error('Error getting public URL', error);
    res.status(500).send('Error getting public URL');
  }
});

router.put('/dueno/imagen/:correo', async (req, res) => {
  try {
    const { correo, photourl } = req.body;
    console.log('Received data:', req.body);

    if (!correo || !photourl) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const query = 'UPDATE dueno SET photourl = $1 WHERE correo = $2';
    const values = [photourl, correo];
    const result = await pool.query(query, values);

    res.status(200).json({ message: 'Registro actualizado exitosamente', result });
  } catch (error) {
    console.error('Error occurred during query:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;

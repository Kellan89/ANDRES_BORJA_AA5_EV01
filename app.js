const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2/promise');
const cors = require('cors');
const session = require('express-session');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: 'asdlfkfso3234o231sdflasdfasdfasdfoasdf',
  resave: false,
  saveUninitialized: false, // Cambiado a false
  cookie: {
    secure: false, // Asegúrate de que secure esté en false si no usas HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 día
  },
}));

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'login',
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/login', async (req, res) => {
  const datos = req.query;
  try {
    const [results, fields] = await connection.query(
      "SELECT * FROM `usuarios` WHERE `usuario` = ? AND `clave` = ?",
      [datos.usuario, datos.clave]
    );
    if (results.length > 0) {
      req.session.usuario = datos.usuario;
      res.status(200).send('Inicio de sesion correcto');
    } else {
      res.status(401).send('Datos incorrectos');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error en el servidor');
  }
});

app.get('/validar', (req, res) => {
  if (req.session.usuario) {
    res.status(200).send('Sesion Validada!');
  } else {
    res.status(401).send('Sesion Invalida!');
  }
});

app.get('/convertirTextoAVoz', (req, res) => {
  const texto = req.query.texto;
  // Lógica de conversión de texto a voz aquí
  res.status(200).send('Texto convertido a voz');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

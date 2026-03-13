const express = require('express');
const peliculas = require('./peliculas.json');
const app = express();
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.json({ message: 'hola mundo' });
});

app.get('/peliculas', (req, res) => {
    res.json(peliculas);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, ()=> {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
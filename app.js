const express = require('express');
const peliculas = require('./peliculas.json');
const app = express();
app.disable('x-powered-by');

app.get('/peliculas', (req, res) => {
    res.json(peliculas);
});

app.get('/peliculas/:id', (req, res) => {
    const { id } = req.params;
    const pelicula = peliculas.find(peli => 
        peli.id === id
    );

    if(pelicula){
        return res.json(pelicula);
    }
    res.status(404).json({ message: 'pelicula no encontrada' });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, ()=> {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
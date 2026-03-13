const express = require('express');
const peliculas = require('./peliculas.json');
const app = express();
app.disable('x-powered-by');

//filtrar pelicula por id
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

//filtrar peliculas por genero
app.get('/peliculas', (req, res) => {
    const { genre } = req.query;
    if(genre) {
        console.log(genre);
        const peliculasFiltradas = peliculas.filter(
            peli => peli.genre.some(genero => genero.toLowerCase() === genre.toLowerCase())
        );
        return res.json(peliculasFiltradas);
    }
    if(!genre) {
        return res.json(peliculas);
    }
    res.status(404).json({ message: 'error' });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, ()=> {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
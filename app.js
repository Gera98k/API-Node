const express = require('express');
const peliculas = require('./peliculas.json');
const crypto = require('node:crypto');
const { validarPeli, validarPeliculaParcialmente } = require('./schemas/peliculas');
const app = express();
app.use(express.json()); // express.json() es el middleware de express para tratar datos y chunks de un POST
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

app.post('/peliculas', (req, res) => {

    const resultado = validarPeli(req.body);

    if(!resultado.success) {
        return res.status(400).json({ error: JSON.parse(resultado.error.message)});
    }

    const nuevaPeli = {
        id: crypto.randomUUID(),
        ...resultado.data
    }
    
    peliculas.push(nuevaPeli);
    res.status(201).json(nuevaPeli);
});


//Actualizar pelicula
app.patch('/peliculas/:id', (req, res) => {
    const resultado = validarPeliculaParcialmente(req.body);

    if(!resultado.success) {
        return res.status(400).json({ error: JSON.parse(resultado.error.message) });
    }

    const { id } = req.params;
    const indexPelicula = peliculas.findIndex(pelicula => pelicula.id === id);

    if(indexPelicula === -1) {
        return res.status(400).json({ message: 'Pelicula no encontrada' });
    }

    const actualizarPelicula = {
        ... peliculas[indexPelicula],
        ... resultado.data
    }

    peliculas[indexPelicula] = actualizarPelicula;

    return res.json(actualizarPelicula);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, ()=> {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
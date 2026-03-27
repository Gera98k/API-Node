const express = require('express');
const peliculas = require('./peliculas.json');
const crypto = require('node:crypto');
const { validarPeli, validarPeliculaParcialmente } = require('./schemas/peliculas');
const app = express();
app.use(express.json()); // express.json() es el middleware de express para tratar datos y chunks de un POST
app.disable('x-powered-by');

//origenes que el CORS aceptara
const ORIGENES_ACEPTADOS = [
    'http://localhost:8080'
];

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
    //metodos simples como GET no necesitan el OPTIONS para hacer funcionar el CORS
    const origen = req.header('origin');

    if(ORIGENES_ACEPTADOS.includes(origen) || !origen) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    }

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


//Agregar pelicula nueva validando completamente con zod
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


//Actualizar pelicula validando parcialmente con zod
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

//Eliminar pelicula por id
app.delete('/peliculas/:id', (req, res) => {
    const origen = req.header('origin');
    if(ORIGENES_ACEPTADOS.includes(origen) || !origen) {
        res.header('Access-Control-Allow-Origin', origen);
    }

    const { id } = req.params;
    const indexPelicula = peliculas.findIndex(movie => movie.id === id );

    if(indexPelicula === -1){
        return res.status(401).json({ message: 'Pelicula no encontrada' });
    }

    peliculas.splice(indexPelicula, 1);

    return res.json({ message: 'Pelicula borrada' });
});


//metodos como DELETE necesitan pasarle options para el CORS
app.options('/peliculas/:id', (req, res) => {
    const origen = req.header('origin'); 
    if(ORIGENES_ACEPTADOS.includes(origen) || !origen) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    }
    res.send(200);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, ()=> {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
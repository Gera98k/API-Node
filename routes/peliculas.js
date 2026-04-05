import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { validarPeli, validarPeliculaParcialmente } from '../schemas/peliculas.js';
import peliculas from '../peliculas.json' with { type: 'json' };

export const peliculasRouter = Router();

//filtrar pelicula por id
peliculasRouter.get('/:id', (req, res) => {
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
peliculasRouter.get('/', (req, res) => {

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
peliculasRouter.post('/', (req, res) => {

    const resultado = validarPeli(req.body);

    if(!resultado.success) {
        return res.status(400).json({ error: JSON.parse(resultado.error.message)});
    }

    const nuevaPeli = {
        id: randomUUID(),
        ...resultado.data
    }
    
    peliculas.push(nuevaPeli);
    res.status(201).json(nuevaPeli);
});

//Actualizar pelicula validando parcialmente con zod
peliculasRouter.patch('/:id', (req, res) => {
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
peliculasRouter.delete('/:id', (req, res) => {

    const { id } = req.params;
    const indexPelicula = peliculas.findIndex(movie => movie.id === id );

    if(indexPelicula === -1){
        return res.status(401).json({ message: 'Pelicula no encontrada' });
    }

    peliculas.splice(indexPelicula, 1);

    return res.json({ message: 'Pelicula borrada' });
});
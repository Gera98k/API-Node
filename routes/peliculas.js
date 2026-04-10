import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { validarPeli, validarPeliculaParcialmente } from '../schemas/peliculas.js';
import peliculas from '../peliculas.json' with { type: 'json' };
import { modeloPelicula } from '../models/movies.js';

export const peliculasRouter = Router();

//filtrar pelicula por id
peliculasRouter.get('/:id', async(req, res) => {
    const { id } = req.params;
    const pelicula = await modeloPelicula.obtenerPorId({ id });
    res.json(pelicula);
});

//filtrar peliculas por genero
peliculasRouter.get('/', async(req, res) => {

    const { genero } = req.query;
    const peliculas = await modeloPelicula.obtenerUnGeneroOTodo({ genero });
    res.json(peliculas);
    
});

//Agregar pelicula nueva validando completamente con zod
peliculasRouter.post('/', async(req, res) => {

    const resultado = validarPeli(req.body);

    if(!resultado.success) {
        return res.status(400).json({ error: JSON.parse(resultado.error.message)});
    }

    const nuevaPeli = await modeloPelicula.agregarPeli(resultado.data);
    res.status(201).json(nuevaPeli);
});

//Actualizar pelicula validando parcialmente con zod
peliculasRouter.patch('/:id', async (req, res) => {
    const resultado = validarPeliculaParcialmente(req.body);

    if(!resultado.success) {
        return res.status(400).json({ error: JSON.parse(resultado.error.message) });
    }

    const { id } = req.params;

    const peliculaActualizada = await modeloPelicula.actualizarPelicula({ id, input: resultado.data });
    return res.json(peliculaActualizada);
});

//Eliminar pelicula por id
peliculasRouter.delete('/:id', async (req, res) => {

    const { id } = req.params;

    const peliculaEliminada = await modeloPelicula.eliminarPelicula({ id });
    
    if(peliculaEliminada === false){
        return res.status(401).json({ message: 'Pelicula no encontrada' });
    }

    return res.json({ message: 'Pelicula borrada' });
});
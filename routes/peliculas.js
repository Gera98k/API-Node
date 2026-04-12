import { Router } from 'express';
import { validarPeli, validarPeliculaParcialmente } from '../schemas/peliculas.js';
import { modeloPelicula } from '../models/movies.js';
import { controladorPelicula } from '../controllers/peliculas.js';

export const peliculasRouter = Router();

//filtrar pelicula por id
peliculasRouter.get('/:id', controladorPelicula.consultaPorId);
//filtrar peliculas por genero o todas en caso de no pasar genero
peliculasRouter.get('/', controladorPelicula.consultarPorGenero);

//Agregar pelicula nueva validando completamente con zod
peliculasRouter.post('/', controladorPelicula.agregarPelicula);
//Actualizar pelicula validando parcialmente con zod
peliculasRouter.patch('/:id', controladorPelicula.actualizacionDePeli);
//Eliminar pelicula por id
peliculasRouter.delete('/:id', controladorPelicula.eliminarPelicula);
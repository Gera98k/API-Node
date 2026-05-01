import { Router } from 'express';
import { controladorPelicula } from '../controllers/peliculas.js';


export const crearRouterPeliculas = ({ modeloPelicula })=>{
    const peliculasRouter = Router();
    const controladorPeli = new controladorPelicula({ modeloPelicula });

    peliculasRouter.get('/:id', controladorPeli.consultaPorId);
    peliculasRouter.get('/', controladorPeli.consultarPorGenero);
    peliculasRouter.post('/', controladorPeli.agregarPelicula);

    peliculasRouter.patch('/:id', controladorPeli.actualizacionDePeli);
    peliculasRouter.delete('/:id', controladorPeli.eliminarPelicula);

    return peliculasRouter;
}
import { modeloPelicula } from '../models/movies.js';
import { validarPeli, validarPeliculaParcialmente } from '../schemas/peliculas.js';

export class controladorPelicula {
    static async consultaPorId(req, res) {
        const { id } = req.params;
        const pelicula = await modeloPelicula.obtenerPorId({ id });
        res.json(pelicula);
    }

    static async consultarPorGenero (req, res){
        const { genero } = req.query;
        const peliculas = await modeloPelicula.obtenerUnGeneroOTodo({ genero });
        res.json(peliculas);
    }

    static async agregarPelicula(req, res){
    
        const resultado = validarPeli(req.body);
    
        if(!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message)});
        }
    
        const nuevaPeli = await modeloPelicula.agregarPeli(resultado.data);
        res.status(201).json(nuevaPeli);
    }

    static async actualizacionDePeli(req, res){
        const resultado = validarPeliculaParcialmente(req.body);
        if(!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) });
        }
    
        const { id } = req.params;
    
        const peliculaActualizada = await modeloPelicula.actualizarPelicula({ id, input: resultado.data });
        return res.json(peliculaActualizada);
    }

    static async eliminarPelicula(req, res){

        const { id } = req.params;

        const peliculaEliminada = await modeloPelicula.eliminarPelicula({ id });

        if(peliculaEliminada === false){
            return res.status(401).json({ message: 'Pelicula no encontrada' });
        }

        return res.json({ message: 'Pelicula borrada' });
    }
}
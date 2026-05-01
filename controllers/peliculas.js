import { validarPeli, validarPeliculaParcialmente } from '../schemas/peliculas.js';

export class controladorPelicula {

    // Agregar el constructor para alamcenar en el estado de la clase el modelo a usar
    constructor({ modeloPelicula }){
        this.modeloPelicula = modeloPelicula;
    }

    consultaPorId = async(req, res)=>{ //Cada metodo debe adaptarse para que funcione con el estado del objeto con el que se instancio, es decir el parametro del modelo
        const { id } = req.params;
        const pelicula = await this.modeloPelicula.obtenerPorId({ id }); //Ahora debemos utilizar el modelo pasado en el constructor en la instancia del objeto de esta clase
        res.json(pelicula);
    }

    consultarPorGenero = async(req, res)=>{
        const { genero } = req.query;
        const peliculas = await this.modeloPelicula.obtenerUnGeneroOTodo({ genero });
        res.json(peliculas);
    }

    agregarPelicula = async(req, res)=>{
    
        const resultado = validarPeli(req.body);
    
        if(!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message)});
        }
    
        const nuevaPeli = await this.modeloPelicula.agregarPeli(resultado.data);
        res.status(201).json(nuevaPeli);
    }

    actualizacionDePeli = async(req, res)=>{
        const resultado = validarPeliculaParcialmente(req.body);
        if(!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) });
        }
    
        const { id } = req.params;
    
        const peliculaActualizada = await this.modeloPelicula.actualizarPelicula({ id, input: resultado.data });
        return res.json(peliculaActualizada);
    }

    eliminarPelicula = async(req, res)=>{

        const { id } = req.params;

        const peliculaEliminada = await this.modeloPelicula.eliminarPelicula({ id });

        if(peliculaEliminada === false){
            return res.status(401).json({ message: 'Pelicula no encontrada' });
        }

        return res.json({ message: 'Pelicula borrada' });
    }
}
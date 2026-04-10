import peliculas from '../peliculas.json' with { type: 'json' };
import { randomUUID } from 'node:crypto';

export class modeloPelicula {

    static async obtenerUnGeneroOTodo({ genero }) {
        
        if(genero) {
            return peliculas.filter(peli => {
                return peli.genre.some(gen => gen.toLowerCase() === genero.toLowerCase());
            });
        }
        
        if(!genero) {
            console.log('No hay genero');
        }
        
        return peliculas;
    }

    static async obtenerPorId({ id }){

        const pelicula = peliculas.find(peli => 
            peli.id === id
        );

        if(!pelicula){
            console.log('Error de ID');
        }

        return pelicula;
    }

    static async agregarPeli(input){
        const nuevaPeli = {
            id: randomUUID(),
            ...input
        }
            
        peliculas.push(nuevaPeli);
        return nuevaPeli;
    }

    static async actualizarPelicula({ id, input }){
        
        const indexPelicula = peliculas.findIndex(peli => peli.id === id);

        if(indexPelicula === -1) return false;
        
        peliculas[indexPelicula] = {
            ...peliculas[indexPelicula],
            ...input
        }
        
        return peliculas[indexPelicula];
    }

    static async eliminarPelicula({ id }){
        const indexPelicula = peliculas.findIndex(movie => movie.id === id );
        
        if(indexPelicula === -1) return false;

        peliculas.splice(indexPelicula, 1);
        return true;
    }
}
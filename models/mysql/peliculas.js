import mysql from 'mysql2/promise';
import { error } from 'node:console';

const configuracion = {
    host: 'localhost',
    user: 'root',
    port: 9000,
    password: '',
    database: 'peliculasdb'
}

const coneccion = await mysql.createConnection(configuracion);

export class modeloPelicula {


    static async obtenerUnGeneroOTodo({ genero }) {

        if(genero) {

            const generoMinusculas = genero.toLowerCase();
            const [consulta] = await coneccion.execute(
                'SELECT * FROM peliculas INNER JOIN pelicula_generos ON peliculas.id = pelicula_generos.pelicula_id INNER JOIN generos ON pelicula_generos.generos_id = generos.id WHERE generos.nombre = ?;',
                [generoMinusculas]
            );
            
            if (consulta.length === 0) { 
                return [] 
            }
            return consulta;     
        }

        const [consulta] = await coneccion.execute(
            'SELECT * FROM peliculas;'
        );

        if (consulta.length === 0) { 
            return [] 
        }

        return consulta;
    }

    static async obtenerPorId({ id }){ //averiguar como manejar correctamente el error (en el sql) de id cuando no existe 

        try {
            const [consulta] = await coneccion.execute(
                'SELECT * FROM peliculas WHERE id = UUID_TO_BIN(?);',
                [id]
            );

            if(consulta.length === 0) {
                return [];
            }

            return consulta;
        }catch (e) {
            throw new Error('Error al consultar el id');
        }
    }

    static async agregarPeli(input){
        
        const {
            title,
            year,
            director,
            duration,
            poster,
            rate,
            genre: generoInput
        } = input;

        const [uuidNuevo] = await coneccion.execute('SELECT UUID() uuid;');
        const [{ uuid }] = uuidNuevo;

        try {
            await coneccion.execute(
                `INSERT INTO peliculas (id, titulo, año, director, duracion, poster, calificacion)
                VALUES (UUID_TO_BIN("${ uuid }"), ?, ?, ?, ?, ?, ?);`,
                [title, year, director, duration, poster, rate]
            );
        } catch(e) {
            throw new Error('Error creando la pelicula');
        }

        const comprobacionInsertar = await coneccion.execute(
            'SELECT * FROM peliculas WHERE id = UUID_TO_BIN(?);', 
            [uuid]
        );
        console.log(comprobacionInsertar);
        return comprobacionInsertar;
    }

    static async actualizarPelicula({ id, input }){

        try {

            const {
                title,
                year,
                director,
                duration,
                poster,
                rate
            } = input;

            const [actualizacionRegistro] = await coneccion.execute(
                'UPDATE peliculas SET titulo = ?, año = ?, director = ?, duracion = ?, poster = ?, calificacion = ? WHERE id = UUID_TO_BIN(?);',
                [title, year, director, duration, poster, rate, id]
            );

            return actualizacionRegistro;


        }catch {

            throw new Error('El registro no ha posido ser actualizado');
        }
    }

    static async eliminarPelicula({ id }){
        
        try {
            const [eliminacionRegistro] = await coneccion.execute(
                'DELETE FROM peliculas WHERE id = UUID_TO_BIN(?);', 
                [id]
            );
            
            return eliminacionRegistro.affectedRows > 0;
        }catch(e) {
            throw new Error('Error eliminando la pelicula');
        }

    }
}
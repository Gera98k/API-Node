import cors from 'cors';

const ORIGENES_ACEPTADOS = [
    'http://localhost:8080'
];

export const corsMiddleware = ( { aceptedOrigins = ORIGENES_ACEPTADOS } = {} ) => cors({
    origin: (origin, callback) => {
        if(aceptedOrigins.includes(origin)){
            return callback(null, true);
        }

        if(!origin){
            return callback(null, true);
        }

        return callback(new Error('No permitido por CORS'));
    }
});
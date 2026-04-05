import express, { json } from 'express';
import { peliculasRouter } from './routes/peliculas.js';
import { corsMiddleware } from './middlewares/cors.js';

const app = express();
app.use(json()); // express.json() es el middleware de express para tratar datos y chunks de un POST
app.use(corsMiddleware()); //implementar middleware para cors pero acepta todos los origenes por defecto
app.use('/peliculas', peliculasRouter);
app.disable('x-powered-by');

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, ()=> {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
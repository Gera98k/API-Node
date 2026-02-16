const http = require('node:http');
const sistemaArchivos = require('node:fs');
const definicionPuerto = 1234;

const procesarPeticion = (req,res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if(req.url === '/') {
        res.end('<h1>Mi pagína</h1>');
    }else if (req.url === '/gera_traje.png') {
        sistemaArchivos.readFile('./1.jpg', (err, data) => {
            if(err) {
                res.statusCode = 500;
                res.end('<h1>5oo Internal error (error interno del servidor)</h1>');
            }else {
                res.setHeader('Content-Type', 'image/png');
                res.end(data);
            }
        });
    }
}

const servidor = http.createServer(procesarPeticion);

servidor.listen(definicionPuerto, () => {
    console.log(`servidor escuchando en el puerto http://localhost:${definicionPuerto}`);
});
const express = require('express');
const app = express();
const ditto = require('./ditto.json');

app.disable('x-powered-by');
const PORT = process.env.PORT ?? 1234;

app.get('/pokemon/ditto', (req, res) => {
    res.json(ditto);
});

app.post('/pokemon', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const data = JSON.parse(body);
        data.timestamp = Date.now();
        res.status(200).json(data);
    });
});

app.use((req, res) => {
    res.status(404).send('<h1>404</h1>');
});

app.listen(PORT, ()=> {
    console.log(`Servidor escuchando en el puerto: http://localhost:${PORT}`);
})
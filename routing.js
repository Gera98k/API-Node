const http = require('node:http');

const dittoJSON = require('./ditto.json');

const processRequest = (req, res) => {
    const {method, url} = req;

    switch(method) {
        case 'GET':
            console.log('URL recibida:', url);
            switch(url) {
                case '/pokemon/ditto':
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    return res.end(JSON.stringify(dittoJSON));
                default:
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html; charset-utf-8');
                    return res.end('<h1>404</h1>');
            }
        case 'POST':
            console.log('URL recibida:', url);
            switch(url) {
                case '/pokemon':
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });
                    req.on('end', () => {
                        const data = JSON.parse(body);
                        res.writeHead(201, {'Content-Type': 'application/json; charset=utf-8'});
                        data.timestamp = Date.now();
                        res.end(JSON.stringify(data));
                    });
                default:
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html; charset-utf-8');
            }
    }
}

const server = http.createServer(processRequest);

server.listen(1234, () => {
    console.log('Servidor escuchando en el puerto 1234');
});
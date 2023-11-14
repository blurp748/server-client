const tls = require('tls');
const fs = require('fs');

const options = {
    key: fs.readFileSync('/home/etudiant/tls-reverse/nginx-reverse/ssl/serveur_http.pem'),
    cert: fs.readFileSync('/home/etudiant/tls-reverse/nginx-reverse/ssl/serveur_http.cert.pem')
};

const port = 8888;

const server = tls.createServer(options, onClientConnection);

server.listen(port, function () {
    console.log(`Server started on port ${port}`);
});

function onClientConnection(socket) {
    console.log(`${socket.remotePort} is connected`);

    socket.name = socket.remotePort;

    socket.on('data', function (data) {
        console.log(`Calculation: ${data} from ${socket.name}`);

        if (data.toString().trim() === "0") {
            socket.end();
        }

        const result = calculator(data);
        socket.write(result);
    });

    socket.on('close', function () {
        console.log(`${socket.remoteAddress}:${socket.remotePort} Connection closed`);
    });

    socket.on('error', function (error) {
        console.error(`${socket.remoteAddress}:${socket.remotePort} Connection Error ${error}`);
    });
}

function calculator(fn) {
    let res;
    try {
        res = new Function('return ' + fn)();
        res = res.toString();
    } catch (error) {
        res = "INVALID FORMAT";
    }
    return res;
}

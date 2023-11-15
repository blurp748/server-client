const tls = require('tls');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const port = 8888;

const options = {
    host: 'www.tanghe.fr',
    port: port,
    rejectUnauthorized: true
};

const secureSocket = tls.connect(options, () => {
    console.log(`TLS connection established with server on port ${port}`);
    readline.question(`Enter calculation. Write '0' to exit.\n`, calculation => {
        secureSocket.write(calculation);
        if (calculation === '0') {
            secureSocket.destroy();
        }
	readline.close();
    });
});

secureSocket.on('data', function (data) {
    console.log(`Result: ${data}`);
});

secureSocket.on('close', function () {
    console.log('Connection Closed');
});

secureSocket.on('error', function (error) {
    console.error(`Connection Error ${error}`);
});

const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('/home/etudiant/tls-reverse/nginx-reverse/ssl/serveur_http.pem'),
    cert: fs.readFileSync('/home/etudiant/tls-reverse/nginx-reverse/ssl/serveur_http.cert.pem')
};

const port = 8888;

const server = https.createServer(options, onClientConnection);

server.listen(port,function(){
   console.log(`Server started on port ${port}`); 
});

var clients = [];

//the client handling callback
function onClientConnection(socket){
    //Log when a client connnects.
    console.log(`${socket.remotePort} is connected`);

    // Identify this client
    socket.name = socket.remotePort

    // Put this new client in the list
    clients.push(socket);
    
	//Handle the client data.
    socket.on('data',function(data){
        //Log data received from the client
        console.log(`Calcul : ${data}  de `+ socket.name);
        
        if(data == "0"){
            socket.end();
        }

        var result = calculator(data);
		
		//prepare and send a response to the client 
		socket.write(result);
	});
    
	//Handle when client connection is closed
    socket.on('close',function(){
        console.log(`${socket.remoteAddress}:${socket.remotePort} Connection closed`);
        clients.splice(clients.indexOf(socket), 1);
    });
    
	//Handle Client connection error.
    socket.on('error',function(error){
        console.error(`${socket.remoteAddress}:${socket.remotePort} Connection Error ${error}`);
    });
};

function calculator(fn) {
    var res;
    try {
        var res = new Function('return ' + fn)();
        res = res.toString();
    } catch (error) {
        res = "MAUVAIS FORMAT";
    }
    return res;
}

function broadcast(sender){
    clients.forEach(client => {
        if (client === sender) return;
        client.write("Everybody ! " + sender.name + " joined the party")
    });
}
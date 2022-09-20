const net = require('net');

const port = 8888;

//Create the socket client.
const client = new net.Socket();

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

//Connect to the server on the configured port 
client.connect(port,function(){
	//Log when the connection is established
    console.log(`Connected to server on port ${port}`);
    
    readline.question(`Calcul ? Write 0 to exit \n`, calcul => {
        client.write(calcul);
        readline.close();
    });

});
//Handle data coming from the server
client.on('data',function(data){
    console.log(`Résultat : ${data}`);
});
// Handle connection close 
client.on('close',function(){
    console.log('Connection Closed');
});
//Handle error
client.on('error',function(error){
    console.error(`Connection Error ${error}`); 
});
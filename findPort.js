//LLRP DEVICE SCANNER
var net    = require('net'), Socket = net.Socket;

var checkPort = function(port, host, callback) {
    var socket = new Socket(), status = null;

    // Socket connection established, port is open
    socket.on('connect', function() {status = 'open';socket.end();});
    socket.setTimeout(1500);// If no response, assume port is not listening
    socket.on('timeout', function() {status = 'closed';socket.destroy();});
    socket.on('error', function(exception) {status = 'closed';});
    socket.on('close', function(exception) {callback(null, status,host,port);});

    socket.connect(port, host);
}

var LAN = '192.168.1'; //Local area network to scan (this is rough)
var LLRP = 3000; //globally recognized LLRP port for RFID readers

//scan over a range of IP addresses and execute a function each time the LLRP port is shown to be open.
for(var i=1; i <=255; i++){
    console.log(LAN+'.'+i)
    checkPort(LLRP, LAN+'.'+i, function(error, status, host, port){
        console.log(error)
        if(status == "open"){
            console.log("Reader found: ", host, port, status);
        }
    });
}
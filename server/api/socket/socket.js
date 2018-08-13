/**
 * Socket API for Observo
 * @author ImportPython
 */

var io = require('socket.io').listen(3000)
var EventEmitter = require('events').EventEmitter; 
var events = new EventEmitter();
 
Observo.onMount((imports) => {
    
})

let handler = {}

Observo.register(null, {
    GLOBAL: {
        addHandler: (callback) => {
            let name;
            try { throw new Error(); }
            catch (e) { 
                var re = /(\w+)@|at (\w+) \(/g, st = e.stack, m;
                re.exec(st), m = re.exec(st);
                name = m[1] || m[2];
            }
            console.log(name)
            if (handler[name] == null) {
                handler[name] = {}
                let main = io.of("/plugins/" + name).on('connection', function (client) {
                    let events = []
                    const auth = true; //TODO: Make it not a constant
                    events.push("auth")
                    let checkOn = (name, callback) => {
                        for (let e in events) {
                            if (e != name) {                              
                                client.on(name, () => {if (auth) {callback()}})
                            }
                        }
                    }
                    let _main = { emit: (name, value) => {if (auth){main.emit(name, value)}} }
                    let _client = {on: checkOn}
                    //this should be called when the auth process is done tbo
                    callback(_main, _client)
                })
            } else {
                console.log(`${name} is already a registered event handler!`)
            }   
        }
    }
})
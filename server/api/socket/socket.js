/**
 * Socket API for Observo
 * @author ImportPython
 */

var io = require('socket.io').listen(3000)
var EventEmitter = require('events').EventEmitter;
var events = new EventEmitter();
const uuidv4 = require('uuid/v4'); //Random

Observo.onCustomMount((imports) => {
    let database = imports.api.database.API.getManager()

    let socket = io.of("/core/").on('connection', function (client) {
        let sessionKey = uuidv4()
        console.log("$ENew Client: $f" + sessionKey)
        client.once('disconnect', function () {
            client.disconnect()
        })
        client.emit("auth_sessionKey", sessionKey)
        client.on("auth_signIn", function (data) {
            console.log(JSON.stringify(data))
            if (data.password != null && data.username != null) {
                let username = data.username.trim()
                let password = data.password.trim()
                if (username != "" && username.length > 2 && password.length > 3) {
                    database.isUser(username, (check) => {
                        if (!check) {
                            /**
                             * TODO:
                             * CHECK SETTINGS HERE IF ADMIN DOESN'T WANT USER TO CREATE ACCOUNT
                             */
                            //socket.emit("vaild_signUp", { username: username })
                        } else {
                            database.signIn(username, password, sessionKey, (response) => {
                                console.log(JSON.stringify(response))
                                if (response != null) {
                                    socket.emit("auth_vaildSignin", { authKey: response.authKey, sessionKey: sessionKey, uuid: response.uuid })
                                }
                            })
                        }
                    })
                }
            }
        })

    })
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

            if (handler[name] == null) {
                handler[name] = {}
                let main = io.of("/plugins/" + name).on('connection', function (client) {
                    let events = []
                    const auth = true; //TODO: Make it not a constant
                    events.push("auth")
                    let checkOn = (name, callback) => {
                        for (let e in events) {
                            if (e != name) {
                                client.on(name, () => { if (auth) { callback() } })
                            }
                        }
                    }
                    let _main = { emit: (name, value) => { if (auth) { main.emit(name, value) } } }
                    let _client = { on: checkOn }
                    //this should be called when the auth process is done tbo
                    callback(_main, _client)
                })
            } else {
                console.log(`${name} is already a registered event handler!`)
            }
        }
    }
})
Observo.onMount((imports) => {
    let socketCount = 0
    console.log("MOUNTED")
    imports.api.socket.addHandler((main, client) => {
        socketCount++
        console.log("New Client?")
        main.emit('users connected', socketCount)
        client.on('disconnect', function() {
            socketCount--
            main.emit('users connected', socketCount)
        })
    })
})
Observo.register(null, {
    GLOBAL: {},
})
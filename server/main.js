let DefinedManager = require("./defined")

let manager = new DefinedManager()
manager.setDefinedID("Observo")
manager.addDefined("API", "./api", true, ["API"])
manager.addDefined("PLUGINS", "./plugins", false)
manager.onAppReady((console) => {
    
})
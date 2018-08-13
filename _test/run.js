let plugin = require("./runtime/plugin").PluginManager

let manager = new plugin()
manager.addAPI("./api")
//manager.addPlugins("./plugins")
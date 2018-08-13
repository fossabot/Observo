require("amd-loader");
let logging = require('./logging.js')
let log = new logging()
log.log("Message")
const getPackages = function (dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = getPackages(path.join(dir, file), filelist);
        }
        else {
            if (file == "package.json") {
                filelist.push(path.join(dir, file));
            }
        }
    });
    return filelist;
};
const splitAt = index => x => [x.slice(0, index), x.slice(index)]
let self
class Manager {
    constructor() {
        self = this
        this.api = {}
    }
    addAPI(path) {
        let apis = getPackages(path)
        for (let file in apis) {
            let f = apis[file]


            define(function (require, exports, module) {
                f = f.replace(/\\/g, "/");
                //console.log(("./" + f))
                let json = require(("./" + f))


                if (json.name && json.version) {
                    if (!self.api[json.name]) {
                        self.api[json.name] = {}
                        self.api[json.name].package = json
                        console.log("PLUGIN: " + json.name)
                        console.log("VERSION: " + json.version)
                        if (json.main)  {
                            let main = "./" + dir + "/" + json.main

                            require('fs').readFile(main, 'utf8', (err, data) => {
                                if (err) {throw err}
                                console.log(data)
                            });   
                        }  
                    }
                }

            });

        }
        console.log(JSON.stringify(self))
    }
    addPlugins(path) {
        let plugins = getPackages(path)
        console.log(plugins)
    }
    build() {

    }

}

let m = new Manager()

function PluginManager() {
    this.plugins
}

PluginManager.prototype.addAPI = function (path) {
    return m.addAPI.call(this, path);
}
PluginManager.prototype.addPlugins = function (path) {
    return m.addAPI.call(this, path);
}
PluginManager.prototype.build = function (path) {
    return m.addAPI.call(this, path);
}

exports.PluginManager = PluginManager;
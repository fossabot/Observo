/** Defined 
 *  An API and plugin loading system designed for requireless projects
 */

require("amd-loader");
var EventEmitter = require('events').EventEmitter;
const startTime = process.hrtime()
class Logging {
    constructor() {
        this.chrome = false
        this.prefix = this.setColors("$3 Observo $f|")
    }
    setColors(data) {
        let paint = (color, text) => {
            switch (color) {
                case '0'://black
                    text = '\x1B[30m' + text; break;
                case '4': //red
                    text = '\x1B[31m' + text; break;
                case '2': //green
                    text = '\x1B[32m' + text; break;
                case 'E': //yellow
                    text = '\x1B[33m' + text; break;
                case '1': //blue
                    text = '\x1B[34m' + text; break;
                case 'D': //magenta
                    text = '\x1B[35m' + text; break;
                case '3': //cyan
                    text = '\x1B[36m' + text; break;
                case 'f': //white
                    text = '\x1B[37m' + text; break;
                default:
                    text = color + text; break;
            }
            return text + '\x1B[39m' + '\x1b[0m';
        }
        let output = ""
        let painting = false
        let grabColor = 0
        let color = ""
        let items = []
        for (var i = 0; i < data.length; i++) {
            if (data[i] == "$") {
                if (painting) {
                    if (output != "") {
                        items.push(paint(color, output))
                        painting = false
                        output = ""
                    }
                }
                grabColor = true
                color = ""
            }
            if (grabColor) {
                color = color + data[i]
                if (color.length == 2) {
                    grabColor = false
                    painting = true
                    color = color.replace("$", "")
                }
            } else {
                output = output + data[i]
            }
        }
        if (painting) {
            items.push(paint(color, output))
        }
        output = ""
        for (let i in items) {
            output = output + items[i]
        }
        return output
    }
    log(message) { //2=green

        message = `${this.prefix} ${this.setColors(`$2${message}`)}`
        console.log(message)
    }
    info(message) {
        message = `${this.prefix} ${this.setColors(`$3${message}`)}`
        console.log(message)

    }
    error(message) {
        message = `${this.prefix} ${this.colorText("red", message)}`
        console.log(message)
    }
}
const log = new Logging()
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
var self
class Manager extends EventEmitter {
    constructor() {
        super()
        self = this
        self.id = "defined"
        this.defined = {}
        this.pass = false
    }
    setDefinedID(id) {
        this.id = id
    }
    appReady(callback) {
        this.on('app-ready', () => {
            log.info("Succesfully loaded in: $f" +  ((process.hrtime(startTime)[0] * 1000) + (process.hrtime(startTime)[1] / 1000000)).toFixed(3) + "ms")
            callback(log)
        });
    }
    addDefined(section, path, allowRequire, customRegisters) {
        section = section.toLowerCase()
        if (self.defined[section] == null) {
            self.defined[section] = {}
            self.defined[section].__customRegisters = customRegisters
            let root = require("path").join(__dirname, path)
            let apis = getPackages(root)
            for (let file in apis) {
                let f = apis[file]
                define(function (require, exports, module) {
                    f = f.replace(/\\/g, "/");            
                    let json = require(f)
                    if (json.name && json.version) {
                        if (!self.defined[section][json.name]) {
                            self.defined[section][json.name] = {}
                            self.defined[section][json.name].package = json
                            self.defined[section][json.name].registered = false
                            self.defined[section][json.name].services = {}
                            log.log("$DNEW MODULE: " + json.name)
                            let dir = splitAt(f.lastIndexOf("/"))(f)[0]
                            if (json.main) {

                                let main = dir + "/" + json.main
                            
                                require('fs').readFile(main, 'utf8', (err, data) => {
                                    if (err) { console.log("[Defined] Cannot load " + json.main + "!") }
                                    self.run(data, section, json.name, allowRequire)
                                });
                            } else {
                                console.log("[Loader] Has no 'main' file?")
                            }
                        }
                    }

                });
                
            }
            return self.defined[section]
        }
    }
    run(code, section, name, allowRequire) {
        let customConsole = {
            log: (message) => {
                log.log(`[${section.toUpperCase()}][${name.toUpperCase()}] ${log.setColors(`$f${message}`)}`)
            },
            info: (message) => {
                log.info(`[${section.toUpperCase()}][${name.toUpperCase()}] ${log.setColors(`$3${message}`)}`)
            },
            error: (message) => {
                log.error(`[${section.toUpperCase()}][${name.toUpperCase()}] ${log.setColors(`$4${message}`)}`)
            }
        }
        let customRequire = (module) => { customConsole.error(`REQURING of '${module}' is not allowed`) }
        if (allowRequire) {
            customRequire = require
        }
        var indexedDB = null;
        var location = null;
        var navigator = null;
        var onerror = null;
        var onmessage = null;
        var performance = null;
        var self = null;
        var webkitIndexedDB = null;
        var postMessage = null;
        var close = null;
        var openDatabase = null;
        var openDatabaseSync = null;
        var webkitRequestFileSystem = null;
        var webkitRequestFileSystemSync = null;
        var webkitResolveLocalFileSystemSyncURL = null;
        var webkitResolveLocalFileSystemURL = null;
        var addEventListener = null;
        var dispatchEvent = null;
        var removeEventListener = null;
        var dump = null;
        var onoffline = null;
        var ononline = null;
        var importScripts = null;
        var application = null;
        let global = null
        let process = null
        let exports = null
        let __dirname = null
        let __filename = null
        let run = null
        let defined = {
            register: (id, services) => {
                this.defined[section][name].services = services
                this.defined[section][name].registered = true
              
                this.checkMounting()
            },
            onCustomMount: (callback) => {
                this.on('mount-custom', () => {
                    let data = this.getCustomServices(section, name)
                    callback(data)
                });
            },
            onMount: (callback) => {
                const nameFunction = function (fn, name) {
                    return Object.defineProperty(fn, 'name', {value: name, configurable: true});
                  };
                this.on('mount-imports', () => {
                    let data = this.getGlobalServices(section, name)
                    callback = nameFunction(callback, name)
                    callback(data)
                });
            },
            getPackage: () => {
                return this.defined[id][name].package
            }
        }
        let id = this.id
        let newCode = `module.exports = function(require, console, ${id}, log) { ${code} }`;
        self = null
        let launchCode = eval(newCode);

        launchCode(customRequire, customConsole, defined, null);
    }
    checkMounting() {
        let pass = true
        for (let section in this.defined) {
            for (let mod in this.defined[section]) {
                try {
                    if (this.defined[section][mod].registered == false) {
                        pass = false
                    }
                } catch (e) {}
            }
        }
        if (pass && !this.pass) {
            this.pass = true
            this.emit('mount-imports');
            this.emit('mount-custom');
            this.emit('app-ready')
        }
    }
    getGlobalServices(section, name) {
        if (this.defined[section][name].package.consumes) {
            let consumes = this.defined[section][name].package.consumes
            let imports = {}
            for (let value in consumes) {
                let mod = consumes[value].split(":")
                let _section = mod[0]
                let _name = mod[1]
                if (this.defined[_section]) {
                    imports[_section] = {}
                    if (this.defined[_section][_name]) {
                        imports[_section][_name] = this.defined[_section][_name].services.GLOBAL
                    }
                }
            }
            return imports
        }
        return null
    }
    getCustomServices(section, name) {
        if (this.defined[section][name].package.consumes) {
            let customImports = {}
            let customRegisters = this.defined[section].__customRegisters
            for (let _section in this.defined) {
                customImports[_section] = {}
                for (let _name in this.defined[_section]) {
                    if (_name != "__customRegisters") {
                        customImports[_section][_name] = {}
                        for (let register in customRegisters) {
                            let id = customRegisters[register]
                            try {
                                customImports[_section][_name][id] = this.defined[_section][_name].services[id]
                            } catch (e) {
                                console.log("[DML] Doesn't Support Custom Register (" + _section + ":" + _name + ")")
                            }
                        }
                    }

                }
            }
            return customImports
        }
        return null
    }
}

let m = new Manager()

function PluginManager() {}
PluginManager.prototype.addDefined = function (id, path, allowRequire = null, customRegisters) {return m.addDefined.call(this, id, path, allowRequire, customRegisters);}
PluginManager.prototype.onAppReady = function (callback) {m.appReady(callback)}
PluginManager.prototype.mountAll = function () {m.checkMounting()}
PluginManager.prototype.setDefinedID = function (id) {m.setDefinedID(id)}
exports.PluginManager = PluginManager;
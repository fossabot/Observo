/** Defined 
 *  An API and plugin loading system designed for requireless projects
 *  
 *  
 */

require("amd-loader");
var { transform } = require("babel-core");
var EventEmitter = require('events').EventEmitter;
var React = require('react')
class Logging {
    constructor() {
        this.chrome = false
        this.prefix = ` ${this.colorText("magenta", "DML")} |`
    }
    colorText(color, text) {
        return text;
        switch (color) {
            case 'black':
                text = '\x1B[30m' + text; break;
            case 'red':
                text = '\x1B[31m' + text; break;
            case 'green':
                text = '\x1B[32m' + text; break;
            case 'yellow':
                text = '\x1B[33m' + text; break;
            case 'blue':
                text = '\x1B[34m' + text; break;
            case 'magenta':
                text = '\x1B[35m' + text; break;
            case 'cyan':
                text = '\x1B[36m' + text; break;
            case 'white':
                text = '\x1B[37m' + text; break;
            default:
                text = color + text; break;
        }
        return text + '\x1B[39m' + '\x1b[0m';

    };
    log(message, color = "green") {
        message = `${this.prefix} ${this.colorText(color, message)}`
        console.log(message)
    }
    info(message) {
        message = `${this.prefix} ${this.colorText("cyan", message)}`
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




// Single Instance Manager

var self
class Manager extends EventEmitter {
    constructor() {
        super()
        self = this
        self.id = "Observo"
        this.defined = {}
        this.pass = false
    }
    appReady(callback) {
        this.on('app-ready', () => {
            callback()
        });
    }
    addDefined(section, path, allowRequire, customRegisters) {
        section = section.toLowerCase()
        if (self.defined[section] == null) {
            let json = {}
            self.defined[section] = {}
            self.defined[section].__customRegisters = customRegisters

            let root = require("path").join(__dirname, path)
            let apis = getPackages(root)
            for (let file in apis) {
                let f = apis[file]
                define(function (require, exports, module) {
                    f = f.replace(/\\/g, "/");
                    console.log(f)
                    json = require(f)


                    if (json.name && json.version) {
                        if (!self.defined[section][json.name]) {
                            self.defined[section][json.name] = {}
                            self.defined[section][json.name].package = json
                            self.defined[section][json.name].registered = false
                            self.defined[section][json.name].services = {}
                            log.log("NEW MODULE: " + json.name)
                            let dir = splitAt(f.lastIndexOf("/"))(f)[0]
                            if (json.main) {

                                let main = dir + "/" + json.main
                                console.log(main)
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
                log.log(`[${section.toUpperCase()}][${name.toUpperCase()}] ${log.colorText("white", message)}`)
            },
            info: (message) => {
                log.info(`[${section.toUpperCase()}][${name.toUpperCase()}] ${log.colorText("white", message)}`)
            },
            error: (message) => {
                log.error(`[${section.toUpperCase()}][${name.toUpperCase()}] ${log.colorText("white", message)}`)
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
                this.on('mount-imports', () => {
                    let data = this.getGlobalServices(section, name)
                    callback(data)
                });
            },
            getPackage: () => {
                return this.defined[id][name].package
            }
        }
        let id = this.id
        let newCode = `module.exports = function(require, console, ${id}, log, React) { ${code} }`;
        self = null
        newCode = transform(newCode, {
            "presets": ["env", "react"],
            "plugins": ["transform-react-jsx"]
        }).code
        let launchCode = eval(newCode);

        /**
         * Calls code through eval(code)
         */
        launchCode(customRequire, console, defined, null, React);
    }
    checkMounting() {
        let pass = true
        //console.log(JSON.stringify(this))
        for (let section in this.defined) {
            for (let mod in this.defined[section]) {
                if (this.defined[section][mod].registered == false) {
                    pass = false
                }
            }
        }
        if (pass && !this.pass) {
            this.pass = true
            log.log("MOUNTING MODULES")
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
                        imports[_section][_name] = this.defined[_section][_name].services.global
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

function PluginManager() {

}

PluginManager.prototype.addDefined = function (id, path, allowRequire = null, customRegisters) {
    return m.addDefined.call(this, id, path, allowRequire, customRegisters);
}
PluginManager.prototype.appReady = function (callback) {
    m.appReady(callback)
}

exports.PluginManager = PluginManager;
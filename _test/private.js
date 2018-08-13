function Import (foo) {
    this.imports = {};
    this.imports.fs = require("fs")
    this.imports.path = null
}


function privateImport (path) {
    return this.imports[path];
}

Import.prototype.require = function (path) {
    return privateImport.call(this, path);
}

exports.Import = Import;
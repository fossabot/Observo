

var mysql = require("mysql")
const uuidv4 = require('uuid/v4'); //Random
const md5 = require("md5")
const connect = (database = null) => {
    let data //Makes the variable here
    if (database != null) { //If no database is specified, it connects a default
        data = {
            host: "127.0.0.1",
            user: "root",
            password: "",
            database: database
        }
    } else {
        data = {
            host: "127.0.0.1",
            user: "root",
            password: ""
        }
    }
    //Make the connection
    var con = mysql.createConnection(data);
    //Connect
    con.connect(function (err) {
        if (err) throw err; //If error occurs, it with throw it
    });
    return con //Retsurn that connection to whatever is calling it
}

let mainSQL = connect("data")
console.log("Connecting to Main DB")
//Plugin is ready to be used
Observo.onCustomMount((imports) => {
    console.log("Loaded Databases")
    var sql = "CREATE TABLE IF NOT EXISTS `users` ( `id` int(11) NOT NULL AUTO_INCREMENT,`uuid` varchar(100) NOT NULL,`sessionKey` varchar(100) NOT NULL,`authKey` varchar(100) NOT NULL,`username` varchar(100) NOT NULL,`password` varchar(100) NOT NULL,`role` int(11) NOT NULL,`permissions` text NOT NULL,`avatar` text NOT NULL,`color` varchar(6) NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1";
    //Lets query the SQL for the USERS table above
    mainSQL.query(sql, function (err, result) {
        if (err) throw err;
    });

    var sql = "CREATE TABLE IF NOT EXISTS `projects` (`id` int(11) NOT NULL AUTO_INCREMENT, `preset` text NOT NULL, `name` text NOT NULL,`user_uuid` varchar(100) NOT NULL,`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),`last_edited` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),`archived` tinyint(1) NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1"
    mainSQL.query(sql, function (err, result) {
        if (err) throw err;
    });
    let db = imports.api.database.API.getManager()
    console.log(JSON.stringify(db))
    db.isRole("MASTER", (response) => {
        if (!response) {
            db.addRole("MASTER", "red", () => {
                console.log("Added $4MASTER $frole")
            })
        }
    })
})

let handler = {}
class Database {
    constructor() {

    }
    isUser(username, callback) {
        mainSQL.query(`SELECT * FROM users WHERE (username="${username}")`, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(true)
            } else {
                callback(false)
            }
        });
    }
    isUserByID(uuid, callback) {
        mainSQL.query(`SELECT * FROM users WHERE (uuid="${uuid}")`, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(true)
            } else {
                callback(false)
            }
        });
    }
    /**
     * VailidateUser - Check a user based on given UUID and sessionKey
     * @param {UUID} uuid 
     * @param {UUID} sessionKey 
     * @param {Function} callback 
     */
    vailidateUser(uuid, sessionKey, callback) {
        console.log("VAILIDATING")
        mainSQL.query(`SELECT * FROM users WHERE (uuid="${uuid}" AND sessionKey="${sessionKey}")`, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(true)
            } else {
                callback(false)
            }
        });
    }
    /**
     * SignIn - Signs in a user by two ways:
     *  - Either a user can send over its USERNAME and PASSWORD (session key is added by the callback)
     *  - OR they can just give the authKey (if vaild), and that will return a new authKey
     * @param {String} username 
     * @param {String} password 
     * @param {UUID} sessionKey 
     * @param {Function} callback 
     * @param {UUID} authKey 
     */
    signIn(username, password, sessionKey, callback, authKey = null) {
        let me = this
        let output = null
        if (authKey != null) {
            mainSQL.query(`SELECT * FROM users WHERE (authKey="${authKey}")`, function (err, results, fields) {
                if (err) console.log(err)
                if (results.length > 0) {
                    me.updateSessionKey(sessionKey, results[0].uuid)
                    let authKey = me.newAuthKey(results[0].uuid)

                    let response = {}
                    response.authKey = authKey
                    response.uuid = results[0].uuid
                    callback(response)
                } else {
                    callback(null)
                }
            })
        } else {
            password = md5(password)
            mainSQL.query(`SELECT * FROM users WHERE (username="${username}") AND (password="${password}") `, function (err, results, fields) {
                if (err) console.log(err)
                if (results.length > 0) {
                    me.updateSessionKey(sessionKey, results[0].uuid)
                    let authKey = me.newAuthKey(results[0].uuid)

                    let response = {}
                    response.authKey = authKey
                    response.uuid = results[0].uuid
                    callback(response)
                } else {
                    callback(null)
                }
            })
        }
    }
    /**
     * AddUser - Adds a user to the database
     * @param {String} username 
     * @param {String} password 
     * @param {UUID} sessionKey 
     */
    addUser(username, password, sessionKey) {
        let uuid = uuidv4() //Get a UUID
        password = md5(password)
        let query = `INSERT INTO users (id, uuid, sessionKey, authKey, username, password, role, permissions, avatar, color) VALUES (NULL, '${uuid}', '${sessionKey}', '-', '${username}', '${password}', '0', '-', '-', 'black')`
        console.log(query)
        mainSQL.query(query, function (err, results, fields) {
            if (err) console.log(err)
        })
        let authKey = this.newAuthKey(uuid)
        return authKey
    }
    getUser(uuid, callback) {
        mainSQL.query(`SELECT * FROM users WHERE (uuid="${uuid}")`, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(results[0])
            } else {
                callback(null)
            }
        });
    }
    /**
     * UpdateSessionKey - Updates the sessionKey of a user based on the UUID
     * @param {UUID} sessionKey 
     * @param {UUID} uuid 
     */
    updateSessionKey(sessionKey, uuid) {
        let query = `UPDATE users SET sessionKey = '${sessionKey}' WHERE uuid = '${uuid}'`
        mainSQL.query(query, function (err, results, fields) {
            if (err) console.log(err)
        })
    }
    /**
     * NewAuthKey - Generates a brand new authKey for a user based on the UUID
     * @param {UUID} uuid 
     */
    newAuthKey(uuid) {
        let authKey = uuidv4();
        let query = `UPDATE users SET authKey = '${authKey}' WHERE uuid = '${uuid}'`
        mainSQL.query(query, function (err, results, fields) {
            if (err) console.log(err)
        })
        return authKey
    }
    /**
     * TODO: Redo Role System
     * @param {UUID} uuid 
     * @param {String} role 
     * @param {Function} callback 
     */
    hasRole(uuid, role, callback) {
        let authKey = uuidv4();
        let query = `SELECT * FROM users WHERE (uuid="${uuid}")`
        console.log(query)
        mainSQL.query(query, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                if (results[0].role >= role) {
                    callback(true)
                } else if (results[0].role == "-1") {
                    callback(true)
                } else {
                    callback(false)
                }
            } else {
                callback(false)
            }
        })
    }
    isRole(name, callback) {
        let query = `SELECT * FROM roles WHERE (name="${name}")`
       
        mainSQL.query(query, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(true)
            } else {
                callback(false)
            }
        })
    }
    addRole(name, color, callback) {
        let uuid = uuidv4();
        let query = `INSERT INTO roles (uuid, name, color, permissions) VALUES ('${uuid}', '${name}', '${color}', '{}')`
        mainSQL.query(query, function (err, results, fields) {
            if (err) console.log(err)
            callback()
        })
    }
    getRole(uuid, callback) {
        let query = `SELECT * FROM roles WHERE (uuid="${uuid}")`
        mainSQL.query(query, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(results[0])
            } else {
                callback(null)
            }
        })
    }
    /**
     * GetNameByUUID - Gets a users "name" based on the UUID
     * @param {UUID} uuid 
     * @param {Function} callback 
     */
    getNameByUUID(uuid, callback) {
        mainSQL.query(`SELECT * FROM users WHERE (uuid="${uuid}")`, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                console.print(results)
                callback(results[0].username)
            } else {
                callback(null)
            }
        })
    }

    /**
     *  PROJECT 
     */
    /**
     * addProject - Add a new project to the server, create a new database and a lot more!
     * 
     * @param {String} projectName 
     * @param {String} uuid 
     * @param {String} TODO: Plugins not preset 
     */
    addProject(projectName, uuid, preset, callback) {
        //Check first if this project name is avalable
        projectName = projectName.replace(/[^a-zA-Z ]/g, "")
        this.isProject(projectName, (state) => {
            if (!state) {
                let query = `INSERT INTO projects (preset, name, user_uuid, created, last_edited, archived) VALUES ('${preset}', '${projectName}', '${uuid}', CURRENT_TIME(), CURRENT_TIME(), '0')`
                console.log(query)
                mainSQL.query(query, function (err, results, fields) {
                    if (err) console.log(err)
                })
                let replaceAll = function (str, find, replace) {
                    return str.replace(new RegExp(find, 'g'), replace);
                }
                //Convert project name to database safe name, when its created
                let id = projectName.toLowerCase()
                id = id.replace(/[^a-zA-Z ]/g, "")

                //Create the new database for the project
                this.createDB(`_${id}`, () => {
                    callback(true)
                })
            } else {
                callback(false)
            }
        })
    }
    /**
     * ListProjects - Lists all projects on the SERVER
     * @param {Function} callback 
     */
    listProjects(callback) {
        let query = `SELECT * FROM projects`
        mainSQL.query(query, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(results)
            } else {
                callback(null)
            }
        })
    }
    isProject(projectName, callback) {
        let query = `SELECT * FROM projects WHERE (name="${projectName}")`
        mainSQL.query(query, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(true)
            } else {
                callback(false)
            }
        })
    }
}
let manager = new Database();
Observo.register(null, {
    GLOBAL: {
        load(projectName) {
            
        }
    },
    API: {
        getManager() {
            return manager;
        }
    }
})
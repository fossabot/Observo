

var mysql = require("mysql")


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
Observo.onMount((imports) => {
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

})

let handler = {}
class Database {
    constructor() {

    }
    isUser(username, callback) {
        mainsql.query(`SELECT * FROM users WHERE (username="${username}")`, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(true)
            } else {
                callback(false)
            }
        });
    }
    isUserByID(uuid, callback) {
        mainsql.query(`SELECT * FROM users WHERE (uuid="${uuid}")`, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(true)
            } else {
                callback(false)
            }
        });
    }
    vailidateUser(uuid, sessionKey, callback) {
        console.log("VAILIDATING")
        mainsql.query(`SELECT * FROM users WHERE (uuid="${uuid}" AND sessionKey="${sessionKey}")`, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(true)
            } else {
                callback(false)
            }
        });
    }
    signIn(username, password, sessionKey, callback, authKey = null) {
        let me = this
        let output = null
        if (authKey != null) {
            mainsql.query(`SELECT * FROM users WHERE (authKey="${authKey}")`, function (err, results, fields) {
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
            password = this.md5(password)
            mainsql.query(`SELECT * FROM users WHERE (username="${username}") AND (password="${password}") `, function (err, results, fields) {
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
    addUser(username, password, sessionKey) {
        let uuid = this.uuidv4() //Get a UUID
        password = this.md5(password)
        let query = `INSERT INTO users (id, uuid, sessionKey, authKey, username, password, role, permissions, avatar, color) VALUES (NULL, '${uuid}', '${sessionKey}', '-', '${username}', '${password}', '0', '-', '-', 'black')`
        console.log(query)
        mainsql.query(query, function (err, results, fields) {
            if (err) console.log(err)
        })
        let authKey = this.newAuthKey(uuid)
        return authKey
    }
    updateSessionKey(sessionKey, uuid) {
        let query = `UPDATE users SET sessionKey = '${sessionKey}' WHERE uuid = '${uuid}'`
        mainsql.query(query, function (err, results, fields) {
            if (err) console.log(err)
        })
    }
    newAuthKey(uuid) {
        let authKey = this.uuidv4();
        let query = `UPDATE users SET authKey = '${authKey}' WHERE uuid = '${uuid}'`
        mainsql.query(query, function (err, results, fields) {
            if (err) console.log(err)
        })
        return authKey
    }
    hasRole(uuid, role, callback) {
        let authKey = this.uuidv4();
        let query = `SELECT * FROM users WHERE (uuid="${uuid}")`
        console.log(query)
        mainsql.query(query, function (err, results, fields) {
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
    getNameByUUID(uuid, callback) {
        mainsql.query(`SELECT * FROM users WHERE (uuid="${uuid}")`, function (err, results, fields) {
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
     * @param {String} preset 
     */
    addProject(projectName, uuid, preset, callback) {
        //Check first if this project name is avalable
        projectName = projectName.replace(/[^a-zA-Z ]/g, "")
        this.isProject(projectName, (state) => {
            if (!state) {
                let query = `INSERT INTO projects (preset, name, user_uuid, created, last_edited, archived) VALUES ('${preset}', '${projectName}', '${uuid}', CURRENT_TIME(), CURRENT_TIME(), '0')`
                console.log(query)
                mainsql.query(query, function (err, results, fields) {
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

    listProjects(callback) {
        let query = `SELECT * FROM projects`
        mainsql.query(query, function (err, results, fields) {
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
        mainsql.query(query, function (err, results, fields) {
            if (err) console.log(err)
            if (results.length > 0) {
                callback(true)
            } else {
                callback(false)
            }
        })
    }
}
Observo.register(null, {
    GLOBAL: {
        load(projectName) {
            
        }
    },
    API: {
        
    }
})
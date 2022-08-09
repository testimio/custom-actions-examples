/**
 *  Postgres Query
 * 
 *      Execute a Postgres DB Query and return results
 * 
 *  Parameters
 *      query     (JS)  : Postgres query
 *      returnVariableName (JS) [Optional] : Name of return data variable.  
 *              Uses queryResults if not defined
 * 
 *      dbName    (JS)  : Target Database Name
 *      dbHost    (JS)  : Target Database Server
 * 
 *      sequelize (NPM) : sequelize@latest
 *      pg (NPM) : pg@latest
 * 
 *  Returns
 *      queryResults or returnVariableName if defined
 *      
 *      Return first row of results as individual test level variables with  names matching the associated column(s)
 * 			
 *		    For example, if the recordset contains data with the columns ["firstName", "lastName"], 
 *
 *          Two variables will be created: "firstName" and "lastName" with values that match the first set of data generated
 *				  firstName === queryResults[0].firstName 
 *			      lastName  === queryResults[0].lastName
 * 
 *  Notes
 * 
 *      npm i sequelize -g (If running in nodejs or eschewing step params of sequelize)
 *      npm i pg -g (If running in nodejs or eschewing step params of pg)
 *
 *  Base Step
 *      CLI Action
 * 
 */

var thequery = null; // "select * from address limit 10;";

var username = "postgres";
var userpassword = "wh4t3v3r4?";

var dbname = "dvdrental";
var host = "localhost";
var port = 5432;

/* Validate/set default parameters 
 */
if (typeof query !== 'undefined' && query != null)
    thequery = query;
if (typeof thequery === '' || thequery === null)
    throw new Error("query is undefined");

if (typeof dbName !== 'undefined' && dbName != null)
    dbname = dbName;
if (typeof dbname === '' || dbname === null)
    throw new Error("dbname is undefined");

if (typeof username === '' || username === null)
    throw new Error("username is undefined");

if (typeof userpassword === '' || userpassword === null)
    throw new Error("password is undefined");

if (typeof dbHost !== 'undefined' && dbHost != null)
    host = dbHost;
if (typeof host === '' || host === null)
    throw new Error("host is undefined");

function loadModules(moduleNames) {

    let modulesLoaded = [];
    function loadModule(moduleName) {
        let moduleNameVar = moduleName.replace(/\-/g, "_").replace(/\//g, "_");
        let _moduleNameVar = moduleName.replace(/\-/g, "_").replace(/\//g, "_");
        eval('try { ' + moduleNameVar + ' = (typeof ' + moduleNameVar + ' !== "undefined" && ' + moduleNameVar + ' !== null) ? ' + moduleNameVar + ' : require("' + moduleName + '"); if (moduleNameVar != null) modulesLoaded.push("' + moduleName + '"); } catch { console.log("Module: ' + moduleName + ' is not installed"); } ');
        if (modulesLoaded.includes(moduleName)) {
            console.log("Module " + moduleName + " is loaded as " + _moduleNameVar);
        }
    }

    moduleNames.forEach((moduleName) => {
        loadModule(moduleName);
    });

    console.log("Module " + modulesLoaded + " is loaded.");

}
loadModules(["sequelize", "pg"]);

/* if returnVariableName is defined then use it else use 'queryResults' as the return variable
 */
var return_variable_name = (typeof returnVariableName !== 'undefined' && returnVariableName !== null) ? returnVariableName : 'queryResults';

var exportsTest = (typeof exportsTest !== 'undefined') ? exportsTest : {};

const _sequelize = new sequelize(dbname, username, userpassword, {
    host: host,
    port: port,
    dialect: 'postgres',
    pool: {
        max: 9,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

return _sequelize

    .query(thequery, {
        type: sequelize.QueryTypes.SELECT,
    })
    .then(myTableRows => {

        const result = myTableRows && JSON.stringify(myTableRows);

        console.log("myTableRows", JSON.stringify(myTableRows));
        console.log("Query result", result);
        exportsTest[return_variable_name] = result;

        // Take an index and store generatedData[0]'s values as naked top level variables
        //
        let naked_variable_index = 0;
        if (myTableRows !== null && myTableRows.length > 0) {
            function storeFirstAsGlobalNakedVariables(value) {

                let variableName = value;
                let variableValue = myTableRows[naked_variable_index][variableName];

                exportsTest[variableName] = variableValue;
                console.log(variableName + " = " + variableValue);

            }
            Object.keys(myTableRows[naked_variable_index]).forEach(storeFirstAsGlobalNakedVariables);
        }

        if (!myTableRows) {
            return Promise.reject(new Error("Failed to find raw"));
        }
        else {
            return Promise.resolve();
        }

    });
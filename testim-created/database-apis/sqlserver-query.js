/**
 *  SQL Server - Query
 * 
 *      Execute a SQL Server Query and return results
 * 
 *  Parameters - Packages and JavaScript used in this example:
 * 
 * 	    sqlQuery (JS)      : 'select * from Users'
 * 
 *      returnVariableName (JS) [Optional] : Name of return data variable.  
 *              Uses queryResults if not defined
 * 
 * 	    connectionString (JS) [optional] : Either JSON or string connection configuration/string
 *              Examples: 
 *                      {server: "localhost",  user: "TestimSQL", password: "wh4t3v3r4!",  database: "TestData",  options: { enableArithAbort: true,trustServerCertificate: true, }}
 *				     or
 *                      "Server=localhost;Database=TestData;User Id=TestimSQL;Password=wh4t3v3r4!;Trusted_Connection=True; TrustServerCertificate=True;"
 *
 *      mssql  (npm)   : mssql@latest (not used if using trusted connections)
 * 
 *  Returns
 *      queryResults or returnVariableName if defined
 * 
 *      Automatically created variables created from the first row of values in the recordset where each variable name equals a column name
 * 			
 *		    For example, if the recordset contains data with the columns ["firstName", "lastName"], 
 *
 *          Two variables will be created: "firstName" and "lastName" with values that match the first set of data generated
 *				  firstName === queryResults[0].firstName 
 *			      lastName  === queryResults[0].lastName
 *
 *  Notes
 *      https://bertwagner.com/posts/converting-json-to-sql-server-create-table-statements/
 *      https://www.pauric.blog/How-To-Import-JSON-To-SQL-Server/#5-save-the-rowsets-into-a-table
 *
 *      mssql@latest Does not support trusted connections.  
 *          If trustedConnection use is desired, do not set username/password in connection config 
 *          and make sure that msnodesqlv8 is installed locally (npm i msnodesqlv8 -g)
 * 
 *  Version       Date          Author          Details
 *      1.5.0     11/28/2022    Barry Solomon   String/JSON connection string/config support
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      CLI Action
 */

// var connectionString = "Server=localhost;Database=TestData;User Id=TestimSQL;Password=wh4t3v3r4!;Trusted_Connection=True; TrustServerCertificate=True;"
// var sqlQuery = 'select * from Users where ID = 3';

var config = {
    // server: 'localhost',
    // user: 'TestimSQL',
    // password: 'wh4t3v3r4!',
    // database: 'TestData',
    options: {
        enableArithAbort: true,
        trustServerCertificate: true,
    }
}

var connection_string = config;
if (typeof connectionString !== 'undefined' && connectionString !== null)
    connection_string = connectionString;
    
if (typeof connection_string === 'undefined' || connection_string === null) {
    throw new Error("connectionString is undefined.  Please set connectionString and try again.  Connection string is in the format 'mssql://username:password@localhost/database'");
}

if (typeof sqlQuery === 'undefined' || sqlQuery === null) {
    throw new Error("sqlQuery is undefined.  Please set sqlQuery and try again.");
}

/* if returnVariableName is defined then use it else use 'queryResults' as the return variable
 */
var return_variable_name = (typeof returnVariableName !== 'undefined' && returnVariableName !== null) ? returnVariableName : 'queryResults';

const { exec } = require("child_process");
if (exec === undefined) {
    console.log("ERROR: child_process not loaded")
}

function loadInstallModules(moduleNames) {

    let modulesLoaded = [];
    function loadModule(moduleName, resolve, reject) {

        return new Promise(() => {

            let moduleNameVar = moduleName.replace(/\-/g, "_");
            eval('try { ' + moduleNameVar + ' = (typeof ' + moduleNameVar + ' !== "undefined" && ' + moduleNameVar + ' !== null) ? ' + moduleNameVar + ' : require("' + moduleName + '"); if (moduleNameVar != null) modulesLoaded.push("' + moduleName + '"); } catch { console.log("Module: ' + moduleName + ' is not installed"); } ');

            if (!modulesLoaded.includes(moduleName)) {

                let command = "npm i " + moduleName;
                console.log("Run command: " + command);

                exec(command, (error, stdout, stderr) => {

                    console.log("exec " + command);

                    if (error) {
                        console.log(`  error: ${error.message}`);
                        reject(`error: ${error.message}`);
                    }
                    if (stderr) {
                        console.log(`  stderr: ${stderr}`);
                        reject(`  stderr: ${stderr}`);
                    }

                    eval('try { ' + moduleNameVar + ' = (typeof ' + moduleNameVar + ' !== "undefined" && ' + moduleNameVar + ' !== null) ? ' + moduleNameVar + ' : require("' + moduleName + '"); if (moduleNameVar != null) modulesLoaded.push("' + moduleName + '"); } catch { console.log("Module: ' + moduleName + ' is not installed"); } ');

                    console.log(`stdout: ${stdout}`);
                    resolve(`stdout: ${stdout}`);

                })

            }
            else {

                console.log("Module " + moduleName + " is loaded.")
                resolve();

            }

        });

    }

    var promises = [];
    moduleNames.forEach((moduleName) => {
        promises.push(new Promise((resolve, reject) => { loadModule(moduleName, resolve, reject); }));
    });

    return new Promise((resolve, reject) => {

        Promise.all(promises)
            .then(() => {
                console.log("Modules Loaded");
                resolve();
            });

    })

}

return new Promise((tresolve, treject) => {

    console.log('\n====================================================');
    console.log("Start loadInstallModules");
    console.log('----------------------------------------------------');

    var modules = (typeof connection_string.user !== 'undefined' && typeof connection_string.password !== 'undefined') ? ["mssql"] : ["msnodesqlv8"];

    if (typeof connectionString !== 'undefined' && connectionString !== null) {
        modules = ["mssql"];
    }

    loadInstallModules(modules)

        .then(() => {

            return new Promise((resolve, reject) => {

                let commands = ['node -v', 'npm -v'];
                commands.forEach(command => {

                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`${command} ==> error: ${error.message}`);
                        }
                        if (stderr) {
                            console.log(`${command} ==> stderr: ${stderr}`);
                        }
                        console.log(`${command} ==> stdout: ${stdout}`);

                        if (command == commands[commands.length - 1])
                            resolve();
                    })

                })

            })

        })

        .then(() => {

            var sql = undefined;
            if (typeof mssql !== 'undefined')
                sql = mssql;
            else if (typeof msnodesqlv8 !== 'undefined')
                sql = msnodesqlv8;
            if (sql === undefined)
                throw new Error("Error loading modules: " + modules);

            sql.connect(connection_string).then(() => {

                console.log('====================================================');
                console.log("sqlQuery", sqlQuery);
                console.log('----------------------------------------------------');

                return sql.query(sqlQuery)

            }).then(result => {

                if (typeof result?.recordset !== 'undefined' && result?.recordset !== null) {

                    console.log(return_variable_name, result?.recordset);
                    console.log('----------------------------------------------------');

                    if (typeof exportsTest !== 'undefined')
                        exportsTest[return_variable_name] = result?.recordset;

                    // Take an index and store generatedData[0]'s values as naked top level variables
                    //
                    let naked_variable_index = 0;
                    function storeFirstAsGlobalNakedVariables(value) {

                        let variableName = value;
                        let variableValue = result.recordset[naked_variable_index][variableName];

                        if (typeof exportsTest !== 'undefined')
                            exportsTest[variableName] = variableValue;
                        console.log(variableName + " = " + variableValue);

                    }
                    Object.keys(result.recordset[naked_variable_index]).forEach(storeFirstAsGlobalNakedVariables);

                }

                tresolve();

            })
                .catch(err => {

                    treject(err.message);

                })

        });

});

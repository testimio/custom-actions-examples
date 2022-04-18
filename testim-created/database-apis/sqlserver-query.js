/**
 *  SQL Server - Query
 * 
 *      Execute a SQL Server Query and return results
 * 
 *  Parameters - Packages and JavaScript used in this example:
 * 	    sqlQuery (JS)      : 'select * from Users'
 *      returnVariableName (JS) [Optional] : Name of return data variable.  
 *              Uses queryResults if not defined
 * 	    connectionString (JS) [optional] : 'mssql://TestimSQL:wh4t3v3r4!@AuggieTheDoggie/TestData'
 *				You can also use config instead of connectionString
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
 *				    firstName === queryResults[0].firstName 
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
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      CLI Action
 */

let verbose = false;

var config = {
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    user: 'TestimSQL',
    password: 'wh4t3v3r4!',
    database: 'TestData',
    options: {
        enableArithAbort: true,
        trustServerCertificate: true,
    }
}

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

var sql = null;
if (typeof config.user !== 'undefined' && typeof config.password !== 'undefined') {
    loadModules(["mssql"]);
    sql = mssql;
}
else {
    loadModules(["msnodesqlv8"]);
    sql = msnodesqlv8;
    config.options['trustedConnection'] = true;
}

if (typeof connectionString === 'undefined' || connectionString === null) {
    connectionString = config;
}

if (typeof connectionString === 'undefined' || connectionString === null) {
    throw new Error("connectionString is undefined.  Please set connectionString and try again.  Connection string is in the format 'mssql://username:password@localhost/database'");
}

if (typeof sqlQuery === 'undefined' || sqlQuery === null) {
    throw new Error("sqlQuery is undefined.  Please set sqlQuery and try again.");
}

/* if returnVariableName is defined then use it else use 'queryResults' as the return variable
 */
var return_variable_name = (typeof returnVariableName !== 'undefined' && returnVariableName !== null) ? returnVariableName : 'queryResults';

return new Promise((resolve, reject) => {

    sql.connect(connectionString).then(() => {

        console.log("sqlQuery", sqlQuery);

        return sql.query(sqlQuery)

    }).then(result => {

        if (typeof result?.recordset !== 'undefined' && result?.recordset !== null) {

            exportsTest[return_variable_name] = result?.recordset;
            console.log(return_variable_name, exportsTest[return_variable_name]);

            // Take an index and store generatedData[0]'s values as naked top level variables
            //
            let naked_variable_index = 0;
            function storeFirstAsGlobalNakedVariables(value) {

                let variableName = value;
                let variableValue = result.recordset[naked_variable_index][variableName];

                exportsTest[variableName] = variableValue;
                console.log(variableName + " = " + variableValue);

            }
            Object.keys(result.recordset[naked_variable_index]).forEach(storeFirstAsGlobalNakedVariables);

        }

        resolve();

    }).catch(err => {

        reject(err.message);

    })

});

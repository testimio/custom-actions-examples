/**
 *  SQL Server - Results Validate
 * 
 *      Execute a SQL Server Query, validate and return results
 * 
 *  Parameters - Packages and JavaScript used in this example:
 * 	    sqlQuery (JS)      : 'select * from Users'
 *      expectedValues (JS) : expected cell values in the following format:
 * 
 *                              [{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                              ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                              ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                              ]
 * 
 *                            or for more advanced options
 * 
 *                              {
 *                               "options": {
 *                                   "PK": null,
 *                                   "matchType": "exact"
 *                               },
 *                               "expectedValues": [{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                                                  ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                                                  ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                                                 ]
 *                              }
 *     
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
 * 
 *      When run without expectedValues being set the step will pass and simply return the actual values
 *          The data will be in the clipboard and the variable actualItems (or returnVariableName if specified)
 *      If you set PK then validation of that entry will be row specific by PK
 *
 *      mssql@latest Does not support trusted connections.  
 *          If trustedConnection use is desired, do not set username/password in connection config 
 *          and make sure that msnodesqlv8 is installed locally (npm i msnodesqlv8 -g)
 * 
 *  Base Step
 *      CLI Action
 */

let verbose = true;

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

/* Convenience functions used for matching
 */
const stringMatch = {};
stringMatch['exact'] = function (str1, str2) { return (str1 === str2); };
stringMatch['startswith'] = function (str1, str2) { return str1.startsWith(str2); };
stringMatch['endswith'] = function (str1, str2) { return str1.endsWith(str2); };
stringMatch['includes'] = function (str1, str2) { return str1.includes(str2); };
stringMatch['contains'] = function (str1, str2) { return str1.includes(str2); };

// Validate
//
function validateDataSet(actualValues, options, expectedValues) {

    if (verbose)
        console.log("validateItems called");

    let result = true;
    let expected_values;
    let actual_values;
    let row_differences;
    let differences = [];

    let pk = null;
    let matchtype = "exact";
    if (typeof options !== 'undefined' && options !== null) {
        pk = options["PK"];
        matchtype = options["matchType"];
    }

    for (let evid = 0; evid < expectedValues.length; evid++) {

        expected_values = expectedValues[evid];

        let row_id = Object.keys(expected_values).includes("index") ? expected_values["index"] : evid;
        actual_values = (actualValues[row_id] !== null) ? actualValues[row_id] : "";

        /* if PK is defined then use it to find the target row for comparison
         */
        if (pk != null) {
            let target_row = actualValues.find(row => row[pk] === expected_values[pk]);
            actual_values = target_row;
        }

        row_differences = {};

        if (typeof expected_values === 'string' && typeof actual_values === 'string') {

            if (!stringMatch[matchtype](actual_values, expected_values)) {
                row_differences[evid] = { "row": evid, "Actual": actual_values, "Expected": expected_values, "MatchType": matchtype };
                if (result)
                    result = false;
            }

        }
        else {

            if (typeof actual_values === 'undefined' || actual_values === null) {
                console.warn("    MISMATCH:: Expected: [" + JSON.stringify(expected_values) + "], \nActual: UNDEFINED, MatchType: [" + matchtype + "]");
                row_differences[evid] = { "row": row_id, "Actual": "undefined", "Expected": expected_values };
                continue;
            }

            for (let key in expected_values) {

                if (key === 'index')
                    continue;

                if (verbose)
                    console.log("Validate " + key + "Expected: [" + expected_values[key] + "], Actual:[" + actual_values[key] + "], MatchType: [" + matchtype + "]");

                if (Object.keys(actual_values).includes(key)) {

                    if (!stringMatch[matchtype](actual_values[key].toString(), expected_values[key].toString())) {

                        row_differences[key] = { "row": row_id, "Actual": actual_values[key], "Expected": expected_values[key], "MatchType": matchtype };
                        if (result)
                            result = false;
                        if (verbose)
                            console.log("    MISMATCH:: " + key + " => \nExpected: [" + expected_values[key] + "], \nActual: [" + actual_values[key] + "], \MatchType: [" + matchtype + "]");
                    }
                }
            }
        }
        if (Object.keys(row_differences).length > 0)
            differences.push(row_differences);
    }

    // If failed, echo to console and report an error
    //
    if (!result) {
        if (verbose) {
            console.log("expected_values", JSON.stringify(expectedValues));
            console.log("actual_values", JSON.stringify(actualValues));
        }
        console.log("SQL Server - Results Validate: ", JSON.stringify(differences, null, 2));
        throw new Error("SQL Server - Results Validate\n" + JSON.stringify(differences, null, 2));
    }

    return result;
}

return new Promise((resolve, reject) => {

    sql.connect(connectionString).then(() => {

        return sql.query(sqlQuery)

    }).then(result => {

        let actual_results = result?.recordset;

        exportsTest[return_variable_name] = actual_results;
        console.log(return_variable_name, JSON.stringify(actual_results, null, 2));

        if (result?.recordset !== null) {

            let expected_results = {};
            expected_results["options"] = { "PK": null, "matchType": "exact" };
            expected_results["expectedValues"] = actual_results;
            exportsTest['expectedResults'] = expected_results;
            console.log('expectedResults', JSON.stringify(expected_results, null, 2));

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

        if (typeof expectedValues !== 'undefined' && expectedValues !== null) {
            let options = null;
            let expected_values = expectedValues;
            if (!Array.isArray(expectedValues)) {
                options = expectedValues["options"];
                expected_values = expectedValues["expectedValues"];
            }
            validateDataSet(actual_results, options, expected_values);
        }

        resolve();

    }).catch(err => {

        reject(err.message);

    })

});
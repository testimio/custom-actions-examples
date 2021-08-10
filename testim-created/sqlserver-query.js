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
 *      sql  (npm)   : mssql@latest
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
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      CLI Action
 * 
 *  Installation
 *      Create a new "CLI action" step
 *      Name it "SQL Server Query"
 *      Create parameters
 *          sqlQuery (JS) 
 *          returnVariableName (JS) 
 *          connectionString (JS)
 *          sql (NPM) and set its value = mssql @ latest 
 *      Set the new custom action's function body to this javascript
 *      Set connection information
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */

 let verbose = true;

 const config = {
     user: 'TestimSQL',
     password: 'wh4t3v3r4!',
     server: 'AuggieTheDoggie', // You can use 'localhost\\instance' to connect to named instance
     database: 'TestData',
     options: {
         enableArithAbort: true,
         trustServerCertificate: true,
     }
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

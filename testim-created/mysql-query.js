/**
 *  MySQL Query
 * 
 *  Parameters
 *      query     (JS)  : MySQL query
 *      returnVariableName (JS) [Optional] : Name of return data variable.  
 *              Uses queryResults if not defined
 *      Sequelize (NPM) : sequelize@latest
 *      mysql2    (NPM) : mysql2@latest
 * 
 *  Returns
 *      queryResults or returnVariableName if defined
 *      
 *      Return first row of results as individual test level variables with  names matching the associated column(s)
 * 			
 *		    For example, if the recordset contains data with the columns ["firstName", "lastName"], 
 *
 *          Two variables will be created: "firstName" and "lastName" with values that match the first set of data generated
 *				    firstName === queryResults[0].firstName 
 *			      lastName  === queryResults[0].lastName
 *
 *  Base Step
 *      CLI Action
 * 
 *  Installation
 *      Create a new "CLI action" step
 *      Name it "MySQL Query"
 *      Create parameters
 *          query (JS) 
 *          returnVariableName (JS) 
 *          Sequelize (NPM) and set its value = sequelize @ latest 
 *          mysql2 (NPM) and set its value = mysql2 @ latest 
 *      Set the new custom action's function body to this javascript
 *      Set connection information
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */


 var dbName = "testdata";
 var userName = "barry";
 var password = "P@$$w0rdMS";
 var host = "localhost";
 var port = 3306;
 
 /* if returnVariableName is defined then use it else use 'queryResults' as the return variable
  */
 var return_variable_name = (typeof returnVariableName !== 'undefined' && returnVariableName !== null) ? returnVariableName : 'queryResults';
 
 const sequelize = new Sequelize(dbName, userName, password, {
     select: "mysql",
     dialect: 'mysql',
     host,
     port,
 });
 
 return sequelize
     .query(query, {
         type: Sequelize.QueryTypes.SELECT,
     })
     .then(myTableRows => {
 
         const result = myTableRows && JSON.stringify(myTableRows);
 
         console.log("myTableRows", JSON.stringify(myTableRows));
         console.log("Query result", result);
         exportsTest[return_variable_name] = result;
 
         // Take an index and store generatedData[0]'s values as naked top level variables
         //
         let naked_variable_index = 0;
         function storeFirstAsGlobalNakedVariables(value) {
 
             let variableName = value;
             let variableValue = myTableRows[naked_variable_index][variableName];
 
             exportsTest[variableName] = variableValue;
             console.log(variableName + " = " + variableValue);
 
         }
         Object.keys(myTableRows[naked_variable_index]).forEach(storeFirstAsGlobalNakedVariables);
 
         if (!myTableRows) {
             return Promise.reject(new Error("Failed to find raw"));
         }
     });
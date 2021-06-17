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

 var dbName   = "testdata";
 var userName = "barry";
 var password = "P@$$w0rdMS";
 var host     = "localhost";
 var port     = 3306;
 
 /* if returnVariableName is defined then use it else use 'queryResults' as the return variable
  */
 var return_variable_name = (typeof returnVariableName !== 'undefined' && returnVariableName !== null) ? returnVariableName : 'queryResults';
 
 const sequelize = new Sequelize(dbName, userName, password, {
     select:  "mysql",
     dialect: 'mysql',
     host,
     port,
 });
 
 return sequelize
   .query(query, {
     plain: true,
     raw: true,
     type: Sequelize.QueryTypes.SELECT,
   })
   .then(myTableRows => {
 
     const result = myTableRows && JSON.stringify(myTableRows);
 
     console.log("Query result", result);
     exportsTest[return_variable_name] = result;
     
     if (!myTableRows) {
       return Promise.reject(new Error("Failed to find raw"));
     }
   });
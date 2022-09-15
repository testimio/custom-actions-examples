/**
 *  Oracle Query
 * 
 *      Execute an Oracale DB Query and return results
 * 
 *  Parameters
 * 
 *      query     (JS)  : Oracale query
 * 
 *      returnVariableName (JS) [Optional] : Name of return data variable.  
 *              Uses queryResults if not defined
 * 
 *      dbName    (JS)  : Target Database Name
 *      dbHost    (JS)  : Target Database Server. Default (localhost)
 *      dbPort    (JS)  : Target Database Server Port.  Default (1521)
 * 
 *      dbUsername  (JS)  : Target Database user
 *      dbPassword  (JS)  : Target Database user password
 * 
 *      dbConnectionstring  (JS)  : Target Database connection string
 * 
 *      oracledb (NPM) : oracledb@latest 
 * 
 *  Returns
 * 
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
 *  Notes
 * 
 *      Inserts need to be committed
 * 
 *      npm i oracledb -g (If running in nodejs or eschewing NPM step params oracledb)
 *      npm i oracledb --save
 * 
 *      https://npmjs.com/package/oracledb
 *      https://oracle.github.io/node-oracledb/INSTALL.html 
 *
 *      If you need to install client libraries:
 *        https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html
 * 
 *  Base Step
 *      CLI Action
 * 
 *  Version       Date       Author          Details
 *      1.0.0     09/15/2022 Barry Solomon   Initial Version
 * 
 */

/* eslint-disable no-var */
/* eslint-disable camelcase */
/* eslint-disable valid-typeof */
/* globals returnVariableName, require, process, query, dbHost, dbPort, dbName, dbUsername, dbConnectionstring */

// var query = 'SELECT * FROM TESTDATA';

const DEFAULT_USERNAME = "system";
const DEFAULT_PASSWORD = null;
const DEFAULT_DBNAME   = "XE";
const DEFAULT_HOST     = "localhost";
const DEFAULT_PORT     = 1521;

/* Validate/set default parameters 
 */

var thequery = null;
if (typeof query !== 'undefined' && query != null)
  thequery = query;
if (typeof thequery === '' || thequery === null)
  throw new Error("query is undefined");

var db_username = process.env.NODE_ORACLEDB_USER || DEFAULT_USERNAME;
if (typeof dbUsername !== 'undefined' && dbUsername != null)
  db_username = dbUsername;
if (typeof username === '' || db_username === null)
  throw new Error("dbUsername is undefined");

// Get the password from the environment variable
// NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
// string (not recommended), or it could be prompted for.
// Alternatively use External Authentication so that no password is
// needed.
//
var db_password = process.env.NODE_ORACLEDB_PASSWORD || DEFAULT_PASSWORD;
if (typeof dbPassword !== 'undefined' && dbPassword != null)
  db_password = dbPassword;
if (typeof db_password === '' || db_password === null)
  throw new Error("dbPassword is undefined");

// Setting externalAuth is optional.  It defaults to false.  See:
// https://oracle.github.io/node-oracledb/doc/api.html#extauth
var external_auth = process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false;

var db_name = DEFAULT_DBNAME;
if (typeof dbName !== 'undefined' && dbName != null)
  db_name = dbName;
if (typeof db_name === '' || db_name === null)
  throw new Error("dbName is undefined");

var db_host = DEFAULT_HOST;
if (typeof dbHost !== 'undefined' && dbHost != null)
  db_host = dbHost;
if (typeof db_host === '' || db_host === null)
  throw new Error("dbHost is undefined");

var db_port = DEFAULT_PORT;
if (typeof dbPort !== 'undefined' && dbPort != null)
  db_port = dbPort;
if (typeof db_port === '' || db_port === null)
  throw new Error("dbPort is undefined");

// For information on connection strings see:
// https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings
//
var connection_string = process.env.NODE_ORACLEDB_CONNECTIONSTRING || `${DEFAULT_HOST}:${DEFAULT_PORT}/${DEFAULT_DBNAME}`;
if (typeof dbConnectionstring !== 'undefined' && dbConnectionstring != null)
  connection_string = dbConnectionstring;

/* Return parameters
*/
var return_variable_name = 'queryResults';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
  return_variable_name = returnVariableName;

///const dbConfig = require('./dbconfig.js');
const dbConfig = {
  user: db_username,
  password: db_password,
  connectString: connection_string,
  externalAuth: external_auth
};

// On Windows and macOS, you can specify the directory containing the Oracle
// Client Libraries at runtime, or before Node.js starts.  On other platforms
// the system library search path must always be set before Node.js is started.
// See the node-oracledb installation documentation.
// If the search path is not correct, you will get a DPI-1047 error.
// // // let libPath;
// // // if (process.platform === 'win32') {           // Windows
// // //   libPath = 'C:\\oracle\\instantclient_19_12';
// // // } else if (process.platform === 'darwin') {   // macOS
// // //   libPath = process.env.HOME + '/Downloads/instantclient_19_8';
// // // }
// // // if (libPath && fs.existsSync(libPath)) {
// // //   oracledb.initOracleClient({ libDir: libPath });
// // // }

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
loadModules(["oracledb"]);
// const oracledb = require('oracledb');

// This example uses Node 8's async/await syntax.
let connection;
// For a complete list of options see the documentation.
var options = {
  autoCommit: true,
  // batchErrors: true,  // continue processing even if there are data errors
  bindDefs: [
    { type: oracledb.NUMBER },
    { type: oracledb.STRING, maxSize: 20 }
  ]
};

return new Promise((resolve, reject) => {

  (async function () {

    try {

      connection = await oracledb.getConnection(dbConfig);

      console.log("Successfully connected to Oracle!");

      /**** DROP ****
      
          await connection.execute(`drop TABLE TESTDATA `);
      
      /**** END DROP ****/

      /**** CREATE ****
      
          await connection.execute(`CREATE TABLE TESTDATA ("USERNAME" VARCHAR2(20 BYTE), 
          "PASSWORD" VARCHAR2(20 BYTE), 
          "EMAIL" VARCHAR2(20 BYTE), 
          "PHONE" VARCHAR2(20 BYTE))`);
      
      /**** END CREATE ****/

      /**** INSERT ****
  
      const sqlQuery = `INSERT INTO TESTDATA ("USERNAME", "PASSWORD", "EMAIL", "PHONE") VALUES (:1, :2, :3, :4)`;
  
      let binds = [["Aaron", "test001", "Aaron@email.com", "303-555-1111"],
      ["Nicole", "test002", "Nicole@email.com", "303-555-2222"],
      ["Barbara", "test003", "Barbara@email.com", "303-555-3333"]];
  
      let result = await connection.executeMany(sqlQuery, binds, {});
  
      console.log("Number of inserted rows:", result.rowsAffected);
  
      await connection.execute(
        `commit`,
        [],
        function (err, result) {
          if (err) {
            console.error(err.message);
            return;
          }
          console.log(result);
        });
  
      /**** END  INSERT ****/

      await connection.execute(

        `${thequery}`,
        [],
        function (err, result) {
          if (err) {
            console.error(err.message);
            return;
          }
          console.log(result.rows);

          if (typeof exportsTest !== 'undefined') {
            exportsTest[return_variable_name] = result.rows;
          }
          resolve();

        });

    } catch (err) {
      console.log("Error: ", err);
    } finally {
      if (connection) {
        try {
          await connection.close();
          resolve();
        } catch (err) {
          console.log("Error when closing the database connection: ", err);
          reject(err);
        }
      }
    }

  })()

});
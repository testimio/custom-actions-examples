/**
 *  Environment Variables Get
 * 
 *      Get process environment variables
 * 
 *  Parameters
 * 
 *      returnVariableName (JS) [Optional] : Name of return data variable.  
 * 
 *      expandVariables (JS) [optional] : Create top level variables based on environment variable key names. 
 * 
 *  Returns
 * 
 *      environmentVariables (or returnVariableName if specified) 
 * 
 *  Notes
 *       
 *       Env var variable names will have (). characters replaced with _
 * 
 *  Version       Date          Author          Details
 *      1.0.0     11/08/2022    Barry Solomon   Initial Version
 *  
 *  Disclaimer
 * 
 *      This Custom CLI Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 * 
 *      CLI Action 
 * 
 */

/* eslint-disable camelcase */
/* globals require, returnVariableName, expandVariables */

let return_variable_name = 'environmentVariables';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

let process = require("process");
console.log(`process.env = ${process.env}`)
exportsTest[return_variable_name] = JSON.parse(JSON.stringify(process.env));

/* Create variables from top root response body json key/value pairs */
if (typeof expandVariables !== 'undefined' && expandVariables === true) {
    try { let json = (typeof exportsTest[return_variable_name] === "string") ? JSON.parse(exportsTest[return_variable_name]) : exportsTest[return_variable_name]; Object.keys(json).forEach((key) => { console.log(`==> ${key} = ${json[key]}`); key = key.replace('(', '_').replace(')', '_').replace(' ', '_').replace('.', '_'); exportsTest[key] = json[key]; }) } catch (err) { console.log(err.message + ".  Auto variables not created"); }
}


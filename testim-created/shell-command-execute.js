/**
 * Shell Command Execute
 * 
 *      Runs a shell command and returns stdout
 * 
 * Parameters
 * 
 *      command (JS) - Command to run.  Ex "dir /w" or "<path_to_.bat_or_shell_command_file>"
 * 
 * Returns 
 * 
 *      stdout 
 * 
 * Notes
 * 
 *      Good reference for running commands in nodejs: https://stackabuse.com/executing-shell-commands-with-node-js/.  
 *
 * Disclaimer:
 *      This is an example I wrote and is presented 'AS-IS'.  It is not supported by Testim in any way, shape or form
 * 
 *  Installation
 *      Create a new "Custom CLI Action"
 *      Name it "Shell Command Execute"
 *      Create parameters
 *          command (JS)   
 *      Set the new custom cli action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */

/** For debugging in VSCode
   let command = "dir";
   exportsTest = {};
**/

const { exec } = require("child_process");

if (typeof command === 'undefined' || command === null)
    throw new Error("No command is defined");

return new Promise((resolve, reject) => {

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            reject(`error: ${error.message}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            reject(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);

        // Return stdout to Testim
        exportsTest.stdout = stdout;

        resolve(`stdout: ${stdout}`);
    });

});

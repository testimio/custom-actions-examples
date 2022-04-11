/**
 *  Python Program Execute
 * 
 *    Execute a Python program and return stdout, exit signal and exit code
 * 
 *  Parameters
 * 
 *    pythonFile (JS) : Path to Python file
 *                  Example: "C:\\Projects\\Testim\\Python//HelloWorld.py"
 * 
 *    pythonArgs (JS) : Commandline arguments   
 *                  Example: "Nicole"
 *                          ["Nicole", "Aaron", 4]
 * 
 *  Returns
 * 
 *      pythonStdOut, pythonExitSignal, pythonExitCode
 * 
 *  Notes
 * 
 *      https://www.freecodecamp.org/news/node-js-child-processes-everything-you-need-to-know-e69498fe970a/
 * 
 *      // "C:\\Projects\\Testim\\Python\\HelloWorld.py"
 *      HelloWorld.py contents:
            import sys
            print ("Hello Testim from CLI Executed Python Script")
            print ("Number of arguments:", len(sys.argv), "arguments.")
            print ("Argument List:", str(sys.argv))
 * 
 *  Base Step
 *      CLI Action
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 */

const { spawn } = require('child_process');

/* Validate pythonFile is defined
 */
if (typeof pythonFile === 'undefined' || pythonFile === null) {
  throw new Error("pythonFile is required");
}

/* Validate/normalize passed params
 */
var python_args = [pythonFile];
if (typeof pythonArgs !== 'undefined' && pythonArgs !== null) {
  if (typeof pythonArgs === 'object') {
    python_args.push([...pythonArgs]);
  }
  else {
    python_args.push(pythonArgs);
  }
}

return new Promise((resolve, reject) => {

  var executePython = function () {

    const child = spawn('python', python_args);

    child.stdout.on('data', (data) => {
      console.log(`child stdout:${typeof (data)}\n${data}`);
      if (typeof (exportsTest) !== 'undefined' && exportsTest !== null)
        exportsTest.pythonStdOut = data.toString();
    });

    child.stderr.on('data', (data) => {
      console.error(`child stderr:\n${data}`);
      reject(data.toString());
    });

    child.on('exit', function (code, signal) {

      console.log('child process exited with ' +
        `code ${code} and signal ${signal}`);

      // Parse code/signal to report back to Testim
      if (typeof (exportsTest) !== 'undefined' && exportsTest !== null) {
        exportsTest.pythonExitSignal = signal;
        exportsTest.pythonExitCode = code;
      }

      resolve();
    });

  }

  executePython();

});
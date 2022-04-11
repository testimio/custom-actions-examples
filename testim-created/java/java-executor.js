/**
 *  Java Executor 
 * 
 *      Execute a java method/function in a given jar file
 * 
 *  Parameters  
 * 
 *      jar (JS)   : Target jar file
 * 
 *      jarClassPath (JS)   : CLASSPATH referencing the package embedded jar files
 *              If jar parameter is not set, classpath to use
 *              Use : as separator (it will be converted if runned on Windows), or use a string array.
 *              Example: "java/myJar.jar:java/myOtherJar.jar"
 * 
 *      mainClass (JS)   : Main class to call, must be available from CLASSPATH,
 *              If classPath set, main class to call
 *              Example: "com.example.MyClass"
 * 
 *      rootPath (JS)    : Path to jar file
 *              If classPath elements are not relative to the current folder, you can define a root path.
 *              You may use __dirname if you classes / jars are in your module folder
 * 
 *      javaCaller (NPM) : java-caller@latest
 * 
 *  Notes
 * 
 *      https://www.npmjs.com/package/java-caller
 *      if you run this via CLI and not Testim's schedulre 
 *      npm i java-caller -g 
 * 
 * Disclaimer:
 * 
 *      This is an example I wrote and is presented 'AS-IS'.  It is not supported by Testim in any way, shape or form
 * 
 *  Installation
 *      Create a new "Custom CLI Action"
 *      Name it "Java Executor"
 *      Create parameters as outlined above
 *      Set the new custom cli action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 **/

 "use strict"

 let { exec } = require("child_process");
 let { JavaCaller } = (typeof javaCaller !== 'undefined' && javaCaller !== null) ? javaCaller : require("java-caller");
 
 let minimumJavaVersion = 10;
 
 const DEFAULT_ROOT_PATH = "C:\\Projects\\Testim\\JavaScript Examples\\custom-actions-examples\\testim-created\\java\\src\\";
 const DEFAULT_JAR_FILE = "HelloWorld.jar";
 const DEFAULT_JAR_CLASS_PATH = undefined; 
 const DEFAULT_MAIN_CLASS = undefined; //"bds.java.HelloWorld";
 
 let root_path = DEFAULT_ROOT_PATH;
 if (typeof rootPath !== 'undefined' && rootPath !== null)
     root_path = rootPath;
 if (typeof root_path === 'undefined' || root_path === null)
     throw new Error("rootPath must be defined");
 
 let jar_file = DEFAULT_JAR_FILE;
 if (typeof jarFile !== 'undefined' && jarFile !== null)
     jar_file = jarFile;
 
 let jar_class_path = DEFAULT_JAR_CLASS_PATH;
 if (typeof jarClassPath !== 'undefined' && jarClassPath !== null)
 jar_class_path = jarClassPath;
 
 if ((typeof jar_file === 'undefined' || jar_file === null) && (typeof class_path === 'undefined' || class_path === null))
     throw new Error("jarFile or classPath must be defined");
 
 let main_class = DEFAULT_MAIN_CLASS;
 if (typeof mainClass !== 'undefined' && mainClass !== null)
     main_class = mainClass;
 
 async function runJarClass() {
 
     const java = new JavaCaller({
         "rootPath": root_path,
         "jar": jar_file,
         "classPath": jar_class_path,   // CLASSPATH referencing the package embedded jar files
         "mainClass": main_class,     // Main class to call, must be available from CLASSPATH,
         "minimumJavaVersion": minimumJavaVersion
     });
     const { status, stdout, stderr } = await java.run(['-a', 'list', '--of', 'arguments']);
 
     exports.javaStatus = status;
     exports.javaStdout = stdout;
     exports.javaStderr = stderr;
 
     console.log(`The status code returned by java command is ${status}`);
     if (stdout) {
         console.log('\nstdout of the java command is :\n\n\t' + stdout);
     }
     if (stderr) {
         console.error('\nstderr of the java command is :\n\n\t' + stderr);
     }
 
     console.log("Now we can get back on the rest of our Testim testcase :)")
 }
 
 return new Promise((resolve, reject) => {
 
     // Run asynchronously to use the returned status for process.exit
     (async () => {
         try {
             await runJarClass();
             resolve();
         } catch (err) {
             console.error("Unexpected error: " + err.message + "\n" + err.stack);
             process.exitCode = 1;
             reject();
         }
     })();
 
 })
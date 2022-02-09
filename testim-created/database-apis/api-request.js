/**
 *  API Runner 
 * 
 *      Make an API call and return results to Testim
 * 
 *  Parameters
 * 
 *      url (JS) : Target Endpoint
 *      method (JS) : GET, POST
 *      headers (JS) [optional] 
 *      options (JS) [optional] 
 *      body (JS) 
 *      request (NPM) : NPM Package used to make actual call
 * 
 *  Notes
 * 
 *      If response body is a JSON object then variables for each root level node will be created as variables of the same name
 * 
 *      If the request npm package is installed on the computer that runs our CLI then using Testim (NPM) variable "request" is not required
 *  
 *      This code can also be run in VSCode by setting the url variable and running it.  Provide body, headers and options as needed.
 * 
 *      npm i request 
 * 
 **/

// var url = "http://demo.testim.io";

/* Validate required parameters
 */
if (typeof (url) === 'undefined' || url === null)
    throw new Error("url has not been specified.");

/* Default optional parameters
 */
eval('method  = (typeof method  !== "undefined" && method  !== null) ? method  : "GET" ');
eval('options = (typeof options !== "undefined" && options !== null) ? options : {} ');
eval('headers = (typeof headers !== "undefined" && headers !== null) ? headers : {} ');
eval('body    = (typeof body    !== "undefined" && body    !== null) ? body    : null ');

let verbose = true;

function loadModules(moduleNames) {

    let modulesLoaded = [];
    function loadModule(moduleName) {
        let moduleNameVar = moduleName.replace(/\-/g, "_");
        eval('try { ' + moduleNameVar + ' = (typeof ' + moduleNameVar + ' !== "undefined" && ' + moduleNameVar + ' !== null) ? ' + moduleNameVar + ' : require("' + moduleName + '"); if (moduleNameVar != null) modulesLoaded.push("' + moduleName + '"); } catch { console.log("Module: ' + moduleName + ' is not installed"); } ');
        if (modulesLoaded.includes(moduleName)) {
            console.log("Module " + moduleName + " is loaded.")
        }
    }

    moduleNames.forEach((moduleName) => {
        loadModule(moduleName);
    });

    console.log("Module " + modulesLoaded + " is loaded.");

}
loadModules(["request"]);

async function makeRequest(url, method, headers, body, gotOptions, resolve, reject) {

    if (typeof method === 'undefined' || method === null)
        method = "POST";
    if (typeof body === 'undefined' || body === null)
        body = "";

    // body if an object must be stringified
    if (typeof body === 'object')
        body = JSON.stringify(body);

    let options = {
        url: url
        , method: method
        , headers: headers
        , body: body
        , pretend: false
        , followAllRedirects: true
    };

    /* Override, append extra options defined by gotOptions
     */
    for (let key in gotOptions) {
        if (gotOptions.hasOwnProperty(key)) {
            if (verbose)
                console.log(key + " -> " + gotOptions[key]);
            options[key] = gotOptions[key]
        }
    }

    await request(options, function (err, response, responseBody) {

        if (typeof err !== 'undefined' && err !== null) {
            console.log(err);
            reject(err);
        }

        if (response?.statusCode != null && response?.statusCode != 200) {
            console.log("response.statusCode = ", response.statusCode, "response.statusMessage = ", response.statusMessage);
            if (typeof exportsTest !== 'undefined')
                exportsTest.response = response;
            reject("statusCode = " + response.statusCode + ", statusMessage = " + response.statusMessage + ", body = " + response.body);
        }

        console.log("response: ", JSON.stringify(response, null, 2));

        let response_statuscode = response?.statusCode;
        let response_body = undefined;
        try {
            response_body = JSON.parse(response?.body);
        }
        catch {
            response_body = response?.body;
        }

        resolve({ response_statuscode, response_body });

    });

}

return new Promise((resolve, reject) => {

    makeRequest(url, method, headers, body, options, resolve, reject);

})
    .then(response => {

        let response_body = response.response_body;
        let response_statuscode = response.response_statuscode;

        if (verbose)
            console.log(response_body);
        try { json = (typeof response_body === "string") ? JSON.parse(response_body) : response_body; Object.keys(json).forEach((key) => { console.log(`==> ${key} = ${json[key]}`); }) } catch (err) { console.log("Warning: " + err.message + ".  Auto variables not created"); };

        if (typeof exportsTest !== 'undefined') {

            exportsTest.responseBody = response_body;
            exportsTest.responseStatusCode = response_statuscode;

            /* Create variables from top root response body json key/value pairs */
            try { json = (typeof response_body === "string") ? JSON.parse(response_body) : response_body; Object.keys(json).forEach((key) => { exportsTest[key] = json[key]; }) } catch (err) { console.log("Warning: " + err.message + ".  Auto variables not created"); };
        
        }

    })
    .catch(error => {

        console.error(error);

    });

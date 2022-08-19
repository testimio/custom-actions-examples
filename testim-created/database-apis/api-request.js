/**
 *  API Request 
 * 
 *      Make an API call and return results to Testim
 * 
 *  Parameters
 * 
 *      url (JS) : Target Endpoint
 *      method (JS) : GET, POST, PUT, etc
 *      headers (JS) [optional] 
 *      options (JS) [optional] 
 *      formData (JS) [optional] 
 *      pfxFile (JS) [optional]
 *      passPhrase (JS) [optional]
 *      certFile (JS) [optional]
 *      keyFile (JS) [optional]
 *      authUsername (JS) [optional]
 *      authPassword (JS) [optional]
 *      fileName (JS) [optional] 
 *      bodyContent (JS) [optional] 
 *      contentType (JS) [optional] 
 * 
 *      statusCode (JS) [optional] : Expected status code(s) from the API call
 *                                              Examples: 200 or [200, 204]
 * 
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
 *      https://httpcs.com/en/ssl-converter
 * 
 *      openssl pkcs12 -info -in mycert.pfx -noout
 *      openssl pkcs12 -in oldPfxFile.pfx -nodes -legacy | openssl pkcs12 -export -out newPfxFile.pfx
 * 
 *  Version       Date       Author          Details
 *      2.0.0     08/19/2022 Barry Solomon   Added statusCode validation
 * 
 **/

// var url = "http://localhost:8081/upload/";
// var method = "POST";
// var fileName = "C:/Pictures/doug.png";
// var formData = null;
// var contentType = null;
// var certFile = "alice.crt";
// var keyFile = "alice.key";
// var pfxFile = "alice.p12";
// var passPhrase = "whatever";

let verbose = false;

function loadModules(moduleNames) {
    let modulesLoaded = [];
    function loadModule(moduleName) {
        let moduleNameVar = moduleName.replace(/\-/g, "_");
        eval('try { ' + moduleNameVar + ' = (typeof ' + moduleNameVar + ' !== "undefined" && ' + moduleNameVar + ' !== null) ? ' + moduleNameVar + ' : require("' + moduleName + '"); if (moduleNameVar != null) modulesLoaded.push("' + moduleName + '"); } catch { console.log("Module: ' + moduleName + ' is not installed"); } ');
        if (verbose && modulesLoaded.includes(moduleName)) {
            console.log("Module " + moduleName + " is loaded.")
        }
    }
    moduleNames.forEach((moduleName) => {
        loadModule(moduleName);
    });
    console.log("Module(s) " + modulesLoaded + " loaded.");
}
loadModules(["request", "fs", "path", "https"]);

/* Validate required parameters
 */
if (typeof (url) === 'undefined' || url === null)
    throw new Error("url has not been specified.");
/* Default optional parameters
 */
eval('method   = (typeof method   !== "undefined" && method   !== null) ? method   : "GET" ');
eval('options  = (typeof options  !== "undefined" && options  !== null) ? options  : {} ');
eval('headers  = (typeof headers  !== "undefined" && headers  !== null) ? headers  : {} ');
eval('body     = (typeof bodyContent !== "undefined" && bodyContent !== null) ? bodyContent : null ');
eval('formdata = (typeof formData !== "undefined" && formData !== null) ? formData : null ');
eval('contenttype = (typeof contentType !== "undefined" && contentType !== null) ? contentType : "application/octet-stream" ');

/* If authUsername and authPassword are defined then create and set Authorization header
 */
if ((typeof authUsername !== 'undefined' && authUsername !== null)
    && (typeof authPassword !== 'undefined' && authPassword !== null)) {
    let bearer_token = "Basic " + Buffer.from(authUsername + ":" + authPassword).toString('base64');
    headers["Authorization"] = bearer_token;
}
/* If this is a file upload and fileName is defined 
 *  then create a formdata object and stream the file to it
 */
if (typeof fileName !== 'undefined' && fileName !== null) {
    contenttype = "multipart/form-data";
    var filedata = path.parse(fileName);
    formdata = {
        name: filedata.base,
        file: {
            value: fs.createReadStream(fileName),
            options: {
                filename: filedata.base,
                contentType: contenttype,
            }
        }
    };
}
var pfx_file = undefined;
if (typeof pfxFile !== 'undefined' && pfxFile !== null) {
    if (fs.existsSync(pfxFile)) {
        pfx_file = pfxFile;
    }
    else if (fs.existsSync(path.join(process.cwd(), pfxFile))) {
        pfx_file = path.join(process.cwd(), pfxFile);
    }
    if (pfx_file === undefined) {
        throw new Error("pfxFile not found: ", pfxFile);
    }
}
var cert_file = undefined;
if (typeof certFile !== 'undefined' && certFile !== null) {
    if (fs.existsSync(certFile)) {
        cert_file = certFile;
    }
    else if (fs.existsSync(path.join(process.cwd(), certFile))) {
        cert_file = path.join(process.cwd(), certFile);
    }
}
var key_file = undefined;
if (typeof keyFile !== 'undefined' && keyFile !== null) {
    if (fs.existsSync(keyFile)) {
        key_file = keyFile;
    }
    else if (fs.existsSync(path.join(process.cwd(), keyFile))) {
        key_file = path.join(process.cwd(), keyFile);
    }
}
if (typeof pfx_file !== 'undefined' && pfx_file !== null) {
    contenttype = "application/x-www-form-urlencoded";
    var https_agent_options = {
        pfx: fs.readFileSync(pfx_file),
        passphrase: (typeof passPhrase !== 'undefined' && passPhrase !== null ? passPhrase : ''),
    };
    const httpsAgent = new https.Agent(https_agent_options)
    options.agent = httpsAgent;
    options.agentOptions = https_agent_options;
}
else if (typeof cert_file !== 'undefined' && cert_file !== null) {
    contenttype = "application/x-www-form-urlencoded";
    var https_agent_options = {
        cert: fs.readFileSync(cert_file),
        key: fs.readFileSync(key_file),
    };
    const httpsAgent = new https.Agent(https_agent_options)
    options.agent = httpsAgent;
    // options.agentOptions = https_agent_options;
}

async function makeRequest(url, method, options, headers, formData, body, resolve, reject) {
    if (typeof method === 'undefined' || method === null)
        method = "POST";
    if (typeof body === 'undefined' || body === null)
        body = "";
    if (typeof formData === 'undefined' || formData === null)
        formData = "";
    // body if an object must be stringified
    if (typeof body === 'object')
        body = JSON.stringify(body);
    /* Override, append extra headers defined by headers
    */
    var requestHeaders = {};
    for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
            if (verbose)
                console.log(key + " -> " + headers[key]);
            requestHeaders[key] = headers[key]
        }
    }
    console.log("============================ REQUEST ============================");
    console.log("method ", method);
    if (verbose) {
        console.log("---------------------------- requestHeaders ----------------------------")
        console.log(JSON.stringify(requestHeaders));
        console.log("------------------------------------------------------------------------\n");
    }
    let requestOptions = {
        url: url
        , method: method
        , headers: requestHeaders
        // , formData: formData
        // , body: body
        , pretend: false
        , followAllRedirects: true
        , ssl: { rejectUnauthorized: false }
        //     , rejectUnauthorized: false
        , strictSSL: false
        //        , secureProtocol: 'TLSv1_method'
    };
    /* Override, append extra options defined by optionsEx
     */
    for (let key in options) {
        if (options.hasOwnProperty(key)) {
            if (verbose)
                console.log(key + " -> " + options[key]);
            requestOptions[key] = options[key]
        }
    }
    if (verbose) {
        console.log("---------------------------- requestOptions ----------------------------");
        console.log(JSON.stringify(requestOptions));
        console.log("------------------------------------------------------------------------\n");
    }
    await request(requestOptions, function (err, response, responseBody) {
        if (typeof err !== 'undefined' && err !== null) {
            console.log(err);
            reject(err);
        }
        if (response?.statusCode != null && response?.statusCode != 200) {
            console.log("---------------------------- statusCode ----------------------------");
            console.log("response?.statusCode = ", response?.statusCode, "response?.statusMessage = ", response?.statusMessage);
            if (typeof exportsTest !== 'undefined')
                exportsTest.response = response;
            reject("statusCode = " + response?.statusCode + ", statusMessage = " + response?.statusMessage + ", body = " + response.body);
        }
        console.log("============================ RESPONSE ============================");
        if (verbose) {
            console.log("---------------------------- response ----------------------------");
            console.log("response: ", JSON.stringify(response));
            console.log("------------------------------------------------------------------------\n");
        }
        let response_statuscode = response?.statusCode;
        let response_body = undefined;
        try {
            response_body = JSON.parse(response?.body);
        }
        catch {
            response_body = response?.body;
        }
        console.log("---------------------------- response status ----------------------------");
        console.log("response?.statusCode = ", response?.statusCode, "response?.statusMessage = ", response?.statusMessage);
        console.log("------------------------------------------------------------------------\n");
        console.log("---------------------------- response body ----------------------------");
        console.log(JSON.stringify(response_body));
        console.log("------------------------------------------------------------------------\n");
        resolve({ response_statuscode, response_body });
    });
}

var response_body = null;
var response_statuscode = null;

return new Promise((resolve, reject) => {
    makeRequest(url, method, options, headers, formdata, body, resolve, reject);
})
    .then(response => {
        response_body = response.response_body;
        response_statuscode = response.response_statuscode;
        if (verbose)
            console.log(response_body);
        try { json = (typeof response_body === "string") ? JSON.parse(response_body) : response_body; Object.keys(json).forEach((key) => { console.log(`==> ${key} = ${json[key]}`); }) } catch (err) { console.log("Warning: " + err.message + ".  Auto variables not created"); };
        if (typeof exportsTest !== 'undefined') {
            exportsTest.responseBody = response_body;
            exportsTest.responseStatusCode = response_statuscode;
            /* Create variables from top root response body json key/value pairs */
            try { json = (typeof response_body === "string") ? JSON.parse(response_body) : response_body; Object.keys(json).forEach((key) => { exportsTest[key] = json[key]; }) } catch (err) { console.log("Warning: " + err.message + ".  Auto variables not created"); };
            //exportsGlobal.authTok = exportsTest?.access_token;
        }
    })
    .then(() => {

        var status_codes = null;
        if (typeof statusCode !== 'undefined' && statusCode !== null) {

            status_codes = (typeof statusCode === 'object') ? statusCode : [statusCode];
            if (!status_codes.includes(response_statuscode)) {
                throw new Error(`Expected API Status Code: Expected ${status_codes}, Actual ${response_statuscode}`);
            }

        }

    })
    // .catch(error => {
    //     console.error(error);
    //     throw new Error(error);
    // });

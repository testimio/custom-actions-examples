/**
 *  AzureDevOps Run Result New (CLI)
 * 
 *  Parameters
 *      request (NPM)   - NPM request@latest package
 *      runId (JS)
 *      runInfo (JS)    - Patch document object that contains WorkItem information for work item creation
 *                          Examples:
 *                              { "runId" : 1, "testCaseTitle": "VerifyWebsiteTheme", "automatedTestName": "FabrikamFiber.WebSite.TestClass.VerifyWebsiteTheme", "priority": 1, "outcome": "Passed" }
 *                              { "runId" : 1, "testCaseTitle": "VerifyWebsiteLinks", "automatedTestName": "FabrikamFiber.WebSite.TestClass.VerifyWebsiteLinks", "priority": 2, "outcome": "Failed", "associatedBugs": [ { "id": 30 }] }
 * 
 *      validateOnly (JS) - Make the call to create, but do not actually create the work item (Used for debugging)
 *                          By default, it is set true and to actually create a work item must be set to false.                        
 *      orgName      (JS) [optional] - Name of DevOps org.                        If not supplied then DEFAULT_ORGANIZATION must be specified
 *      projectName  (JS) [optional] - Name of target project within DevOps org.  If not supplied then DEFAULT_PROJECT must be specified
 *      bearerToken  (JS) [optional] - DevOps access token.                       If not supplied then DEFAULT_BEARER_TOKEN must be specified
 * 
 *  Returns
 *      adoResponse
 *      runId
 * 
 *  Notes
 *      bearer token must have proper permissions
 * 
 *  References
 *      https://docs.microsoft.com/en-us/rest/api/azure/devops/test/?view=azure-devops-rest-6.1
 *      https://docs.microsoft.com/en-us/rest/api/azure/devops/test/results/add?view=azure-devops-rest-6.0
 *      https://docs.microsoft.com/en-us/rest/api/azure/devops/test/results/add?view=azure-devops-rest-6.0#testcaseresult
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Version
 *      0.0.1 - Possibly Working Version.  Worked when created, but has been a while
 * 
 *  Base Step
 *      Custom CLI Action
 * 
 *  Installation
 *      Create a new "Custom CLI Action"
 *      Name it "AzureDevOps Runs Create/Update (CLI)"
 *      Create parameters
 *          request      (NPM) : hardcode value = request @ latest 
 *          runInfo      (JS)
 *          validateOnly (JS)
 *      Optional - add optional parameters
 *          orgName (JS)     
 *          projectName  (JS)
 *          bearerToken  (JS)
 *      Set the new custom cli action's function body to this javascript
 *      [optional] Set DEFAULT_BEARER_TOKEN to a valid access token from your DevOps project to use instead of 'bearerToken' parameter
 *      [optional] Set DEFAULT_ORGANIZATION to a valid organization from your DevOps project to use instead of 'orgName'     parameter
 *      [optional] Set DEFAULT_PROJECT      to a valid project name from your DevOps project to use instead of 'projectName' parameter
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 * 
 **/

console.log("AzureDevOps Log Run (CLI) - Start");
console.log("=================================");

const DEFAULT_BEARER_TOKEN = 'br5iq6d4rdcqaxirfwugfo3na4sfpww7c73ykhvlujvae3kj6rfa';
const DEFAULT_ORGANIZATION = 'barrysolomon';
const DEFAULT_PROJECT = 'TestAutomation';

let request_body =
    [
        {
            "testCase": 38,
            "testCaseTitle": "Demo - Azure DevOps Integration",
            "automatedTestName": "TestAutomation.WebSite.TestClass.VerifyWebsiteTheme",
            "outcome": "Failed",
            "priority": 1,
            "stackTrace": "x->Y->Z",
            "comment": "Blah, blah, blah.  Fix It!",
            "errorMessage": "It failed again",
            "state": "Completed",
            "completedDate": "5/3/2011",
            "durationInMs": "120000",
            "isAutomated": true,
            "url": "https://app.testim.io/#/project/iLyLKuuWLZ2UaItwcRDP/branch/master/test/rsFmosgtu1gFRnfS/step/3W1iJCW2qTUdaCIT?result-id=0fnHpC1I2B41PCJ1",
            "plan": {
                "id": "17"
            },
        }
    ]
    ;

/*
 * Validate Parameters
 */

if (typeof bearerToken === 'undefined' || bearerToken === null)
    bearerToken = DEFAULT_BEARER_TOKEN;
if (typeof bearerToken === 'undefined' || bearerToken === null)
    throw new Error("bearerToken or DEFAULT_BEARER_TOKEN MUST be defined");

if (typeof orgName === 'undefined' || orgName === null)
    orgName = DEFAULT_ORGANIZATION;
if (typeof orgName === 'undefined' || orgName === null)
    throw new Error("orgName MUST be defined");

if (typeof projectName === 'undefined' || projectName === null)
    projectName = DEFAULT_PROJECT;
if (typeof projectName === 'undefined' || projectName === null)
    throw new Error("projectName MUST be defined");

let validate_only = 'true';
if (typeof validateOnly !== 'undefined' && validateOnly !== null)
    validate_only = validateOnly;

if (typeof runId === 'undefined' || runId === null)
    throw new Error("runId MUST be defined");

/* 
 *  Set API URL based on orgName, projectName 
 */
let apiUrl = 'https://' + orgName + ".visualstudio.com/" + projectName + '/_apis/test/Runs/' + runId + '/results?api-version=6.0';
console.log("    apiUrl = ", apiUrl);
console.log("    request_body = ", JSON.stringify(request_body));

let return_variable_name = "runId";

return new Promise((resolve, reject) => {

    async function makeRequest(apiUrl, requestMethod, contentType, requestBody, returnVariableName) {

        if (typeof requestMethod === 'undefined' || requestMethod === null)
            requestMethod = "POST";
        if (typeof requestBody === 'undefined' || requestBody === null)
            requestBody = "";

        // requestBody if an object must be stringified
        if (typeof requestBody === 'object')
            requestBody = JSON.stringify(requestBody);

        let bearer_token = "Basic " + Buffer.from(":" + bearerToken).toString('base64');
        //console.log(bearer_token);

        var options = {
            url: apiUrl
            , method: requestMethod
            , headers: {
                "Authorization": bearer_token,
                "content-type": contentType,
                "Content-Length": requestBody.length
            }
            , body: requestBody
            , pretend: false
            , followAllRedirects: true
        };
        //console.log(JSON.stringify(options));

        await request(options, function (err, response, responseBody) {
            //console.log('makeRequest ==> %s', response);

            if (typeof err !== 'undefined' && err !== null) {
                console.error(err);
                reject(err);
            }

            if (response.statusCode > 200) {
                console.error("response.statusCode = ", response.statusCode, "response.statusMessage = ", response.statusMessage);
                exportsTest.adoResponse = response;
                throw new Error("statusCode = " + response.statusCode + ", statusMessage = " + response.statusMessage + ", body = " + response.body);
            }

            exportsTest.adoResponse = JSON.parse(responseBody);
            console.log("adoResponse ==> ", exportsTest.adoResponse);

            if (typeof exportsTest.adoResponse.id !== 'undefined') {
                exportsTest[returnVariableName] = exportsTest.adoResponse.id;
                console.log("runId ==> ", exportsTest.runId);
            }

            resolve();
        });

    }

    makeRequest(apiUrl, "POST", "application/json", request_body, return_variable_name);

});


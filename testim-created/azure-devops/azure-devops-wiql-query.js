/**
 *  AzureDevOps wiQL Query
 * 
 *      Execute a wiQL (Work Item Query Language) query in Azure DevOps and return results
 *
 *  Parameters
 *      request (NPM)     - NPM request@latest package
 *      wiqlQuery (JS)    - wiQL query 
 *                          Examples:
 *                            {"query": "Select * From WorkItems Where [System.WorkItemType] = 'Bug'"}
 *                            {"query": "Select [System.TeamProject], [System.Id], [System.Title], [System.State], [System.WorkItemType] From WorkItems Where [System.WorkItemType] = 'Bug' And [ID] in (1, 2)"}
 *                            {"query": "Select [System.TeamProject], [System.Id], [System.Title], [System.State], [System.WorkItemType] From WorkItems Where [System.WorkItemType] = 'Bug' And [System.Title] = 'TestRun - Auto Create Bug'"}
 *      returnVariableName (JS) [optional] - Name of return variable.  If not specified then return variable is 'workItems'
 *      orgName      (JS) [optional] - Name of DevOps org.                        If not supplied then DEFAULT_ORGANIZATION must be specified
 *      projectName  (JS) [optional] - Name of target project within DevOps org.  If not supplied then DEFAULT_PROJECT must be specified
 *      bearerToken  (JS) [optional] - DevOps access token.                       If not supplied then DEFAULT_BEARER_TOKEN must be specified
 * 
 *  Returns
 *      wiqlResponse
 *      workItems
 *
 *  Notes
 * 
 *  References
 *      https://docs.microsoft.com/en-us/rest/api/azure/devops/wit/work%20items/create?view=azure-devops-rest-6.0
 *      https://docs.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=azure-devops
 *      https://docs.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=azure-devops#operators
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom CLI Action
 * 
 *  Installation
 *      Create a new "Custom CLI Action"
 *      Name it "AzureDevOps WorkItem Update (CLI)"
 *      Create parameters
 *          wiqlQuery (JS)
 *          returnVariableName (JS)
 *          request (NPM) = request @ latest 
 *      Set the new custom cli action's function body to this javascript
 * 
 *      Optional - add optional parameters
 *          orgName (JS)     
 *          projectName  (JS)
 *          bearerToken  (JS)
 *        and/or set default values
 *          Set DEFAULT_BEARER_TOKEN to a valid access token from your DevOps project to use instead of 'bearerToken' parameter
 *          Set DEFAULT_ORGANIZATION to a valid organization from your DevOps project to use instead of 'orgName'     parameter
 *          Set DEFAULT_PROJECT      to a valid project name from your DevOps project to use instead of 'projectName' parameter
 * 
 *      Note: You must either set DEFAULT_BEARER_TOKEN, DEFAULT_ORGANIZATION and DEFAULT_PROJECT
 *            or add and use parameters orgName, projectName and bearerToken
 *
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
 **/

console.log("AzureDevOps WorkItem Update (CLI) (", wiqlQuery, ")");

const DEFAULT_BEARER_TOKEN = null;
const DEFAULT_ORGANIZATION = null;
const DEFAULT_PROJECT = null;

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

if (typeof wiqlQuery === 'undefined' || wiqlQuery === null)
    throw new Error("wiqlQuery MUST be defined");

console.log("AzureDevOps (wiQL) Work Item Query (CLI) - Start");

/* Return parameters
 */

let return_variable_name = 'workItems';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

exportsTest.wiqlResponse = null;
exportsTest[return_variable_name] = null;

let wiqlQueryUrl = 'https://' + orgName + ".visualstudio.com/" + projectName + '/_apis/wit/wiql?api-version=6.0';

return new Promise((resolve, reject) => {

    async function makeRequest(apiUrl, requestMethod, contentType, requestBody) {

        if (typeof requestMethod === 'undefined' || requestMethod === null)
            requestMethod = "POST";
        if (typeof requestBody === 'undefined' || requestBody === null)
            requestBody = "";

        // requestBody if an object must be stringified
        if (typeof requestBody === 'object')
            requestBody = JSON.stringify(requestBody);

        let bearer_token = "Basic " + Buffer.from(":" + bearerToken).toString('base64');
        console.log(bearer_token);

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
        console.log(JSON.stringify(options));

        await request(options, function (err, response, responseBody) {
            if (typeof err !== 'undefined' && err !== null) {
                console.log(err);
                reject(err);
            }

            if (response.statusCode != 200) {
                console.log("response.statusCode = ", response.statusCode, "response.statusMessage = ", response.statusMessage);
                exportsTest.adoResponse = response;
                reject("statusCode = " + response.statusCode + ", statusMessage = " + response.statusMessage + ", body = " + response.body);
            }

            //console.log('makeRequest ==> %s', response);
            console.log("Response body ==> ", responseBody);

            exportsTest.adoResponse = JSON.parse(responseBody);
            exportsTest[return_variable_name] = exportsTest.adoResponse.workItems;

            console.log(return_variable_name + " ==> " + responseBody);

            resolve();
        });

    }

    makeRequest(wiqlQueryUrl, "POST", "application/json", wiqlQuery);

})

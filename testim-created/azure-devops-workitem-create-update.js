/**
 *  AzureDevOps WorkItem Create/Update (CLI)
 * 
 *  Parameters
 *      request (NPM)     - NPM request@latest package
 *      workItemInfo (JS) - Patch document object that contains WorkItem information for work item creation
 *                          Examples:
 *                              { "id" : 3, "Severity" : "3 - Medium", "Priority" : "2", "State" : "Approved" }
 *                              { "id" : 3, "title" : "TestRun - Auto Create Bug (Updated)" }
 *                              { "title" : "API Created Test Case", "type" : "Test Case", "areapath" : "TestAutomation", "iteration" : "Iterations\\Sprint 1" }
 *                              { "title" : "TestRun - Auto Create Bug", "areapath" : "TestAutomation\\Bugs" }
 *                              { "title" : "TestRun - Auto Create Bug", "history" : "Update a bug from a test run and set area field_type_lookup", "areapath" : "TestAutomation\\Bugs" }
 *                              { "title" : "TestRun - Auto Create Bug", "history" : "Create a new-new bug from a test run", "areapath" : "TestAutomation\\Bugs" }
 *                              { "id" : 22, "title" : "API Created Test Case", "type" : "Test Case", "areapath" : "TestAutomation", "steps": "<steps id=\"0\" last=\"1\"><step id=\"2\" type=\"ValidateStep\"><parameterizedString isformatted=\"true\">Input step 1</parameterizedString><parameterizedString isformatted=\"true\">Expectation step 1</parameterizedString><description/></step></steps>" }
 *                              { "id" : 24, "Dependency" : "20", "Tags" : "Testim" }
 *                              { "id" : 20, "Severity" : "3 - Medium", "Priority" : "2", "State" : "Approved" }
 *                              { "id" : 20, "iterationpath" : "TestAutomation\\Sprint 1" }
 * 
 *      validateOnly (JS) - Make the call to create, but do not actually create the work item (Used for debugging)
 *                          By default (DEFAULT_VALIDATION_ONLY_MODE), it is set true and to actually create a work item must be set to false.                        
 *      orgName      (JS) [optional] - Name of DevOps org.                        If not supplied then DEFAULT_ORGANIZATION must be specified
 *      projectName  (JS) [optional] - Name of target project within DevOps org.  If not supplied then DEFAULT_PROJECT must be specified
 *      bearerToken  (JS) [optional] - DevOps access token.                       If not supplied then DEFAULT_BEARER_TOKEN must be specified
 * 
 *  Returns
 *      adoResponse
 *      workItemId
 * 
 *  Notes
 * 
 *  References
 *      https://docs.microsoft.com/en-us/rest/api/azure/devops/wit/work%20items/create?view=azure-devops-rest-6.0
 *      https://docs.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=azure-devops
 *      https://docs.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=azure-devops#operators
 *      https://docs.microsoft.com/en-us/rest/api/azure/devops/test/?view=azure-devops-rest-6.1
 * 
 *  Version
 *      1.0.0 - Initial Working Version
 *      1.0.1 - Bug fixes
 *      1.0.2 - Refactoring for handling multiple requests
 * 
 *  Base Step
 *      Custom CLI Action
 * 
 *  Installation
 *      Create a new "Custom CLI Action"
 *      Name it "AzureDevOps WorkItem Update (CLI)"
 *      Create parameters
 *          request      (NPM) : hardcode value = request @ latest 
 *          workItemInfo (JS)
 *          validateOnly (JS)
 *      Optional - add optional parameters
 *          orgName (JS)     
 *          projectName  (JS)
 *          bearerToken  (JS)
 *      Set the new custom cli action's function body to this javascript
 * 		Set default values
 *          DEFAULT_BEARER_TOKEN to a valid access token from your DevOps project to use instead of 'bearerToken' parameter
 *          DEFAULT_ORGANIZATION to a valid organization from your DevOps project to use instead of 'orgName'     parameter
 *          DEFAULT_PROJECT      to a valid project name from your DevOps project to use instead of 'projectName' parameter
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

console.log("AzureDevOps WorkItem Update (CLI) - Start");

const DEFAULT_BEARER_TOKEN = null;
const DEFAULT_ORGANIZATION = null;
const DEFAULT_PROJECT = null;
const DEFAULT_VALIDATION_ONLY_MODE = 'false';

var workItemId = null;
var workItemType = 'Bug';

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

if (typeof validateOnly === 'undefined' || validateOnly === null)
    validateOnly = DEFAULT_VALIDATION_ONLY_MODE;

if (typeof workItemInfo === 'undefined' || workItemInfo === null)
    throw new Error("projectName MUST be defined");

let work_item_constructs = [];
if (!Array.isArray(workItemInfo)) {
    work_item_constructs.push(workItemInfo);
}
else {
    work_item_constructs = [...workItemInfo];
}

/*
 *  PATCH document from WorkItemInfo
 */
function patchDocumentCreate(workItemInfo) {

    /* Create lookup for field types based on workItemInfo keys or target fields
     */
    let field_type_lookup = {
        "ID": "/fields/System.Id"
        , "TYPE": "/fields/System.WorkItemType" // Used for routing, not work item itself
        , "TITLE": "/fields/System.Title"
        , "AREAPATH": "/fields/System.AreaPath"
        , "ITERATIONPATH": "/fields/System.IterationPath"
        , "DESCRIPTION": "/fields/System.Description"
        , "HISTORY": "/fields/System.History"
        , "TAGS": "/fields/System.Tags"
        , "PRIORITY": "/fields/Microsoft.VSTS.Common.Priority"
        , "SEVERITY": "/fields/Microsoft.VSTS.Common.Severity"
        , "VALUEAREA": "/fields/Microsoft.VSTS.Common.ValueArea"
        , "STATE": "/fields/System.State"
        , "WORKITEMTYPE": "/fields/System.WorkItemType"
        , "LINK": "/relations/-"
        , "TESTLINK": "/relations/-"
        , "RESULTLINK": "/relations/-"
        , "DEPENDENCY": "/relations/-"
        , "DEPENDENCYTYPE": ""
        , "VALUEAREA": "/fields/Microsoft.VSTS.Common.ValueArea"
        , "INTEGRATIONBUILD": "/fields/Microsoft.VSTS.Build.IntegrationBuild"
        , "FOUNDIN": "/fields/Microsoft.VSTS.Build.FoundIn"
        , "REPROSTEPS": "/fields/Microsoft.VSTS.TCM.ReproSteps"
        , "ID": "/fields/System.Id"
        , "TYPE": "/fields/System.WorkItemType"
        , "STEPS": "/fields/Microsoft.VSTS.TCM.Steps"
    };

    let patch_document = [];
    Object.keys(workItemInfo).forEach(

        function (key) {

            //console.log(" ==> processing [" + key.toUpperCase() + " / " + workItemInfo[key]);

            if (typeof field_type_lookup[key.toUpperCase()] === 'undefined' || field_type_lookup[key.toUpperCase()] === null) {
                console.log("field_type_lookup[" + key.toUpperCase() + " ] does not exist");
                return;
            }

            switch (key.toUpperCase().replace(" ", "")) {

                case "ID":
                    workItemId = workItemInfo[key];
                    break;

                case "TYPE":
                    workItemType = workItemInfo[key];
                    break;

                case "TITLE":
                    patch_document.push({
                        "op": "add",
                        "path": field_type_lookup[key.toUpperCase()],
                        "from": null,
                        "value": workItemInfo[key]
                    });
                    break;

                case "VALUEAREA":
                    patch_document.push({
                        "op": "add",
                        "path": field_type_lookup[key.toUpperCase()],
                        "value": workItemInfo[key]
                    });
                    break;

                case "DEPENDENCY":
                    patch_document.push({
                        "op": "add",
                        "path": field_type_lookup[key.toUpperCase()],
                        "value": {
                            "rel": (workItemType === 'Bug' ? "Microsoft.VSTS.Common.TestedBy-Forward" : "Microsoft.VSTS.Common.TestedBy-Reverse"),
                            //"System.LinkTypes.Related", // "System.LinkTypes.Dependency-forward",
                            "url": 'https://' + orgName + ".visualstudio.com/" + projectName + '/_apis/wit/workitems/' + workItemInfo[key],
                            "attributes": {
                            }
                        }
                    });
                    break;

                case "LINK":
                case "TESTLINK":
                case "RESULTLINK":
                    patch_document.push({
                        "op": "add",
                        "path": field_type_lookup[key.toUpperCase()],
                        "value": {
                            "rel": "Hyperlink",
                            "url": workItemInfo[key]
                        }
                    });
                    break;

                default:
                    patch_document.push({
                        "op": "add",
                        "path": field_type_lookup[key.toUpperCase()],
                        "value": workItemInfo[key]
                    });
                    break;
            }
        }
    );

    return (patch_document);
}

return new Promise((resolve, reject) => {

    let requestCount = 0;
    let requestsProcessed = 0;
    async function makeRequest(apiUrl, requestMethod, contentType, requestBody) {

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

            requestsProcessed += 1;

            if (typeof err !== 'undefined' && err !== null) {
                console.log(err);
                reject("err = " + err);
            }

            if (response.statusCode > 200) {
                console.log("response.statusCode = ", response.statusCode, "response.statusMessage = ", response.statusMessage);
                exportsTest.adoResponse = response;
                reject("statusCode = " + response.statusCode + ", statusMessage = " + response.statusMessage + ", body = " + response.body);
            }

            exportsTest.adoResponse = JSON.parse(responseBody);
            console.log("adoResponse ==> ", exportsTest.adoResponse);

            if (typeof exportsTest.adoResponse.id !== 'undefined') {
                exportsTest.workItemId = exportsTest.adoResponse.id;
                console.log("workItemId ==> ", exportsTest.workItemId);
            }

            // Only resolve if this was the last instruction
            //
            if (requestCount === requestsProcessed)
                resolve();

        });

    }

    requestCount = work_item_constructs.length;
    requestsProcessed = 0;
    work_item_constructs.forEach(

        function (work_item_construct, index) {

            workItemId = Number(work_item_construct['id']);
            currentWorkItemIndex = index;
            console.log("    workItemId = ", workItemId);

            console.log("    currentWorkItemIndex = ", currentWorkItemIndex);

            /*
             *  Validate fields as required
             */
            let operation = (work_item_construct.hasOwnProperty("title") === true && work_item_construct['title'] === null || Number(work_item_construct['id']) > 0) ? "UPDATE" : "NEW";
            switch (operation) {
                case "NEW":
                    if (work_item_construct.hasOwnProperty("title") === false) {
                        throw new Error("New work items require a title to be defined");
                    }
                    if (work_item_construct.hasOwnProperty("type") === false) {
                        throw new Error("New work items require a type to be defined");
                    }
                    break;
                case "UPDATE":
                    if (work_item_construct.hasOwnProperty("title") === true && work_item_construct['title'] === null || work_item_construct['title'] === '') {
                        throw new Error("Work items require a title to be non-null");
                    }
                    break;
            }
            console.log("    operation = ", operation);

            /* 
             *  Set API URL based on orgName, projectName and workItemId being set
             */
            let apiUrl = '';
            if (operation === "NEW") {
                console.log("workItemId undefined.  CREATE new work item");
                apiUrl = 'https://' + orgName + ".visualstudio.com/" + projectName + '/_apis/wit/workitems/?Type=' + workItemType + '&validateOnly=' + validateOnly + '&bypassRules=true&suppressNotifications=true&api-version=6.0';
            } else {
                console.log("workItemId defined.  UPDATE work item ", workItemId);
                apiUrl = 'https://' + orgName + ".visualstudio.com/" + projectName + '/_apis/wit/workitems/' + workItemId + '?validateOnly=' + validateOnly + '&bypassRules=true&suppressNotifications=true&api-version=6.0';
            }
            console.log("    apiUrl = ", apiUrl);
            console.log("----------------------");

            let patch_document = patchDocumentCreate(work_item_construct);
            console.log("    patch_document = ", JSON.stringify(patch_document));

            if (typeof patch_document !== 'undefined' && patch_document !== null && patch_document.length > 0) {
                makeRequest(apiUrl, "PATCH", "application/json-patch+json", patch_document);
            }

        });

});

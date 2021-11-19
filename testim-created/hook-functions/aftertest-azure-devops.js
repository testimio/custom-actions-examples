/**
 *  AfterTest - Azure Devops
 * 
 *      Create or update an existing work item based on the name of the current test
 *
 *  Parameters
 *      request (NPM)     - NPM request@latest package
 *      orgName      (JS) [optional] - Name of DevOps org.                        If not supplied then DEFAULT_ORGANIZATION must be specified
 *      projectName  (JS) [optional] - Name of target project within DevOps org.  If not supplied then DEFAULT_PROJECT must be specified
 *      bearerToken  (JS) [optional] - DevOps access token.                       If not supplied then DEFAULT_BEARER_TOKEN must be specified
 *
 *  Notes
 * 
 *      Use this with "AfterStep" hook that marshalls step information if you wish to include detailed step information with reported results
 * 
 *      You must have the following before you can create a work item.

 *      An organization in Azure DevOps Services. If you don't have one, you can create one for free
 *          https://go.microsoft.com/fwlink/?LinkId=307137
 *
 *      A Personal Access Token, find out how to create one
 *          https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops
 *       to create one:
 *          https://<<Organization>>.visualstudio.com/_usersSettings/tokens
 *
 *      You can also specify other fields in the target work item such as  "Severity", "Priority", "iterationpath" and "areapath".  
 *     
 *  References
 *      https://docs.microsoft.com/en-us/rest/api/azure/devops/wit/work%20items/create?view=azure-devops-rest-6.0
 *      https://docs.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=azure-devops
 *      https://docs.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=azure-devops#operators
 * 
 *  Version
 *      1.1.0 - Added Result URL to comments/history
 *      1.1.1 - Added Result URL to work item's "Links"
 *      1.2.0 - Refactored for better readability and logic flow
 * 
 *  Base Step
 *      Custom CLI Action
 * 
 *  Installation
 *      Create a new "Custom CLI Action"
 *      Name it "AfterTest - Azure Devops"
 *      Create parameters
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
 *      Assign this step as an "After Test" hook in the configuration
 *      Save the test
 *      Bob's your uncle
 *
 **/

const DEFAULT_BEARER_TOKEN = null;
const DEFAULT_ORGANIZATION = null;
const DEFAULT_PROJECT = null;
const DEFAULT_VALIDATION_ONLY_MODE = 'false';

let WORKITEM_TESTIM_TAG = "TestimMade";
let WORKITEM_ITERATION_PATH = null;
let WORKITEM_AREA_PATH = null;
let WORKITEM_PRIORITY = null;
let WORKITEM_SEVERITY = null;

let TEST_FAIL_WORKITEM_EXISTING_STATE = "Committed";
let TEST_FAIL_WORKITEM_NEW_STATE = "New";
let TEST_PASS_WORKITEM_STATE = "Done";

/**** DEBUG ****
// Uncomment this block to run this as a regular step for initial debugging.  
// Note, if uncommented and used in both a the test case and as a hook function then the following error will occur in the hook instance:
//     SyntaxError: Identifier '_stepData' has already been declared
//   Not a biggie, just something to be aware of
//
let _stepData = {};
let _stepInternalData = {};
//let _steps = [];
_stepData['testName'] = "Demo - Azure DevOps Integration";
_stepInternalData['errorType'] = "Debug Error Type"
_stepInternalData['failureReason'] = "Because"
/**** DEBUG ****/

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

let return_variable_name = 'workItems';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

if (typeof validateOnly === 'undefined' || validateOnly === null)
    validateOnly = DEFAULT_VALIDATION_ONLY_MODE;

let workItemType = "Bug";
let workItemTags = "";
let testResultWorkItem = {};

function testResult_WorkItemJSON(_stepData, _stepInternalData, workItemId) {

    let bugTitle = (_stepData.testName !== "" ? _stepData.testName : 'NoName TestName') + " - "
        + ((typeof _stepInternalData.failureReason !== 'undefined') ? _stepInternalData.failureReason : "Passed");

    var project_id = ((typeof _stepInternalData.projectId === 'undefined') ? null : _stepInternalData.projectId);
    var test_id = ((typeof _stepInternalData.testId === 'undefined') ? null : _stepInternalData.testId);
    var branch = ((typeof _stepInternalData.branch === 'undefined') ? null : _stepInternalData.branch);
    var result_id = ((typeof _stepInternalData.testResultId === 'undefined') ? null : _stepInternalData.testResultId);
    var result_url = (project_id === null || test_id === null || branch === null || result_id === null) ? null : "https://app.testim.io/#/project/" + project_id + "/branch/" + branch + "/test/" + test_id + "?result-id=" + result_id;

    /* Create testResultWorkItem object for use in call to AzureDevOpsWorkItemCreateUpdate
     */
    testResultWorkItem = {};

    if (typeof (workItemId) !== 'undefined' && workItemId > 0)
        testResultWorkItem["id"] = workItemId;

    testResultWorkItem["type"] = "Bug";
    testResultWorkItem["title"] = bugTitle;

    /* HISTORY
     */
    let history_entry = "<div>";
    if (typeof _stepInternalData.failureReason !== 'undefined') {
        history_entry = "<div>Test [" + _stepData.testName + "] - " + _stepInternalData.errorType + "</div><div>" + _stepInternalData.failureReason + "</div>";
    } else {
        history_entry = "<div>Test [" + _stepData.testName + "] - Passed</div>";
    }
    history_entry += "<br/><a target='_blank' href='" + result_url + "'>View Results</a></div>";
    testResultWorkItem["history"] = history_entry;

    /* TAGS
     */
    if (typeof (WORKITEM_TESTIM_TAG) !== 'undefined' && WORKITEM_TESTIM_TAG !== null)
        testResultWorkItem["tags"] = workItemTags + ((workItemTags === "") ? "" : ", ") + WORKITEM_TESTIM_TAG;

    testResultWorkItem["state"] =
        (typeof _stepInternalData.failureReason !== 'undefined')
            ? (typeof (workItemId) !== 'undefined' && workItemId > 0)
                ? TEST_FAIL_WORKITEM_EXISTING_STATE
                : TEST_FAIL_WORKITEM_NEW_STATE
            : TEST_PASS_WORKITEM_STATE;

    /* REPRO STEPS
     */
    let reprosteps = null;
    if (typeof _steps !== 'undefined' && _steps !== null) {
        reprosteps = "<div><b>Steps</b></div>";
        _steps.forEach((step) => {
            let step_string = "";
            step_string = "<div>Step " + step.stepNumber + ": " + step.name + "</div>";
            reprosteps += step_string;
        });
        if (typeof _stepInternalData.failureReason !== 'undefined')
            reprosteps += "<div>" + _stepInternalData.failureReason + "</div>";
    }
    if (typeof (reprosteps) !== 'undefined' && reprosteps !== null)
        testResultWorkItem["reprosteps"] = reprosteps;

    /* Other fields available to be set
     */
    if (typeof (WORKITEM_SEVERITY) !== 'undefined' && WORKITEM_SEVERITY !== null) testResultWorkItem["Severity"] = WORKITEM_SEVERITY;
    if (typeof (WORKITEM_PRIORITY) !== 'undefined' && WORKITEM_PRIORITY !== null) testResultWorkItem["Priority"] = WORKITEM_PRIORITY;
    if (typeof (WORKITEM_ITERATION_PATH) !== 'undefined' && WORKITEM_ITERATION_PATH !== null) testResultWorkItem["iterationpath"] = WORKITEM_ITERATION_PATH;
    if (typeof (WORKITEM_AREA_PATH) !== 'undefined' && WORKITEM_AREA_PATH !== null) testResultWorkItem["areapath"] = WORKITEM_AREA_PATH;

    console.log("\ntestResult_WorkItemJSON => testResultWorkItem ==> \n\t" + JSON.stringify(testResultWorkItem));

    exportsTest.testResultWorkItem = testResultWorkItem;

    return (testResultWorkItem);
}

function patchDocumentCreate(workItemInfoJSON) {

    /* Create lookup for field types based on workItemInfoJSON keys or target fields
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
    Object.keys(workItemInfoJSON).forEach(

        function (key) {

            if (typeof field_type_lookup[key.toUpperCase()] === 'undefined' || field_type_lookup[key.toUpperCase()] === null) {
                console.log("field_type_lookup[" + key.toUpperCase() + " ] does not exist");
                return;
            }

            switch (key.toUpperCase().replace(" ", "")) {

                case "ID":
                    workItemId = workItemInfoJSON[key];
                    break;

                case "TYPE":
                    workItemType = workItemInfoJSON[key];
                    break;

                case "TITLE":
                    patch_document.push({
                        "op": "add",
                        "path": field_type_lookup[key.toUpperCase()],
                        "from": null,
                        "value": workItemInfoJSON[key]
                    });
                    break;

                case "VALUEAREA":
                    patch_document.push({
                        "op": "add",
                        "path": field_type_lookup[key.toUpperCase()],
                        "value": workItemInfoJSON[key]
                    });
                    break;

                case "DEPENDENCY":
                    patch_document.push({
                        "op": "add",
                        "path": field_type_lookup[key.toUpperCase()],
                        "value": {
                            "rel": (workItemType === 'Bug' ? "Microsoft.VSTS.Common.TestedBy-Forward" : "Microsoft.VSTS.Common.TestedBy-Reverse"),
                            //"System.LinkTypes.Related", // "System.LinkTypes.Dependency-forward",
                            "url": 'https://' + orgName + ".visualstudio.com/" + projectName + '/_apis/wit/workitems/' + workItemInfoJSON[key],
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
                            "url": workItemInfoJSON[key]
                        }
                    });
                    break;

                default:
                    patch_document.push({
                        "op": "add",
                        "path": field_type_lookup[key.toUpperCase()],
                        "value": workItemInfoJSON[key]
                    });
                    break;
            }
        }
    );

    return (patch_document);
}

async function makeRequest(apiUrl, requestMethod, contentType, requestBody) {

    if (typeof requestMethod === 'undefined' || requestMethod === null)
        requestMethod = "POST";
    if (typeof requestBody === 'undefined' || requestBody === null)
        requestBody = "";

    // requestBody if an object must be stringified
    if (typeof requestBody === 'object')
        requestBody = JSON.stringify(requestBody);

    let bearer_token = "Basic " + Buffer.from(":" + bearerToken).toString('base64');

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

    return new Promise((resolve, reject) => {

        request(options, function (err, response, responseBody) {

            exportsTest.lastResponse = response;
            exportsTest.lastResponseBody = responseBody;

            if (typeof err !== 'undefined' && err !== null) {
                console.log(err);
                reject(err);
            }

            if (response.statusCode != 200) {
                console.log("response.statusCode = ", response.statusCode, "response.statusMessage = ", response.statusMessage);
                reject("statusCode = " + response.statusCode + ", statusMessage = " + response.statusMessage + ", body = " + response.body);
            }

            resolve(responseBody);

        });

    })

}

function AzureDevOpsWorkItemQuery(wiqlQuery, returnVariableName, orgName, projectName, bearerToken, validateOnly, resolve, reject) {

    /* Validate Parameters
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

    if (typeof wiqlQuery === 'undefined' || wiqlQuery === null)
        throw new Error("wiqlQuery MUST be defined");

    /* Return parameters
    */
    let return_variable_name = 'workItems';
    if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
        return_variable_name = returnVariableName;

    exportsTest.wiqlResponse = null;
    exportsTest[return_variable_name] = null;


    async function makeRequest(apiUrl, requestMethod, contentType, requestBody) {

        if (typeof requestMethod === 'undefined' || requestMethod === null)
            requestMethod = "POST";
        if (typeof requestBody === 'undefined' || requestBody === null)
            requestBody = "";

        // requestBody if an object must be stringified
        if (typeof requestBody === 'object')
            requestBody = JSON.stringify(requestBody);

        let bearer_token = "Basic " + Buffer.from(":" + bearerToken).toString('base64');

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

            exportsTest.adoResponse = JSON.parse(responseBody);
            exportsTest[return_variable_name] = exportsTest.adoResponse.workItems;

            let work_item_id;
            if (typeof exportsTest.adoResponse.workItems !== 'undefined' && exportsTest.adoResponse.workItems.length > 0) {
                work_item_id = exportsTest.adoResponse.workItems[0].id;
            }

            resolve(work_item_id);
        });

    }

    let wiqlQueryUrl = 'https://' + orgName + ".visualstudio.com/" + projectName + '/_apis/wit/wiql?api-version=6.0';
    makeRequest(wiqlQueryUrl, "POST", "application/json", wiqlQuery);

}

function AzureDevOpsWorkItemCreateUpdate(workItemInfoJSON, orgName, projectName, bearerToken, validateOnly, resolve, reject) {

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

    if (typeof workItemInfoJSON === 'undefined' || workItemInfoJSON === null)
        throw new Error("workItemInfoJSON MUST be defined");

    workItemId = Number(workItemInfoJSON['id']);

    /*
     *  Validate fields
     */
    let operation = (workItemInfoJSON.hasOwnProperty("title") === true && workItemInfoJSON['title'] === null || Number(workItemInfoJSON['id']) > 0) ? "UPDATE" : "NEW";
    switch (operation) {
        case "NEW":
            if (workItemInfoJSON.hasOwnProperty("title") === false) {
                throw new Error("New work items require a title to be defined");
            }
            if (workItemInfoJSON.hasOwnProperty("type") === false) {
                throw new Error("New work items require a type to be defined");
            }
            break;
        case "UPDATE":
            if (workItemInfoJSON.hasOwnProperty("title") === true && workItemInfoJSON['title'] === null || workItemInfoJSON['title'] === '') {
                throw new Error("Work items require a title to be non-null");
            }
            break;
    }

    /* 
     * Set API URL based on orgName, projectName and workItemId being set
     */
    let apiUrl = '';
    if (operation === "NEW") {
        console.log("\nworkItemId undefined.  CREATE new work item");
        apiUrl = 'https://' + orgName + ".visualstudio.com/" + projectName + '/_apis/wit/workitems/?Type=' + workItemType + '&validateOnly=' + validateOnly + '&bypassRules=true&suppressNotifications=true&api-version=6.0';
    } else {
        console.log("\nworkItemId defined.  UPDATE work item ", workItemId);
        apiUrl = 'https://' + orgName + ".visualstudio.com/" + projectName + '/_apis/wit/workitems/' + workItemId + '?validateOnly=' + validateOnly + '&bypassRules=true&suppressNotifications=true&api-version=6.0';
    }

    let patch_document = patchDocumentCreate(workItemInfoJSON);
    console.log("\AzureDevOpsWorkItemCreateUpdate PATCH DOCUMENT ==> \n\t" + JSON.stringify(patch_document));

    return new Promise((resolve, reject) => {
        if (typeof patch_document !== 'undefined' && patch_document !== null && patch_document.length > 0) {
            makeRequest(apiUrl, "PATCH", "application/json-patch+json", patch_document)
                .then((responseBody) => {
                    resolve(responseBody);
                })
        }
        else {
            reject("No PATCH document defined");
        }
    }).then((responseBody) => {

        resolve(responseBody);

    });

}

function AzureDevOpsWorkItemGet(workItemId) {

    return new Promise((resolve, reject) => {

        /* Get work item information if existing workitem exists
         */
        if (typeof workItemId !== 'undefined' && workItemId > 0) {

            let wiQueryUrl = 'https://' + orgName + ".visualstudio.com/" + projectName + '/_apis/wit/workitems/' + workItemId + '?api-version=6.0';
            makeRequest(wiQueryUrl, "GET", "application/json", "")

                .then((responseBody) => {

                    exportsTest.workItem = JSON.parse(responseBody);
                    exportsTest[return_variable_name] = exportsTest.workItem;

                    let work_item_id;
                    if (typeof exportsTest.workItem !== 'undefined') {
                        work_item_id = exportsTest.workItem.id;
                        workItemTags = "";
                        if (Object.keys(exportsTest.workItem.fields).includes("System.Tags")) {
                            workItemTags = exportsTest.workItem.fields["System.Tags"];
                        }
                    }

                    resolve(workItemId);

                });

        }
        else {

            resolve(null);

        }

    });

}

return new Promise((resolve, reject) => {

    /* Find a work item (bug) that starts with this test's name
    */
    let wiql = "Select [System.TeamProject], [System.Id], [System.Title], [System.State], [System.WorkItemType] "
        + "From WorkItems "
        + "Where [System.WorkItemType] = 'Bug' "
        + "And [System.Title] Contains '" + ((_stepData.testName !== "") ? _stepData.testName + "'" : "unsaved untitled test'")
        ;

    AzureDevOpsWorkItemQuery({ "query": wiql }, return_variable_name, orgName, projectName, bearerToken, validateOnly, resolve, reject);
    // AzureDevOpsWorkItemQuery returns workItemId

})
    .then((workItemId) => {

        /* Prepare WorkItem New/Update Payload with Test Result Data
         */
        let workItemInfoJSON = testResult_WorkItemJSON(_stepData, _stepInternalData, workItemId);
        return (workItemInfoJSON);

    }).then((workItemInfoJSON) => {

        /* Create/Update WorkItem 
         */
        if (typeof workItemInfoJSON !== 'undefined' && workItemInfoJSON !== null) {
            return new Promise((resolve, reject) => {
                AzureDevOpsWorkItemCreateUpdate(workItemInfoJSON, orgName, projectName, bearerToken, validateOnly, resolve, reject);
            });
        }

    }).then(() => {

        console.log("\nAzureDevOpsWorkItemCreateUpdate RESPONSE ==> \n\t" + JSON.stringify(exportsTest.adoResponse));

    });

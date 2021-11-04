/**
 *  After Test Hook - JSONDBFS
 *
 *      Collect test results gathered during a test run and insert into a JSONDBFS Database Collection (file)
 *
 *  Parameters
 *
 *      JSONDBFSDriver (NPM)   - jsondbfs@latest
 * 
 *  Notes
 * 
 *      Use this with "AfterStep" hooks if you wish to include detailed step information with reported results
 * 
 *      You will have to install the npm package jsondbfs@latest
 * 
 *  Base Step
 *      Custom CLI Action
 * 
 *  Installation
 *      Create a new "Custom CLI Action"
 *      Name it "After Test Hook - JSONDBFS" or base it on the target reporting system. 
 *      Set the new custom CLI action's function body to this javascript
 *      Add the parameter 
 *          JSONDBFSDriver (NPM) and set it to jsondbfs@latest
 *      Exit the step editor
 *      Share the step if not already done so
 *      Assign this step as an "After Test" hook in the configuration
 *      Save the test
 *      Bob's your uncle
 *
 **/

//console.log("TEST LEVEL - AfterTest - JSONDBFS");

var test_name = _stepData.testName;
var test_data = (typeof _test_data !== 'undefined') ? _test_data : null;
var test_transactions = (typeof transactions !== 'undefined') ? transactions : null;
var network_request_stats = (typeof networkRequestStats !== 'undefined') ? networkRequestStats : null;
var test_status_details = ((typeof _stepInternalData.failureReason === 'undefined') ? null : _stepInternalData.failureReason.replaceAll("'", "''"));

var project_id = ((typeof _stepInternalData.projectId === 'undefined') ? null : _stepInternalData.projectId);
var test_id = ((typeof _stepInternalData.testId === 'undefined') ? null : _stepInternalData.testId);
var branch = ((typeof _stepInternalData.branch === 'undefined') ? null : _stepInternalData.branch);
var result_id = ((typeof _stepInternalData.testResultId === 'undefined') ? null : _stepInternalData.testResultId);
var result_url = (project_id === null || test_id === null || branch === null || result_id === null) ? null : "https://app.testim.io/#/project/" + project_id + "/branch/" + branch + "/test/" + test_id + "?result-id=" + result_id;
var steps = (typeof _steps === 'undefined') ? { "NoStepData": "_steps is only available if using the after step hook 'AfterStep (Hook Function)' found in our git repo: https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/afterstep.js" } : _steps;

var testResult = {
    "TestName": test_name,
    "ProjectID": project_id,
    "TestID": test_id,
    "Branch": branch,
    "ResultID": result_id,
    "ResultURL": result_url,
    "BaseURL": BASE_URL,
    "TestRunDate" : Date(),
    "TestData": test_data,
    "TestStatus": (typeof _stepInternalData.failureReason === 'undefined') ? "PASSED" : "FAILED",
    "TestStatusDetails": test_status_details,
    "NetworkRequestStats": network_request_stats,
    "_stepData": _stepData,
    "_stepInternalData": _stepInternalData,
    "Steps": steps,
}

console.log("\n==================================== Test Results ==========================================\n" + JSON.stringify(testResult) + "\n==============================================================================\n");

/* Write results to DB
 */
var resultData = {
    "TestName": testResult.TestName,
    "TestRunDate": testResult.TestRunDate,
    "Branch": testResult.Branch,
    "BaseURL": testResult.BaseURL,
    "TestStatus": testResult.TestStatus,
    "TestStatusDetails": testResult.TestStatusDetails,
    "ProjectID": testResult.ProjectID,
    "TestID": testResult.TestID,
    "ResultID": testResult.ResultID,
    "ResultURL": testResult.ResultURL,
    "TestResultsJSON": testResult,
    "TestDataJSON": test_data,
    "TestPerformanceJSON": test_transactions,
    "NetworkRequestStats": network_request_stats,
    "_stepData": _stepData,
    "_stepInternalData": _stepInternalData,
    "Steps": steps,
}

let database;
let driver = 'disk';
let path = '.';
let options = {
    "path": path,
    "driver": driver,
}
let collectionName = 'TestResults';

/* Write the results to JSONDBFS
 */
function getCount(database, collectionName) {

    return new Promise((resolve) => {
        database[collectionName].count(function (err, count) {
            console.log("count", count);
            resolve(count);
        });
    });

}
function insertResults(database, collectionName, rowData) {

    return new Promise((resolve) => {
        database[collectionName].update({ "resultId": result_id }, rowData, { upsert: true, multi: true, retObj: true }, (err, document) => {
            resolve(document);
        });
    });
}

return new Promise((resolve, reject) => {

    JSONDBFSDriver.connect([collectionName], options, (err, db) => {

        database = db;
        insertResults(database, collectionName, resultData)
            .then((document) => {
                return getCount(database, collectionName, resolve);
            })
            .then((count) => {
                resolve(count);
            });

    });

});

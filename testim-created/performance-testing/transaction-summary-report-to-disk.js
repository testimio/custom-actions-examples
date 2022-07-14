/**
 * Transaction Summary Report To File
 * 
 *      Log/Report all transactions to disk in an HTML format
 * 
 * Parameters
 *      reportFilePath (JS) : Fullpath to file to create and write the data to
 *      showOpenTransactions  (JS) [optional] : Include open and scratch transactions created by step hooks 
 * 
 *  Notes
 *      Output to console is done using a console.table command and is best visualized in the chrome debugger
 * 
 *      This creates a VERY basic HTML file.  Nothing fancy, just functional.  
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      CLI Action
 * 
 **/

/* eslint-disable no-var */
/* global reportFilePath, showOpenTransactions, transactions, networkRequestStats */

var verbose = false;

var filePath = undefined; // 'C:\\Temp\\Transaction Report.html';
if (typeof reportFilePath !== 'undefined')
    filePath = reportFilePath;
if (typeof filePath === 'undefined' || filePath === null)
    throw new Error('reportFilePath is undefined');

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
loadModules(["fs"]);

function json2table(json, tableClassNames) {
    
    let cols = Object.keys(json[0]);

    let headerRow = '';
    let bodyRows = '';

    let classes = tableClassNames || '';

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    cols.map(function (col) {
        headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>\n';
    });

    json.map(function (row) {
        bodyRows += '<tr>\n';

        cols.map(function (colName) {
            bodyRows += '<td>' + row[colName] + '</td>\n';
        })

        bodyRows += '</tr>\n';
    });

    return '<table class="' +
        classes +
        '"><thead>\n<tr>\n' +
        headerRow +
        '</tr>\n</thead>\n<tbody>\n' +
        bodyRows +
        '</tbody>\n</table>\n';
}

/**** DEBUG ****

// Uncomment this DEBUG block to run this as a regular step for initial debugging.  
// Note, if uncommented and used in both a the test case and as a hook function then the following error will occur in the hook instance:
//     SyntaxError: Identifier '_stepData' has already been declared
//   Not a biggie, just something to be aware of
//
var exportsTest = {};
let _stepData = { testName: 'Demo - Performance Testing' }
let _stepInternalData = {
    hookType: 'afterTest',
    projectId: 'YOUR_PROJECT_ID',
    branch: 'master',
    testId: 'THE_TEST_ID',
    testResultId: 'THE_TEST_RESULT_ID',
    failureReason: "Expected: 'Hello, Nicole'. Actual: 'Hello, John '",
    errorType: 'text-compare-failure'
}

var transactions = [{ "duration": 2.632, "endTime": "2022-04-21T21:19:35.498Z", "startTime": "2022-04-21T21:19:32.866Z", "status": "Complete", "transactionName": "Click \"LOG IN\"", "type": "Step" }, { "duration": 23.96, "endTime": "2022-04-21T21:19:57.359Z", "startTime": "2022-04-21T21:19:33.399Z", "status": "Complete", "transactionName": "Login", "type": "User" }, { "duration": 2.535, "endTime": "2022-04-21T21:19:38.846Z", "startTime": "2022-04-21T21:19:36.311Z", "status": "Complete", "transactionName": "Resize", "type": "Step" }, { "duration": 0.841, "endTime": "2022-04-21T21:19:40.403Z", "startTime": "2022-04-21T21:19:39.562Z", "status": "Complete", "transactionName": "Click", "type": "Step" }, { "duration": 1.049, "endTime": "2022-04-21T21:19:42.307Z", "startTime": "2022-04-21T21:19:41.258Z", "status": "Complete", "transactionName": "Set text", "type": "Step" }, { "duration": 0.552, "endTime": "2022-04-21T21:19:43.613Z", "startTime": "2022-04-21T21:19:43.061Z", "status": "Complete", "transactionName": "Click", "type": "Step" }, { "duration": 0.807, "endTime": "2022-04-21T21:19:45.170Z", "startTime": "2022-04-21T21:19:44.363Z", "status": "Complete", "transactionName": "Set password", "type": "Step" }, { "duration": 0.783, "endTime": "2022-04-21T21:19:46.717Z", "startTime": "2022-04-21T21:19:45.934Z", "status": "Complete", "transactionName": "Click", "type": "Step" }, { "duration": 0.786, "endTime": "2022-04-21T21:19:48.226Z", "startTime": "2022-04-21T21:19:47.440Z", "status": "Complete", "transactionName": "Set password", "type": "Step" }, { "duration": 0.783, "endTime": "2022-04-21T21:19:49.732Z", "startTime": "2022-04-21T21:19:48.949Z", "status": "Complete", "transactionName": "Click", "type": "Step" }, { "duration": 0.772, "endTime": "2022-04-21T21:19:51.231Z", "startTime": "2022-04-21T21:19:50.459Z", "status": "Complete", "transactionName": "Set password", "type": "Step" }, { "duration": 1.081, "endTime": "2022-04-21T21:19:53.053Z", "startTime": "2022-04-21T21:19:51.972Z", "status": "Complete", "transactionName": "Set password", "type": "Step" }, { "duration": 0.801, "endTime": "2022-04-21T21:19:54.575Z", "startTime": "2022-04-21T21:19:53.774Z", "status": "Complete", "transactionName": "Click", "type": "Step" }, { "duration": 0.785, "endTime": "2022-04-21T21:19:55.927Z", "startTime": "2022-04-21T21:19:55.142Z", "status": "Complete", "transactionName": "Click \"LOG IN\"", "type": "Step" }, { "duration": 3.28, "endTime": "2022-04-21T21:20:00.126Z", "startTime": "2022-04-21T21:19:56.846Z", "status": "Complete", "transactionName": "Sleep", "type": "Step" }, { "duration": 6.283, "endTime": "2022-04-21T21:20:07.364Z", "startTime": "2022-04-21T21:20:01.081Z", "status": "Complete", "transactionName": "Click", "type": "Step" }, { "duration": 0, "endTime": null, "startTime": "2022-04-21T21:20:01.594Z", "status": "Open", "transactionName": "T1", "type": "User" }, { "duration": 9.3, "endTime": "2022-04-21T21:20:12.859Z", "startTime": "2022-04-21T21:20:03.559Z", "status": "Complete", "transactionName": "T2", "type": "User" }, { "duration": 0, "endTime": null, "startTime": "2022-04-21T21:20:05.527Z", "status": "Open", "transactionName": "T3", "type": "User" }, { "duration": 0.592, "endTime": "2022-04-21T21:20:08.724Z", "startTime": "2022-04-21T21:20:08.132Z", "status": "Complete", "transactionName": "Click \"28\"", "type": "Step" }, { "duration": 0.539, "endTime": "2022-04-21T21:20:10.002Z", "startTime": "2022-04-21T21:20:09.463Z", "status": "Complete", "transactionName": "Click \"28\"", "type": "Step" }, { "duration": 0.572, "endTime": "2022-04-21T21:20:11.304Z", "startTime": "2022-04-21T21:20:10.732Z", "status": "Complete", "transactionName": "Click \"OK\"", "type": "Step" }, { "duration": 0, "endTime": null, "startTime": "2022-04-21T21:20:12.299Z", "status": "Open", "transactionName": "_stepData", "type": "Step" }];

/**** DEBUG ****/

var reportStyleMarkup =
    "html { scroll-behavior: smooth; } " +
    ".outer-div { width: 97%; margin: 10px; padding: 5px; overflow-x: hidden; } " +
    ".transactions { width: 97%; margin: 10px; padding: 5px; overflow-x: hidden; text-align: left; border: 1px silver solid; } "
    ;

var transaction_report = "<html>\n";

transaction_report += "<head>\n";

transaction_report += "  <style> " + reportStyleMarkup + "</style>";

transaction_report += "</head>\n";

transaction_report += "<body>\n";

/* Filter Scratch Transactions created by step hooks 
 */
if (typeof showOpenTransactions === 'undefined' || showOpenTransactions == null || showOpenTransactions === false) {

    if (transactions !== null && transactions.length > 0) {

        transactions = transactions.filter((transaction) => {

            let keep = (transaction.transactionName !== "_stepData" && transaction.status !== "Open")
            if (transaction.transactionName == "_stepData" && transaction.status == "Open")
                keep = false;
            if (transaction.transactionName == "Transaction" && transaction.status == "Open")
                keep = false;

            return keep;

        });

    }
}

let test_name = (_stepData.testName !== "" ? _stepData.testName : 'NoName TestName');

var project_id = ((typeof _stepInternalData.projectId === 'undefined') ? null : _stepInternalData.projectId);
var test_id = ((typeof _stepInternalData.testId === 'undefined') ? null : _stepInternalData.testId);
var branch = ((typeof _stepInternalData.branch === 'undefined') ? null : _stepInternalData.branch);
var result_id = ((typeof _stepInternalData.testResultId === 'undefined') ? null : _stepInternalData.testResultId);
var result_url = (project_id === null || test_id === null || branch === null || result_id === null) ? null : "https://app.testim.io/#/project/" + project_id + "/branch/" + branch + "/test/" + test_id + "?result-id=" + result_id;

function htmlReportTestInfoHeaderCreate() {

    let testInfo = "";

    testInfo += "  <table class='styled-table test-info'>\n";

    testInfo += "    <tr>\n";
    testInfo += "      <td class='test-info-label'>&nbsp;</td>"
    testInfo += "      <td class='test-info-label'><b>Test</b></td>"
        + "<td>"
        + "<a target='blank' href='https://app.testim.io/#/project/" + project_id + "/branch/" + branch + "/test/" + test_id + "' target='_blank'>"
        + test_name
        + "</a>"
        + "</td>\n";
    testInfo += "    </tr>\n";

    testInfo += "    </tr>\n";
    testInfo += "      <td class='test-info-label'>&nbsp;</td>"
    testInfo += "      <td><b>Date Run</b></td><td>" + transactions[0].startTime + "</td>\n";
    testInfo += "    </tr>\n";

    testInfo += "  </table>\n";

    return testInfo;
}

transaction_report += htmlReportTestInfoHeaderCreate();

/* Create Transactions table
 */
if (transactions !== null && transactions.length > 0) {
    transaction_report += " <hr/>\n";
    transaction_report += " <h2>Transaction Summary Report</h1>\n";
    transaction_report += " <hr/>\n";
    transaction_report += json2table(transactions, 'transactions');
}

/* If networkRequestStats is defined the include it
 */
if (typeof networkRequestStats !== 'undefined' && networkRequestStats !== null) {
    transaction_report += " <hr/>\n";
    transaction_report += " <h3>Network Performance Summary<h2>\n";
    transaction_report += " <hr/>\n";
    transaction_report += json2table(networkRequestStats.sort((a, b) => b.maxDuration - a.maxDuration), 'networkRequestStats');
}

transaction_report += "\n</html>";

exportsTest.transactions = transactions;

transaction_report += "<hr/>\n";

if (verbose)
    console.log(transaction_report);

return new Promise((resolve, reject) => {

    // write to a new file named filePath
    fs.writeFile(filePath, transaction_report, (err) => {

        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log(`transaction_report saved to "${filePath}"`);

    });

});

console.log("=====================================================================");

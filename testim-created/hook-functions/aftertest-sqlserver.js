/**
 *  After Test Hook - SQL Server
 *
 *      Collect test results gathered during a test run and insert into a SQL Database table
 *
 *  Parameters
 *
 *      sql (NPM)   - mssql@latest
 * 
 *  Notes
 * 
 *      Use this with "AfterStep" hooks if you wish to include detailed step information with reported results
 * 
 *  Base Step
 *      Custom CLI Action
 * 
 *  Installation
 *      Create a new "Custom CLI Action"
 *      Name it "After Test Hook - SQL Server" or base it on the target reporting system. 
 *      Add the parameter 
 *          sql (NPM) and set it to mssql@latest
 *      Set the new custom CLI action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Assign this step as an "After Test" hook in the configuration
 *      Save the test
 *      Bob's your uncle
 *
 **/

 // console.log("TEST LEVEL - AfterTest - SQL Server");

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
 var steps = (typeof _steps === 'undefined') ? { "NoStepData" : "_steps is only available if using the after step hook 'AfterStep (Hook Function)' found in our git repo: https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/afterstep.js"} : _steps;
 
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
 var query = "insert into [TestResults] ([TestName], [Branch], [TestRunDate], [BaseURL], [TestStatus], [TestStatusDetails], [ProjectID], [TestID], [ResultID], [ResultURL], [TestResultsJSON], [TestDataJSON], [TestPerformanceJSON], [NetworkRequestStats]) values ('"
     + testResult.TestName + "','"
     + testResult.Branch + "','"
     + testResult.TestRunDate + "','"
     + testResult.BaseURL + "','"
     + testResult.TestStatus + "','"
     + testResult.TestStatusDetails + "','"
     + testResult.ProjectID + "','"
     + testResult.TestID + "','"
     + testResult.ResultID + "','"
     + testResult.ResultURL + "','"
     + JSON.stringify(testResult).replace(/\'/g, "''") + "'"
     + "," + ((test_data !== null) ? "'" + JSON.stringify(test_data).replace(/\'/g, "''") + "'" : "null")
     + "," + ((test_transactions !== null) ? "'" + JSON.stringify(test_transactions).replace(/\'/g, "''") + "'" : "null")
     + "," + ((network_request_stats !== null) ? "'" + JSON.stringify(network_request_stats).replace(/\'/g, "''") + "'" : "null")
     + ")";
 
 console.log("SQL Insert Query: ", query);
 
 const config = {
     user: 'TestimSQL',
     password: 'wh4t3v3r4!',
     server: 'AuggieTheDoggie', // You can use 'localhost\\instance' to connect to named instance
     database: 'TestData',
     options: {
         enableArithAbort: true,
         trustServerCertificate: true,
     }
 }
 
 /* Write the results to the clipboard
  */
 // clipboardy.writeSync(JSON.stringify(testResult));
 
 /* Write the results to SQL Server
  */
 return new Promise((resolve, reject) => {
 
     sql.connect(config).then(() => {
 
         return sql.query(query) // where id = ${value}`
 
     }).then(result => {
 
         // console.log(result)
         resolve();
 
     }).catch(err => {
 
         reject(err.message);
 
     })
 
 });
 
 /** SQL Result Table Creation

        SET ANSI_NULLS ON
        GO

        SET QUOTED_IDENTIFIER ON
        GO

        CREATE TABLE [dbo].[TestResults](
            [ID] [int] IDENTITY(1,1) NOT NULL,
            [CreateDate] [datetime] NOT NULL,
            [TestName] [varchar](256) NOT NULL,
            [Branch] [varchar](256) NOT NULL,
            [TestStatus] [varchar](256) NOT NULL,
            [TestStatusDetails] [varchar](256) NULL,
            [BaseURL] [varchar](256) NOT NULL,
            [TestRunDate] [datetime] NULL,
            [TestID] [varchar](50) NULL,
            [ProjectID] [varchar](50) NULL,
            [ResultID] [varchar](50) NULL,
            [ResultURL] [varchar](1024) NULL,
            [TestResultsJSON] [varchar](max) NOT NULL,
            [TestDataJSON] [varchar](max) NULL,
            [TestPerformanceJSON] [varchar](max) NULL,
            [NetworkRequestStats] [varchar](max) NULL,
        CONSTRAINT [PK_TestResults] PRIMARY KEY CLUSTERED 
        (
            [ID] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
        ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
        GO

        ALTER TABLE [dbo].[TestResults] ADD  CONSTRAINT [DF_TestResults_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
        GO

        ALTER TABLE [dbo].[TestResults] ADD  CONSTRAINT [DF_TestResults_Branch]  DEFAULT ('master') FOR [Branch]
        GO
  
 **/
 
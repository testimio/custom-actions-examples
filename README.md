# custom-actions-examples
This is a repository of custom action steps that work with Testim.io

These are not officially supported by Testim, but rather examples to try and modify to fit your specific test cases. 

If you have an idea for a custom action example feel free to submit a GitHub issue. 

Initially it includes custom action steps (JavaScript) that we have created for customers. The code can be copied from here and added to a custom step in a Testim test. Instructions on how to use each example are included in the linked file with the JavaScript code needed. Typically it will involve copying the file and code into a custom step, making a change or two to the properties panel, checking your variables, and perhaps pointing to the correct element. 

[**Element Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element)

[Classes Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/classes-get.js) - Get an element's class list as a string array

[Element(ByText) - Click](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/element-bytext-click.js) - Find an element by Text and click it

[Element(ByXPath) - Click](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/element-byxpath-click.js) - Find an element by XPath and click it

[Element(ByXPath) - Wait Exists](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/element-byxpath-wait-exists.js) - Wait for an element by XPath to be found in the DOM

[Element(ByCSS) - Click](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/element-bycss-click.js) - Find an element by CSS and click it

[Element Neighbor Click/Select](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/element-neighbor-click.js) - Find an element by AI/Text/XPath or CSS and optionally a neighboring element based on xpath or relative position

[Element Select Text](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/element-select-text.js) - Select text within an element based on index or substring matches

[Element Value Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/element-value-validate.js) - Validate an element's value/text using numeric, statistical or text comparison expressions

[Element Computed Style(s) - Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/validate-computed-style.js) - Validate a superset/subset of style for an element

[Element - Image Capture-Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/element-image-capture-validate.js) - Capture an image of a DOM element and optionally validate

[isEnabled](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/is-enabled.js) - Vaildate that an element is enabled (or disabled)

[isVisible](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/is-visible.js) - Vaildate that an element is visible

[Element - Wait Not Visible](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/element-wait-not-visible.js) -  Wait for an element to optionally display and then to be hidden. 

[isPlaying](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/is-playing.js) - Validate that a video/media element is currently playing video (or not)

[hasAttribute](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/has-attribute.js) - Validate that an element does/does not have an attribute defined and optionally validate its value

[hasClass](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/has-class.js) - Check if an element's class list includes certain expected classes

[Checkbox - Check](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/checkbox-check.js) - Check/Uncheck/Toggle a checkbox.  Supports custom checkbox controls and states (some assembly required)

[Checkbox - Validate Checked](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/checkbox-validate-checked.js) - Validate a checkbox is checked/unchecked.  

<br/>

[**OCR Functions**](https://github.com/testimio/custom-actions-examples/tree/main/testim-created/ocr)

[OCR - Element Text Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/ocr/ocr-element-text-get.js) - Read text from an element's image

[OCR - Element Text validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/ocr/ocr-element-text-validate.js) - Read/validate the text from an element's image

<br/>

[**Data Generation, Encryption and Redaction**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/)

[Excel - Import Data](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/excel-import-data.js) - Process Excel download file and save sheet data values as test data variable (testData)

[Excel - Import File](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/excel-import-file.js) - Read Excel file for use as test data variable (excelData)

[Generate Faked Data](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/generate-faked-data.js) (faker.js) - Uses the faker.js library to create fake test data. 

[Redact data](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/redact-data.js) - This custom step creates an overlay element to prevent screenshot capture of private data.

[Set Text (Redacted)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/text-set-redacted.js) -  Redacts a field and then sets its text

[Set Text Encrypted(Reference)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/text-set-encrypted.js) -  Use encrypted test data to set a text field (optionally redact field to protect PII from screenshots

[Text Encrypt (Reference)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/text-encrypt.js) -  Encrypts plain text for use by "Set Text Encrypted" sister step

[Environment Variables Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/environment-variables-get.js) -  Get process environment variables

[S3 - Bucket Data Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/s3-bucket-data-get.js) -  Retrieve data from an AWS S3 Bucket 

[S3 - Bucket Data Put](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-data/s3-bucket-data-put.js) -  Put data into an AWS S3 bucket

<br/>

[**Database Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/)

[MongoDB Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/mongodb-query.js) - Execute a MongoDB Query and return results

[MySQL Server Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/mysql-query.js) - Execute a MySQL Query and return results

[SQL Server Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/sqlserver-query.js) - Execute a SQL Server Query and return results

[SQL Server - Results Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/sqlserver-validate-results.js) - Execute a SQL Server query, validate and return results

[JSONDBFS Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/jsfsdb-query.js) - Read/write data from/to local json files on disk using NoSQL query syntax.

[Postgres Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/postgres-query.js) - Execute a Postgres DB Query and return results

[Oracle Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/oracle-query.js) - Execute an Oracle DB Query and return results

[indexedDB - Clear](https://github.com/testimio/custom-actions-examples/blob/main/user-created/indexeddb-clear.js) - Clear all ObjectStores from the named indexedDB database

<br/>

[**API**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/)

[AzureDevOps wiQL Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/azure-devops/azure-devops-wiql-query.js) - Execute a wiQL (Work Item Query Language) query in Azure DevOps and return results

[AzureDevOps WorkItem Create/Update](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/azure-devops/azure-devops-workitem-create-update.js) - Create or Update a Work Item in Azure DevOps

[SOAP Request](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/soap-request.js) - Execute a SOAP request and return results

[graphQL Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/graphQL-query.js) - Execute a graphQL Query and return results

[API Request](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/database-apis/api-request.js) - Make an API call and return results to Testim.

<br/>

[**PDF Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/pdf/)

[PDF - Download-Process-Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/pdf/pdf-process-validate.js) - Download, parse and optionally validate a PDF document

[PDF - Fields/Texts Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/pdf/pdf-fields-textblocks-validate.js) - Validates text blocks and fields using pdfDocumentTexts and pdfDocumentFields from "Download-Process-Validate PDF" step

<br/>

[**Debugging Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/)

[Debug Popup](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/debug-popup.js) - Displays <message> in a modal popup window for debugging purposes

[Watchlist Popup](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/watchlist-popup.js) - Display Testim and User defined variables in a popup window (div)

<br/>

[**Browser Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/)

[Popup Killer](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/popup-killer.js) - When you don't know when a popup modal will kill your test, use this to handle it.

[Alert Override](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/browser/alert-override.js) - Overrides the window.alert function to dispaly an alert as a popup div to enable validation of javascript alert

[Open New Tab/Window](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/browser/open-new-tab-window.js) - Open a url in a new tab or window

[Cookies Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/browser/cookies-get.js) - Get all cookies and return in currentCookies

[Cookies Clear](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/browser/cookies-clear.js) - Clears all cookies 

[Cookies Session Clear](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/browser/cookies-session-clear.js) - Clears all cookies, sessionStorage and localStorage

[Validate Current URL](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/browser/validate-current-url.js) - Validates the current page's URL

[Validate Current Title](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/browser/validate-current-title.js) - Validates the current page's title

[Console Log - Override](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/browser/console-log-override.js) - Override Console Log/Warn/Err/Debug and window onerror to capture all subsequent log output.

[Console Log - Validate Text](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/browser/console-log-validate-text.js) - Validates the console log output captured via "Console Log - Override" 

<br/>

[**Hook Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/)

[AfterStep (Hook Function)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/afterstep.js) - Collect step information for AfterTest reporting

[AfterStep - Extended (Hook Function)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/afterstep-extended.js) - Collect enhanced step information for AfterTest reporting

[AfterTest - Azure Devops (Hook Function)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/aftertest-azure-devops.js) - Create a new or update an existing work item (bug) with test results

[After Test Hook - SQL Server (Hook Function)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/aftertest-sqlserver.js) - Collect test results gathered during a test run and insert into a SQL Server database table

[After Test Hook - JSONDBFS (Hook Function)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/aftertest-jsondbfs.js) - Collect test results gathered during a test run and insert into a JSONDBFS Database Collection (file)

<br/>

[**Performance Testing**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/)

[Transaction Begin](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/transaction-begin.js) - Start a transaction.

[Transaction End](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/transaction-end.js) - End a transaction.

[Transaction Summary Report](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/transaction-summary-report.js) - Log/Report all transactions.

[Transaction Summary Report To File](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/transaction-summary-report-to-disk.js) - Log/Report all transactions to disk in an HTML format.

[Network Performance Checker](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/network-performance-checker.js) - Validate that all network requests are completed under maxResponseTime milliseconds. 

[Network Performance Summary](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/network-performance-summary.js) - Creates a summary of network requests with min/max/avg duration and request size. 

<br/>

[**Test Reporting and Analysis**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-reporting-analysis/)

[Testim Test Result Report Generator](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/test-reporting-analysis/testim-test-result-report-generate.js) - Generate Detailed HTML/PDF Test Report(s) with optional screenshots, test data and network summary performance data

[AfterStep - Extended (Hook Function)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/afterstep-extended.js) - Collect enhanced step information for AfterTest reporting

[After Test Hook - JSONDBFS (Hook Function)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/aftertest-jsondbfs.js) - Collect test results gathered during a test run and insert into a JSONDBFS Database Collection (file)

[After Test Hook - SQL Server (Hook Function)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/aftertest-sqlserver.js) - Collect test results gathered during a test run and insert into a SQL Server database table

[Network Performance Summary](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/network-performance-summary.js) - Creates a summary of network requests with min/max/avg duration and request size that can be included in the test report. 

<br/>

[**Select List Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/select-list/)

[Select List - Items Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/select-list/select-list-items-get.js) - Return items (option/li/custom) from a select/ol/ul/custom element

[Select List - Items Select](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/select-list/select-list-items-select.js) - Select an item by value or text (select/option, ul/li)

[Select List - Items Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/select-list/select-list-items-validate.js) - Validate that expected items are in a list/select.


[Select List - Items Order Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/select-list/select-list-items-order-validate.js) -  Validate the items (option/li/<custom>) from a (select/ol/ul/<custom>) element are sorted properly.

[Select List - Selected Items Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/select-list/select-list-items-selected-validate.js) - Validate the selected item(s) text, value, misc attribute(s) are correct.

<br/>

[**Table Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/)

[Table - Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-validate.js) - Validate table cell content

[Table - Cells Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-cells-get.js) - Get all table cell values

[Table - Cell Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-cell-get.js) - Get the content a specific cell within a specific row in a table

[Table - Cell Click](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-cell-click.js) - Click on a specific cell within a specific row in a table

[Table Cell - Set Text](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-cell-set-text.js) - Sets the text of a specific cell within a specific row in a table

[Table - Column Order Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-column-order-validate.js) - Validate the values in a column are sorted properly

[Table - Row Count Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-row-count-validate.js) - Validate number of rows in a table

[Table - Column Sum Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-column-sum-validate.js) - Calculate and verify the sum of all numerical values in a specific column

[Table - Column Sum Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-column-sum-get.js) - Calculate the sum of all numerical values in a specific column

<br/>

[**Validation Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/validation-functions/)

[Link Checker](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/validation-functions/link-checker.js) (CLI) - Finds links at the given URL and validates that they are working. 

[Network Validate Request](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/network/network-validate-requests.js) - Validate that network requests were made and optionally validate response status(es) and/or request(s) are not slower than maxDuration (ms).

[Numeric Expression Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/validation-functions/numeric-expression-validate.js) - Validate a value using numeric expressions ">", ">=", "==", "<", "<=".

[Email - Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/email/email-validate.js) -  Process email inbox and validate/parse last message for subject/body and optional regex to pull specific data and links

[Validate Currency](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/validation-functions/validate-currency.js) - Validate that an element displays an expected value formatted as currency.

[Validate HTML Markup](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/validation-functions/validate-html-markup.js) - Validates the current page's HTML markup contains certain markup.

<br/>

[**Misc Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/)

[Shell Command Execute](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/shell-command-execute.js) - Runs a shell command and returns stdout

[Java Executor](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/java/java-executor.js) - Execute a java method/function in a given jar file

[Python Program Execute](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/python-program-execute.js) - Execute a Python program and return stdout, exit signal and exit code

[Excel365 - Grid Cell Mapping Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/excel365-grid-cell-mapping-get.js) - Using Column and Row Headers Get coordinates of visible cells.  Can be used with Click and Double Click actions to set cell values.

[File Upload - Set File](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/element/file-upload-override.js) - Create/Set a file upload with custom data.  

File upload 

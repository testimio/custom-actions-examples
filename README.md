# custom-actions-examples
This is a repository of custom action steps that work with Testim.io

These are not officially supported by Testim, but rather examples to try and modify to fit your specific test cases. 

If you have an idea for a custom action example feel free to submit a GitHub issue. 

Initially it includes custom action steps (JavaScript) that we have created for customers. The code can be copied from here and added to a custom step in a Testim test. Instructions on how to use each example are included in the linked file with the JavaScript code needed. Typically it will involve copying the file and code into a custom step, making a change or two to the properties panel, checking your variables, and perhaps pointing to the correct element. 


[**Element Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/)

[Classes Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/classes-get.js) - Get an element's class list as a string array

[Classes Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/classes-validate.js) - Check if an element's class list includes certain expected classes

[Element Computed Style(s) - Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/validate-computed-style.js) - Validate a superset/subset of style for an element


[**Data Generation and Redaction**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/)

[Excel - Import Data](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/excel-import-data.js) - Process Excel download file and save sheet data values as test data (testData)

[Generate Faked Data](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/generate-faked-data.js) (faker.js) - Uses the faker.js library to create fake test data. 

[Redact data](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/redact-data.js) - This custom step creates an overlay element to prevent screenshot capture of private data.


[**Validation Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/)

[Image Element Capture-Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/image-element-capture-validate.js) - Capture an image of a DOM element and optionally validate (pixel exact match)

[Link Checker](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/link-checker.js) (CLI) - Finds links at the given URL and validates that they are working. 

[Network Validate Request](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/network-validate.js) - Validate that a network request returns the proper status and/or is not slower than maxDuration (ms).


[**Database Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/)

[graphQL Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/graphQL-query.js) - Execute a graphQL Query and return results

[MongoDB Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/mongodb-query.js) - Execute a MongoDB Query and return results

[MySQL Server Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/mysql-query.js) - Execute a MySQL Query and return results

[SQL Server Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/sqlserver-query.js) - Execute a SQL Server Query and return results

[SQL Server - Results Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/sqlserver-validate-results.js) - Execute a SQL Server query, validate and return results



[**API**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/)

[AzureDevOps wiQL Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/azure-devops-wiql-query.js) - Execute a wiQL (Work Item Query Language) query in Azure DevOps and return results

[AzureDevOps WorkItem Create/Update](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/azure-devops-workitem-create-update.js) - Create or Update a Work Item in Azure DevOps


[**PDF Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/)

[PDF - Download-Process-Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/pdf-validation.js) - Download, parse and validate a PDF document

[PDF - Fields/Texts Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/pdf-fields-textblocks-validate.js) - Validates text blocks and fields using pdfDocumentTexts and pdfDocumentFields from "Download-Process-Validate PDF" step


[**Select/Listbox Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/)

[Select Items/Options](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/select-items-options.js) - Select an item by value or text (select/option, ul/li)

[Select Items/Options - Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/validate-select-items.js) - Validate that expected items are in a list/select.

[Select Items/Options Order - Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/select-order-validate.js) - Validates that the items in a list are sorted properly.


[**Debuging Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/)

[Debug Popup](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/debug-popup.js) - Displays <message> in a modal popup window for debugging purposes

[Watchlist Popup](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/watchlist-popup.js) - Display Testim and User defined variables in a popup window (div)


[**Browser Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/)

[Popup Killer](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/popup-killer.js) - When you don't know when a popup modal will kill your test, use this to handle it.

[Alert Override](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/alert-override.js) - Overrides the window.alert function to dispaly an alert as a popup div to enable validation of javascript alert


[**Hook Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/)

[AfterStep (Hook Function)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/afterstep.js) - Collect step information for AfterTest reporting

[AfterTest - Azure Devops (Hook Function)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hook-functions/aftertest-azure-devops.js) - Create a new or update an existing work item (bug) with test results


[**Performance Testing**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/)

[Transaction Begin](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/transaction-begin.js) - Start a transaction.

[Transaction End](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/transaction-end.js) - End a transaction.

[Transaction Summary Report](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/transaction-summary-report.js) - Log/Report all transactions.

[Network Performance Checker](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/network-performance-checker.js) - Validate that all network requests are completed under maxResponseTime milliseconds. 

[Network Performance Summary](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/performance-testing/network-performance-summary.js) - Creates a summary of network requests with min/max/avg duration and request size. 


[**Table Functions**](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/)

[Table - Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-validate.js) - Validate table cell content

[Table - Cells Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-cells-get.js) - Get all table cell values

[Table - Cell Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-cell-get.js) - Get the content a specific cell within a specific row in a table

[Table - Cell Click](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-cell-click.js) - Click on a specific cell within a specific row in a table

[Table - Column Order Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-functions/table-column-order-validate.js) - Validate the values in a column are sorted properly

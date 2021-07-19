# custom-actions-examples
This is a repository of custom action steps that work with Testim.io

These are not officially supported by Testim, but rather examples to try and modify to fit your specific test cases. 

If you have an idea for a custom action example feel free to submit a GitHub issue. 

Initially it includes custom action steps (JavaScript) that we have created for customers. The code can be copied from here and added to a custom step in a Testim test. Instructions on how to use each example are included in the linked file with the JavaScript code needed. Typically it will involve copying the file and code into a custom step, making a change or two to the properties panel, checking your variables, and perhaps pointing to the correct element. 

[AzureDevOps wiQL Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/azure-devops-wiql-query.js) - Execute a wiQL (Work Item Query Language) query in Azure DevOps and return results

[AzureDevOps WorkItem Create/Update](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/azure-devops-workitem-create-update.js) - Create or Update a Work Item in Azure DevOps

[Debug Popup](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/debug-popup.js) - Displays <message> in a modal popup window for debugging purposes

[Excel - Import Data](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/excel-import-data.js) - Process Excel download file and save sheet data values as test data (testData)

[Generate Faked Data](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/generate-faked-data.js) (faker.js) - Uses the faker.js library to create fake test data. 

[graphQL Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/graphQL-query.js) - Execute a graphQL Query and return results

[hasClass](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/hasClass.js) - Check if an element's class list includes certain expected classes

[Image Element Capture-Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/image-element-capture-validate.js) - Capture an image of a DOM element and optionally validate (pixel exact match)

[Link Checker](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/link-checker.js) (CLI) - Finds links at the given URL and validates that they are working. 

[MongoDB Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/mongodb-query.js) - Execute a MongoDB Query and return results

[MySQL Server Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/mysql-query.js) - Execute a MySQL Query and return results

[Network Performance Checker](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/network-performance-checker.js) - Validate that all network requests are completed under maxResponseTime milliseconds. 

[Network Performance Summary](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/network-performance-summary.js) - Creates a summary of network requests with min/max/avg duration and request size. 

[Network Validate Request](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/network-validate.js) - Validate that a network request returns the proper status and/or is not slower than maxDuration (ms).

[PDF - Download-Process-Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/pdf-validation.js) - Download, parse and validate a PDF document

[PDF - Fields/Texts Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/pdf-fields-textblocks-validate.js) - Validates text blocks and fields using pdfDocumentTexts and pdfDocumentFields from "Download-Process-Validate PDF" step

[Popup Killer](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/popup-killer.js) - When you don't know when a popup modal will kill your test, use this to handle it.

[Redact data](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/redact-data.js) - This custom step creates an overlay element to prevent screenshot capture of private data.

[Select Item/Option by Text/Value](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/select-by-text.js) - Select an item by value or text (select/option, ul/li. table/tr)

[SQL Server Query](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/sqlserver-query.js) - Execute a SQL Server Query and return results

[SQL Server - Results Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/sqlserver-validate-results.js) - Execute a SQL Server query, validate and return results

[Table - Cells Get](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-cells-get.js) - Return table cell values in a structured format

[Table - Cells Validate](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-cells-validate.js) - Validate table cell content

[Table - Cell Click](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/table-cell-click.js) - Click a specific cell within a specific row in a table

[Validate Select Items/Options](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/validate-select-items.js) - Validate that expected items are in a list/select.

[Validate Select Items/Options Order](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/select-order-validate.js) - Validates that the items in a list are sorted properly.

[Validate Element Computed Style(s)](https://github.com/testimio/custom-actions-examples/blob/main/testim-created/validate-computed-style.js) - Validate a superset/subset of style for an element


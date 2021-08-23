/**
 *  Table - Validate
 *
 *      Validate table content
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) either a <table> or <ag-grid> 
 *      returnVariableName (JS) : string name of variable to store actual values in that can be used for setting expetedValues
 *      expectedValues (JS) : expected cell values in the following format:
 * 
 *                              [
 *                                {"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                               ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                               ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                              ]
 * 
 *                            or for more advanced options
 * 
 *                              {
 *                                  "options": {
 *                                      "PK": null,
 *                                      "matchType": "exact"
 *                                  },
 *                                  "expectedValues": [
 *                                                      {"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                                                     ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                                                     ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                                                    ]
 *                              }
 * 
 *      primaryKey (JS) [optional]
 *      matchType [optional] : Text match type when searching for text in lists/selects
 *		            Examples: exact (default), startswith, endswith, includes 
 *      
 * Returns
 * 
 *      actualItems (or returnVariableName if specified) will contain actual cell values
 * 
 *  Notes
 * 
 *      Supports both html tables and ag-grid
 *          ag-grid example - https://www.ag-grid.com/javascript-grid/cell-rendering/#example-dynamic-rendering-component
 *      When run without expectedValues being set the step will pass and simply return the actual values
 *          The data will be in the clipboard and the variable actualItems (or returnVariableName if specified)
 *      If you set PK then validation of that entry will be row specific by PK
 *                      
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Items/Options/Cells - Validate"
 *      Create parameters
 *          element (HTML)
 *          returnVariableName (JS) [optional]
 *          expectedValues (JS)
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals document, element, expectedValues, returnVariableName */

let verbose = true;

let grid_header_css = "div[role='columnheader']";
let grid_css = "div[role='grid']";
let grid_rowgroup_css = "div[role='rowgroup']";
let grid_row_css = "div[role='row']";

//let grid_header_css = "div[role='grid']>div[role='row']";

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("Target table not found or not visible");
}

/* If user pointed at a table row or cell for the target element then be nice
 *	try to find the parent element <table>, <div role="grid">
 */
let table = tableFind(element);
let tagname = table?.tagName.toLowerCase();
if (tagname === 'div' && table.attributes['role']?.nodeValue === 'grid')
    tagname = "grid";

let select_tags = ["table", "grid"];
if (!select_tags.includes(tagname)) {
    throw new Error("Select Option(s) ==> Target element must be a table or grid");
}

if (typeof highlight !== 'undefined' && highlight === true)
    table.style.border = "2px solid green";

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

/* Convenience functions used for matching
 */
const stringMatch = {};
stringMatch['exact'] = function (str1, str2) { return (str1 === str2); };
stringMatch['startswith'] = function (str1, str2) { return str1.startsWith(str2); };
stringMatch['endswith'] = function (str1, str2) { return str1.endsWith(str2); };
stringMatch['includes'] = function (str1, str2) { return str1.includes(str2); };
stringMatch['contains'] = function (str1, str2) { return str1.includes(str2); };

/* Find a target table 
 */
function tableFind(startingElement) {

    let table = startingElement;
    let tagname = table.tagName.toLowerCase();

    /* First search down the DOM tree 
     */
    let select_tags = ["table", "grid"];
    if (!select_tags.includes(tagname)) {
        table = table = startingElement.getElementsByTagName('table')[0];
        if (typeof table === 'undefined' || table === null) {
            table = startingElement.querySelectorAll('div[role="grid"]')[0];
            if (typeof table !== 'undefined' && table !== null)
                tagname = (table !== null) ? "grid" : "";
        }
        else
            tagname = (typeof table == 'undefined' || table == null) ? "" : table.tagName.toLowerCase();
    }

    /* Search up the DOM tree
     */
    let stop_tags = ["grid", "table", "html"];
    if (!stop_tags.includes(tagname)) {
        table = startingElement;
        while (!stop_tags.includes(tagname)) {
            table = table.parentNode;
            tagname = (typeof table === 'undefined' || table == null) ? "" : table.tagName.toLowerCase();
            if (tagname === 'div' && table.attributes['role']?.nodeValue === 'grid')
                tagname = 'grid';
        }
    }

    return table;
}

/* Get table rows/rows
 */
function getTableRows(theTable) {

    let tableRows = [];

    let columnheader_row;
    let columnheader_nodes;
    let columnheaders;
    let data_rows;

    let rows = null;
    switch (tagname) {

        case "table":

            columnheader_row = theTable.querySelectorAll('thead')[0];
            if (typeof columnheader_row !== 'undefined' && columnheader_row !== null)
                columnheader_nodes = columnheader_row.querySelectorAll('th');
            else
                columnheader_nodes = theTable.getElementsByTagName("tr")[0].querySelectorAll('th');

            columnheaders = [];
            if (columnheader_nodes.length > 0) {
                [].forEach.call(columnheader_nodes, function (cell) {
                    columnheaders.push(cell.innerText);
                });
            }

            rows = theTable.getElementsByTagName("tr");

            break;

        case "grid":

            columnheader_nodes = theTable.querySelectorAll(grid_header_css);
            columnheaders = [];
            if (columnheader_nodes.length > 0) {
                [].forEach.call(columnheader_nodes, function (cell) {
                    columnheaders.push(cell.innerText);
                });
            }

            data_rows = theTable.querySelectorAll(grid_rowgroup_css)[1];
            rows = data_rows.querySelectorAll(grid_row_css);

            break;
    }
    console.log("rows.length", rows.length);

    let return_item_entry = null;
    let _return_item_entry;
    let row_cells;

    for (let i = 0; i < rows.length; i++) {

        switch (tagname) {

            case "table":

                row_cells = rows[i].querySelectorAll('td');
                if (row_cells.length > 0) {
                    _return_item_entry = {};
                    let row_cell_id = 0;
                    _return_item_entry["index"] = i - ((typeof columnheader_row === 'undefined') ? 0 : 1);
                    [].forEach.call(row_cells, function (cell) {
                        let column_name = columnheaders[row_cell_id++ % columnheaders.length];
                        _return_item_entry[column_name] = cell.innerText;
                    });
                    return_item_entry = _return_item_entry;
                }

                break;

            case "grid":

                row_cells = rows[i].querySelectorAll('div[role="gridcell"]');
                if (row_cells.length > 0) {
                    _return_item_entry = {};
                    let row_cell_id = 0;
                    _return_item_entry["index"] = i;
                    [].forEach.call(row_cells, function (cell) {
                        let column_name = columnheaders[row_cell_id++ % columnheaders.length];
                        _return_item_entry[column_name] = cell.innerText;
                    });
                    return_item_entry = _return_item_entry;
                }

                break;

        }

        if (return_item_entry !== null)
            tableRows.push(return_item_entry);
    }

    return tableRows;
}

let return_variable_name = 'actualItems';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

let actualValues = getTableRows(table);
exportsTest[return_variable_name] = actualValues;
console.log("actualValues", actualValues);

var expected_results = {};
expected_results["options"] = { "PK": null, "matchType": "exact" };
expected_results["expectedValues"] = actualValues;
exportsTest['expected_results'] = expected_results;
console.log('expected_results', JSON.stringify(expected_results, null, 2));

copyToClipboard(JSON.stringify(expected_results));

// Validate
//
function validateDataSet(actualValues, options, expectedValues) {

    if (verbose)
        console.log("validateItems called");

    let result = true;
    let expected_values;
    let actual_values;
    let row_differences;
    let differences = [];

    let pk = null;
    let matchtype = "exact";
    if (typeof options !== 'undefined' && options !== null) {
        pk = options["PK"];
        matchtype = options["matchType"].toLowerCase();
    }

    for (let evid = 0; evid < expectedValues.length; evid++) {

        expected_values = expectedValues[evid];

        let row_id = Object.keys(expected_values).includes("index") ? expected_values["index"] : evid;
        actual_values = (actualValues[row_id] !== null) ? actualValues[row_id] : "";

        /* if PK is defined then use it to find the target row for comparison
         */
        if (pk != null) {
            let target_row = actualValues.find(row => row[pk] === expected_values[pk]);
            actual_values = target_row;
        }

        row_differences = {};

        if (typeof expected_values === 'string' && typeof actual_values === 'string') {

            if (!stringMatch[matchtype](actual_values, expected_values)) {
                row_differences[evid] = { "row": evid, "Actual": actual_values, "Expected": expected_values, "MatchType": matchtype };
                if (result)
                    result = false;
            }

        }
        else {

            if (typeof actual_values === 'undefined' || actual_values === null) {
                console.warn("    MISMATCH:: Expected: [" + JSON.stringify(expected_values) + "], \nActual: UNDEFINED, MatchType: [" + matchtype + "]");
                row_differences[evid] = { "row": row_id, "Actual": "undefined", "Expected": expected_values };
                continue;
            }

            for (let key in expected_values) {

                if (key === 'index')
                    continue;

                if (verbose)
                    console.log("Validate " + key + "Expected: [" + expected_values[key] + "], Actual:[" + actual_values[key] + "], MatchType: [" + matchtype + "]");

                if (Object.keys(actual_values).includes(key)) {

                    if (!stringMatch[matchtype](actual_values[key].toString(), expected_values[key].toString())) {

                        row_differences[key] = { "row": row_id, "Actual": actual_values[key], "Expected": expected_values[key], "MatchType": matchtype };
                        if (result)
                            result = false;
                        if (verbose)
                            console.log("    MISMATCH:: " + key + " => \nExpected: [" + expected_values[key] + "], \nActual: [" + actual_values[key] + "], \nMatchType: [" + matchtype + "]");
                    }
                }
            }
        }
        if (Object.keys(row_differences).length > 0)
            differences.push(row_differences);
    }

    // If failed, echo to console and report an error
    //
    if (!result) {
        if (verbose) {
            console.log("expected_values", JSON.stringify(expectedValues));
            console.log("actual_values", JSON.stringify(actualValues));
        }
        console.log("SQL Server - Results Validate: ", JSON.stringify(differences, null, 2));
        throw new Error("SQL Server - Results Validate\n" + JSON.stringify(differences, null, 2));
    }

    return result;
}

if (typeof expectedValues !== 'undefined' && expectedValues !== null) {

    let options = null;
    let expected_values = expectedValues;
    if (!Array.isArray(expectedValues)) {
        options = expectedValues["options"];
        expected_values = expectedValues["expectedValues"];
    }
    if (options == null) {
        options = {
            "matchType": (typeof matchType !== 'undefined' && matchType !== null) ? matchType : "exact",
            "PK": (typeof primaryKey !== 'undefined' && primaryKey !== null) ? primaryKey : null,
        }
    }
    validateDataSet(actualValues, options, expected_values);

}

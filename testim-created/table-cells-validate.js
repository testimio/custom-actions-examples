/**
 *  Table Cells - Validate
 *
 *      Validate table cell content
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) either a <table> or <ag-grid> 
 *      expectedValues (JS) : expected cell values in the following format:
 *                              [{"<column name>":"<column value>", "<column name>":"<column value>", "index":0}
 *                              ,{"<column name>":"<column value>", "<column name>":"<column value>", "index":1}
 *                              ,{"<column name>":"<column value>", "<column name>":"<column value>", "index":2}
 *                              ]
 * 
 *                            expectedValues can be retrieved by running this step with or without expectedValues being set
 *                                 The data will be in the clipboard and the variable actualItems (or returnVariableName if specified)
 *
 *                            If you set index:x of an expected row then validation of that entry will be row specific
 *      
 *      returnVariableName (JS) : string name of variable to store actual values in that can be used for setting expetedValues
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
 *                      
 *  Base Step
 * 
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Items/Options/Cells - Validate"
 *      Create parameters
 *          element (HTML)
 *          expectedValues (JS)
 *          returnVariableName (JS) [optional]
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals document, element, expectedValues, returnVariableName */

let verbose = true;

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

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

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
function getTableRows(element) {

    let tableRows = [];

    let columnheader_row;
    let columnheader_nodes;
    let columnheaders;
    let data_rows;
    let header_row;

    let rows = null;
    switch (tagname) {

        case "table":

            columnheader_row = element.querySelectorAll('thead')[0];
            columnheader_nodes = columnheader_row.querySelectorAll('th');
            columnheaders = [];

            if (columnheader_nodes.length > 0) {
                [].forEach.call(columnheader_nodes, function (cell) {
                    columnheaders.push(cell.innerText);
                });
            }

            rows = element.getElementsByTagName("tr");

            break;

        case "grid":

            columnheader_row = element.querySelectorAll('div[role="rowgroup"]')[0];
            columnheader_nodes = columnheader_row.querySelectorAll('span[class="ag-header-cell-text"]');
            columnheaders = [];
            if (columnheader_nodes.length > 0) {
                [].forEach.call(columnheader_nodes, function (cell) {
                    columnheaders.push(cell.innerText);
                });
            }

            data_rows = element.querySelectorAll('div[role="rowgroup"]')[1];
            rows = data_rows.querySelectorAll('div[role="row"]');

            break;
    }
    console.log("rows.length", rows.length);

    let return_item_entry = null;
    let _return_item_entry;
    let row_cells;

    for (let i = 0; i < rows.length; i++) {

        switch (tagname) {

            case "table":

                row_cells    = rows[i].querySelectorAll('td');
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
copyToClipboard(JSON.stringify(actualValues, null, 1));
exportsTest[return_variable_name] = actualValues;

// Validate
//
function validateItems(actualValues, expectedValues) {

    let result = true;
    let expected_values;
    let actual_values;
    let row_differences;
    let differences = [];

    for (let evid = 0; evid < expectedValues.length; evid++) {

        expected_values = expectedValues[evid];

        let row_id    = Object.keys(expected_values).includes("index") ? expected_values["index"] : evid;
        actual_values = (actualValues[row_id] !== null) ? actualValues[row_id] : ""; 

        row_differences = {};

        if (typeof expected_values === 'string' && typeof actual_values === 'string') 
        {
            if (expected_values != actual_values) {
                row_differences[evid] = { "row": evid, "Actual": actual_values, "Expected": expected_values };
                if (result)
                    result = false;
            }
        }
        else {
            
            if (typeof actual_values === 'undefined' || actual_values === null){
                 console.warn("    MISMATCH:: Expected: [" + JSON.stringify(expected_values) + "], \nActual: UNDEFINED");
                 row_differences[evid] = { "row": row_id, "Actual": "undefined", "Expected": expected_values };
                continue;
            }

            for (let key in expected_values) {

                if (key === 'index')
                    continue;

                if (verbose)
                    console.log("Validate " + key + "Expected: [" + expected_values[key] + "], Actual:[" + actual_values[key] + "]");

                if (Object.keys(actual_values).includes(key)) {

                    if (actual_values[key] != expected_values[key]) {
                        row_differences[key] = { "row": row_id, "Actual": actual_values[key], "Expected": expected_values[key] };
                        if (result)
                            result = false;
                        if (verbose)
                            console.log("    MISMATCH:: " + key + " => \nExpected: [" + expected_values[key] + "], \nActual: [" + actual_values[key] + "]");
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
        console.log("Validate Select/List/Table Options/Items/Cells(s): ", JSON.stringify(differences, null, 2));
        throw new Error("Validate Select/List/Table Options/Items/Cells\n" + JSON.stringify(differences, null, 2));
    }

    return result;
}

if (typeof expectedValues !== 'undefined' && expectedValues !== null) {

    validateItems(actualValues, expectedValues);

}


/**
 *  Table - Row Count Validate
 *
 *      Validate number of rows in a table
 *
 *  Parameters
 *
 *      element (HTML)       : Target element (or child of) either a <table> or <ag-grid> 
 *      expectedCount  (JS)  : Number of rows expected
 * 
 *  Returns
 * 
 *      actualRowCount
 * 
 *  Notes
 * 
 *      Supports both html tables and ag-grid
 *          ag-grid example - https://www.ag-grid.com/javascript-grid/cell-rendering/#example-dynamic-rendering-component
 *                      
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Validation
 * 
 *  Installation
 *      Create a new "Custom Validation" shared step
 *      Name it "Table - Row Count Validate"
 *      Create parameters
 *          element (HTML)
 *          expectedRowCount (JS)
 *      Set the new custom action's function body to this javascript
 *      Save the test
 *      Bob's your uncle
 *
 **/

/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* globals document, element, expectedCount, returnVariableName, highlight */

let verbose = false;

let grid_header_css = "div[role='columnheader']";
let grid_css = "div[role='grid']";
let grid_rowgroup_css = "div[role='rowgroup']";
let grid_row_css = "div[role='row']";

//let grid_header_css = "div[role='grid']>div[role='row']";

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("element must be defined");
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

let tableRows = getTableRows(table);
let actualCount = tableRows?.length; 
exportsTest[return_variable_name] = actualCount;
console.log("actualCount", actualCount);

copyToClipboard(actualCount);

// Validate
//
if (typeof expectedCount !== 'undefined' && expectedCount !== null) {

    if (actualCount != expectedCount)
        throw new Error(`expectedCount(${expectedCount}) != actualCount(${actualCount})`)

}
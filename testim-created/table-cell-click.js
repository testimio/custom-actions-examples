/**
 *  Table - Cell Click
 *
 *      Click a specific cell within a specific row in a table
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) either a <table> 
 *      rowSelector     (JS)   : { column name : value/index } specification to specify which row target column is in
 *                       example { "Type"  : "age" }
 *                               { "index" : 4 }
 *                               2
 *      columnId  (JS)   : Column name or index to click within a row
 *                       example "Value"
 *                               0
 *      returnVariableName (JS) [optional] : string name of variable to store actual value in 
 * 
 *  Returns
 * 
 *      cellValue (or returnVariableName if specified) will contain actual cell value
 * 
 *  Notes
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 * 
 *      Custom Action 
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Table - Cell Click"
 *      Create parameters
 *          element (HTML)
 *          rowSelector (JS)
 *          columnId (JS)
 *      Create optional parameters if desired
 *          returnVariableName (JS) [optional]
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals document, element, columnId, rowSelector, Event, returnVariableName */

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

let select_tags = ["table"];
if (!select_tags.includes(tagname)) {
    throw new Error("Target element must be a table");
}

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

function doEvent(obj, eventName) {
    let event = new Event(eventName, { target: obj, bubbles: true, composed: true });
    event.simulated = true; // React 15   
    return obj ? obj.dispatchEvent(event) : false;
}

/* Find a target table 
 */
function tableFind(startingElement) {

    let table = startingElement;
    let tagname = table.tagName.toLowerCase();

    /* First search down the DOM tree 
     */
    let select_tags = ["table"];
    if (!select_tags.includes(tagname)) {
        table = startingElement.getElementsByTagName('table')[0];
        tagname = (typeof table == 'undefined' || table == null) ? "" : table.tagName.toLowerCase();
    }

    /* Search up the DOM tree
     */
    let stop_tags = ["table", "html"];
    if (!stop_tags.includes(tagname)) {
        table = startingElement;
        while (!stop_tags.includes(tagname)) {
            table = table.parentNode;
            tagname = (typeof table === 'undefined' || table == null) ? "" : table.tagName.toLowerCase();
        }
    }

    return table;
}

/* Find target table row
 */
function tableRowFind(theGrid, rowSelector) {

    let target_row_id = -1;
    let target_row_column_name;
    let target_row_column_value;
    let target_row_column_id;
    let target_row_column_instance = 0;

    /* if rowSelector is defined then use it to find the target row 
     */
    if (rowSelector != null) {
        target_row_column_name = Object.keys(rowSelector)[0];
        target_row_column_value = rowSelector[target_row_column_name];
        target_row_column_instance = Object.keys(rowSelector).includes("Instance") ? rowSelector["Instance"] : 0;
    }

    if (verbose)
        console.log("  tagname:", tagname, ", target_row_column_name:", target_row_column_name, ", target_row_column_value:", target_row_column_value, ", target_row_column_instance:", target_row_column_instance);

    let rows = null;
    switch (tagname) {

        case "table":

            columnheader_row = theGrid.querySelectorAll('thead')[0];
            if (typeof columnheader_row === 'undefined' || columnheader_row === null)
                columnheader_row = theGrid.getElementsByTagName("tr")[0];

            if (columnheader_row !== null)
                columnheader_nodes = columnheader_row.querySelectorAll('th');

            rows = theGrid.getElementsByTagName("tr");

            break;

    }

    if (verbose) {
        console.log("  columnheader_nodes.length:", columnheader_nodes.length);
        console.log("  rows.length:", rows.length);
    }

    columnheaders = [];
    if (columnheader_nodes.length > 0) {
        let _column_id = -1;
        [].forEach.call(columnheader_nodes, function (cell) {
            _column_id = ++_column_id;
            columnheaders.push(cell.innerText.trim());
            if (cell.innerText.trim() === target_row_column_name)
                target_row_column_id = _column_id;
        });
    }

    if (verbose) {
        console.log("  target_row_column_id:", target_row_column_id);
        console.log("  columnheaders:", JSON.stringify(columnheaders));
    }

    if (target_row_column_name.toLowerCase() === "index") {
        target_row_id = target_row_column_value;
        if (target_row_id < 0) target_row_id = 0;
        if (target_row_id >= rows.length) target_row_id = rows.length - 1;
    }
    else if (rows.length > 0 && (target_row_column_id >= 0 && target_row_column_id < rows[0].children.length)) {
        let _row_id = -1;

        [].forEach.call(rows, function (row) {
            _row_id = ++_row_id;
            if (row.children[target_row_column_id].innerText.trim() == target_row_column_value && target_row_column_instance-- >= 0) {
                target_row_id = _row_id;
                if (verbose)
                    console.log("    !==> target_row_id = ", target_row_id);
            }
        });
    }

    if (verbose)
        console.log("  target_row_id:", target_row_id);

    if (target_row_id == -1)
        throw new Error("Error finding target row [" + JSON.stringify(rowSelector) + "]")

    return rows[target_row_id];
}

/* Get table rows/rows
 */
function tableCellFind(theRow, columnId, columnValue) {

    if (verbose)
        console.log("  tableCellFind", theRow, columnId, columnValue);
    if (verbose)
        console.log("  columnheaders", columnheaders);

    let table_cell;
    let row_cells;
    let target_column_id = -1;

    if (typeof columnId === 'number') {
        target_column_id = (columnId < 0) ? 0 : columnId >= columnheaders.length ? columnheaders.length - 1 : columnId;
    }
    else if (columnId !== null && columnheaders.length > 0) {
        let _column_id = -1;
        [].forEach.call(columnheaders, function (columnHeaderText) {
            _column_id = ++_column_id;
            if (columnHeaderText.trim() === columnId) {
                target_column_id = _column_id;
            }
        });
    }
    console.log("target_column_id = ", target_column_id);
    if (target_column_id > -1)
        return theRow.children[target_column_id];

    if (columnValue !== null) {

        switch (tagname) {

            case "table":

                row_cells = theRow.querySelectorAll('td');
                if (row_cells.length > 0) {

                    if (target_column_id > 0)
                        table_cell = row_cells[target_column_id];
                    else {
                        [].forEach.call(row_cells, function (cell) {
                            if (cell.innerText.trim() === columnValue.trim())
                                table_cell = cell;
                        });
                    }
                }

                break;

        }

    }

    return table_cell;
}

let return_variable_name = 'cellValue';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

let row_selector = rowSelector
if (typeof rowSelector === 'number')
    row_selector = { "index": rowSelector };

let columnheader_row;
let columnheader_nodes;
let columnheaders;

let theRow;
theRow = tableRowFind(table, row_selector);
if (verbose)
    console.log("theRow = ", theRow);

let theCell;
if (typeof theRow !== 'undefined' && theRow !== null)
    theCell = tableCellFind(theRow, columnId, null);

if (verbose)
    console.log("theCell = ", theCell);

if (typeof theCell !== 'undefined' && theCell !== null) {

    if (verbose)
        console.log("Click on cell with innerText = ", theCell.innerText);

    //theCell.style.border = "1px solid red";

    copyToClipboard(theCell.innerText);
    exportsTest[return_variable_name] = theCell.innerText;

    doEvent(theCell, 'click');
    theCell.click();

}

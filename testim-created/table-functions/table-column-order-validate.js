/**
 *  Table - Column Order Validate
 *
 *      Validate the values in a column are sorted properly
 *
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) either a <table> or <ag-grid> 
 *      columnSelector  (JS)   : Column name or index to validate
 *                       example "Value"
 *                               0
 *      sortOrder (JS) : 'ASCENDING' (Default) OR 'DESCENDING'
 *      returnVariableName (JS) : string name of variable to store column values in.  
 *                              Defaults to 'columnValues' if not set
 *
 *  Returns
 * 
 *      columnValues (or returnVariableName if specified) will contain actual column cell values
 * 
 *  Notes
 * 
 *      Supports both html tables and ag-grid
 *      ag-grid example - https://www.ag-grid.com/javascript-grid/cell-rendering/#example-dynamic-rendering-component
 *      
 *  Base Step
 * 
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Table - Column Order Validate"
 *      Create parameters
 *          element (HTML)
 *          order (JS) 
 *          returnVariableName (JS) [optional]
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
 **/

/* globals document, element, columnSelector, sortOrder, returnVariableName */

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("Target table not found or not visible");
}

/* Default orderDescending if not defined
 */
let order_direction = "ASCENDING";
if (typeof sortOrder !== 'undefined' && sortOrder !== null) {
    order_direction = sortOrder.toUpperCase();
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

let grid_header_css   = "div[role='columnheader']";
let grid_css          = "div[role='grid']";
let grid_rowgroup_css = "div[role='rowgroup']";
let grid_row_css      = "div[role='row']";

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

/* Get table column values
 */
function getTableColumnValues(theTable, columnSelector) {

    let tableColumn = [];

    let columnheader_row;
    let columnheader_nodes;
    let columnheaders;
    let data_rows;

    let rows = null;
    let row_cells = null;
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

    let target_column_id = -1;

    if (typeof columnSelector === 'number') {
        target_column_id = (columnSelector < 0) ? 0 : columnSelector >= columnheaders.length ? columnheaders.length - 1 : columnSelector;
    }
    else if (columnSelector !== null && columnheaders.length > 0) {
        let _column_id = -1;
        [].forEach.call(columnheaders, function (columnHeaderText) {
            _column_id = ++_column_id;
            if (columnHeaderText.trim().toUpperCase() === columnSelector.toUpperCase()) {
                target_column_id = _column_id;
            }
        });
    }
    console.log("target_column_id = ", target_column_id);

    /* Loop all rows and collect column innerText
     */
    let row_cell;
    for (let i = 0; i < rows.length; i++) {
        switch (tagname) {

            case "table":

                row_cells = rows[i].querySelectorAll('td');
                if (row_cells.length > 0)
                    row_cell = row_cells[target_column_id];

                break;

            case "grid":

                row_cells = rows[i].querySelectorAll('div[role="gridcell"]');
                if (row_cells.length > 0)
                    row_cell = row_cells[target_column_id];

                break;

        }

        if (row_cell !== undefined)
            tableColumn.push(row_cell.innerText);
    }

    return tableColumn;
}
let actualItems = getTableColumnValues(table, columnSelector);
exportsTest.actualItems = actualItems;

let return_variable_name = 'columnValues';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

copyToClipboard(JSON.stringify(actualItems, null, 1));
exportsTest[return_variable_name] = actualItems;
console.log(return_variable_name, " = ", actualItems);

/* Validate list order
 */
function validateItemOrder(theList, expectedOrder) {
    let order;
    if (expectedOrder.toUpperCase() === "DESCENDING")
        order = theList.slice(1).every((item, i) => !isNaN(item) ? Number(theList[i]) >= Number(item) : theList[i] >= item); // descending
    else
        order = theList.slice(1).every((item, i) => !isNaN(item) ? Number(theList[i]) <= Number(item) : theList[i] <= item)  // ascending

    if (!order)
        throw new Error("Options are NOT in " + expectedOrder + " order: \n" + JSON.stringify(theList, null, 2));
}
validateItemOrder(actualItems, order_direction);


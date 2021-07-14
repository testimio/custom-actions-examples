/**
 *  Select/List/Table Options/Items/Cells - Validate
 *
 *      Return and optionally validate select/ol/ul/table items
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) either a <select>, <ol>, <ul>, <table> or <ag-grid> 
 *      returnVariableName (JS) : string name of variable to store actual values in that can be used for setting expetedValues
 *      expectedValues (JS) : expected data example can be gotten by running this step with no expectedValue.  
 *                            The data will be in the clipboard and the variable actualItems (or returnVariableName if specified)
 *	                          If you set index:x key/value of an expected value node it validates that entry in that row of actual values.
 *
 *  Returns
 * 
 *      actualItems - unless returnVariableName is set whereby data will be in that variable name instead
 * 
 *  Notes
 * 
 *      ag-grid example - https://www.ag-grid.com/javascript-grid/cell-rendering/#example-dynamic-rendering-component
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

/* globals document, element, returnType, expectedValues, returnVariableName */

let verbose = true;

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("Target List/Select not found or not visible");
}

let return_type = 'STRING';
if (typeof returnType !== 'undefined' && returnType !== null) {
    return_type = returnType;
}

/* If user pointed at a list item, option, table row, table cell for the target element then be nice
 *	try to find the parent element <select>, <ul>, <ol>, <div role~"grid">
 */
let select_list = selectListFind(element);
let tagname = select_list?.tagName.toLowerCase();
if (tagname === 'div' && select_list.attributes['role']?.nodeValue === 'grid')
    tagname = "grid";

let select_tags = ["select", "ol", "ul", "table", "grid"];
if (!select_tags.includes(tagname)) {
    throw new Error("Select Option(s) ==> Target element must be a select, ol, ul, option, li, table or grid");
}

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

/* Find a target select/listbox/table 
 */
function selectListFind(startingElement) {

    let select_list = startingElement;
    let tagname = select_list.tagName.toLowerCase();

    /* First search down the DOM tree 
     */
    let select_tags = ["select", "ol", "ul", "table", "grid"];
    if (!select_tags.includes(tagname)) {
        select_list = startingElement.getElementsByTagName('select')[0];
        if (typeof select_list === 'undefined' || select_list === null)
            select_list = startingElement.getElementsByTagName('ul')[0];
        if (typeof select_list === 'undefined' || select_list === null)
            select_list = startingElement.getElementsByTagName('ol')[0];
        if (typeof select_list === 'undefined' || select_list === null)
            select_list = startingElement.getElementsByTagName('table')[0];
        if (typeof select_list === 'undefined' || select_list === null) {
            select_list = startingElement.querySelectorAll('div[role="grid"]')[0];
            if (typeof select_list !== 'undefined' && select_list !== null)
                tagname = (select_list !== null) ? "grid" : "";
        }
        else
            tagname = (typeof select_list == 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();
    }

    /* Search up the DOM tree
     */
    let stop_tags = ["select", "ul", "ol", "grid", "table", "html"];
    if (!stop_tags.includes(tagname)) {
        select_list = startingElement;
        while (!stop_tags.includes(tagname)) {
            select_list = select_list.parentNode;
            tagname = (typeof select_list === 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();
            if (tagname === 'div' && select_list.attributes['role']?.nodeValue === 'grid')
                tagname = 'grid';
        }
    }

    return select_list;
}

/* Get select/listbox/table items/rows
 */
function getSelectOptions(element, returnType) {

    let listSelectOptions = [];

    let columnheader_row;
    let columnheader_nodes;
    let columnheaders;
    let data_rows;

    let items = null;
    switch (tagname) {

        case "select":

            items = element.options;

            break;

        case "ul":
        case "ol":

            items = element.getElementsByTagName("li");

            break;

        case "table":

            columnheader_row = element.querySelectorAll('thead')[0];
            columnheader_nodes = columnheader_row.querySelectorAll('th');
            columnheaders = [];

            if (columnheader_nodes.length > 0) {
                [].forEach.call(columnheader_nodes, function (cell) {
                    columnheaders.push(cell.innerText);
                });
            }

            items = element.getElementsByTagName("tr");

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
            items = data_rows.querySelectorAll('div[role="row"]');

            break;
    }
    console.log("items.length", items.length);

    let return_item_entry = null;
    let _return_item_entry;
    let row_cells;

    for (let i = 0; i < items.length; i++) {

        switch (tagname) {

            case "select":

                switch (returnType) {
                    case "ITEM":
                        return_item_entry = { "index": i, "text": items[i].text, "value": items[i].value };
                        break;
                    case "VALUE":
                        return_item_entry = items[i].value;
                        break;
                    case "TEXT":
                    case "STRING":
                        return_item_entry = items[i].text;
                        break;
                    default:
                        return_item_entry = { "index": i, "text": items[i].text };
                        return_item_entry[returnType] = items[i].attributes[returnType].value;
                        break;
                }
                break;

            case "ul":
            case "ol":

                switch (returnType) {
                    case "ITEM":
                        return_item_entry = { "index": i, "text": items[i].textContent }; //, "value": items[i].value };
                        break;
                    case "VALUE":
                        return_item_entry = items[i].value;
                        break;
                    case "TEXT":
                    case "STRING":
                        return_item_entry = items[i].textContent;
                        break;
                    default:
                        return_item_entry = { "index": i, "text": items[i].textContent };
                        return_item_entry[returnType] = items[i].attributes[returnType].value;
                        break;
                }
                break;

            case "table":

                row_cells = items[i].querySelectorAll('td');
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

            case "grid":

                row_cells = items[i].querySelectorAll('div[role="gridcell"]');
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
            listSelectOptions.push(return_item_entry);
    }

    return listSelectOptions;
}

let return_variable_name = 'actualItems';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

let actualValues = getSelectOptions(select_list, return_type);
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
            console.log("actual_values", JSON.stringify(actual_values));
        }
        console.log("Validate Select/List/Table Options/Items/Cells(s): ", JSON.stringify(differences, null, 2));
        throw new Error("Validate Select/List/Table Options/Items/Cells\n" + JSON.stringify(differences, null, 2));
    }

    return result;
}

if (typeof expectedValues !== 'undefined' && expectedValues !== null) {

    validateItems(actualValues, expectedValues);

}


/**
 *  Items/Options/Cells - Get
 *
 *      Return select/ol/ul/table items in a structured format
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) either a <select>, <ol>, <ul>, <table> or <ag-grid> 
 *      returnVariableName (JS) : string name of variable to store actual values in 
 *
 *  Returns
 * 
 *      actualItems - unless returnVariableName is set whereby data will be in that variable name instead
 * 
 *  Notes
 * 
 *      ag-grid example - https://www.ag-grid.com/javascript-grid/cell-rendering/#example-dynamic-rendering-component
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
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals document, element, returnType, returnVariableName */

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

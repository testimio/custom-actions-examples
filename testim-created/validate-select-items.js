/**
 *  Validate Select/List Items
 *
 *      Return and optionally validate select/ol/ul items (option/li entries)
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) either a <select>, <ol>, <ul>
 *      expectedValues (JS) : expected data example can be gotten by running this step with no expectedValue.  
 *                            The data will be in the clipboard and the variable actualItems (or returnVariableName if specified)
 *	                          If you set index:x key/value of an expected value node it validates that entry in that row of actual values.
 *
 *      returnVariableName (JS) [optional] : string name of variable to store actual values in that can be used for setting expectedValues
 *
 *  Returns
 * 
 *      actualItems - unless returnVariableName is set whereby data will be in that variable name instead
 * 
 *  Notes
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Validate Select Items/Options"
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

/* globals document, element, matchType, returnType, expectedValues, returnVariableName */

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

let match_type = 'exact';
if (typeof matchType !== 'undefined' && matchType !== null) {
    match_type = matchType.toLowerCase();
}

/* If user pointed at a list item, option, table row, table cell for the target element then be nice
 *	try to find the parent element <select>, <ul>, <ol>, <div role~"grid">
 */
let select_list = selectListFind(element);
let tagname = select_list?.tagName.toLowerCase();

let select_tags = ["select", "ol", "ul"];
if (!select_tags.includes(tagname)) {
    throw new Error("Select Option(s) ==> Target element must be a select, ol, ul, option, li, table or grid");
}

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

/* Convenience functions used for matching
 */
const stringMatch = {};
stringMatch['exact'] = function (str1, str2) { return (str1 === str2); };
stringMatch['startswith'] = function (str1, str2) { return str1.startsWith(str2); };
stringMatch['endswith'] = function (str1, str2) { return str1.endsWith(str2); };
stringMatch['includes'] = function (str1, str2) { return str1.includes(str2); };
stringMatch['contains'] = function (str1, str2) { return str1.includes(str2); };

/* Find a target select/listbox/table 
 */
function selectListFind(startingElement) {

    let select_list = startingElement;
    let tagname = select_list.tagName.toLowerCase();

    /* First search down the DOM tree 
     */
    let select_tags = ["select", "ol", "ul"];
    if (!select_tags.includes(tagname)) {
        select_list = startingElement.getElementsByTagName('select')[0];
        if (typeof select_list === 'undefined' || select_list === null)
            select_list = startingElement.getElementsByTagName('ul')[0];
        if (typeof select_list === 'undefined' || select_list === null)
            select_list = startingElement.getElementsByTagName('ol')[0];
        tagname = (typeof select_list == 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();
    }

    /* Search up the DOM tree
     */
    let stop_tags = ["select", "ul", "ol", "html"];
    if (!stop_tags.includes(tagname)) {
        select_list = startingElement;
        while (!stop_tags.includes(tagname)) {
            select_list = select_list.parentNode;
            tagname = (typeof select_list === 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();
        }
    }

    return select_list;
}

/* Get select/listbox/table items/rows
 */
function getSelectOptions(element, returnType) {

    let listSelectOptions = [];
    let items = null;

    switch (tagname) {

        case "select":

            items = element.options;

            break;

        case "ul":
        case "ol":

            items = element.getElementsByTagName("li");

            break;

    }
    console.log("items.length", items.length);

    let return_item_entry = null;

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

if (verbose) {
    console.log("actualValues", JSON.stringify(actualValues));
    console.log("expectedValues", JSON.stringify(expectedValues));
}

// Validate
//
function validateItems(actualValues, expectedValues, matchType) {

    let result = true;
    let expected_values;
    let actual_values;
    let row_differences;
    let differences = [];

    for (let evid = 0; evid < expectedValues.length; evid++) {

        expected_values = expectedValues[evid];

        let row_id = Object.keys(expected_values).includes("index") ? expected_values["index"] : evid;
        actual_values = (actualValues[row_id] !== null) ? actualValues[row_id] : "";

        row_differences = {};

        if (typeof expected_values === 'string' && typeof actual_values === 'string') {
            if (!stringMatch[matchType](actual_values, expected_values)) {
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

                    if (!stringMatch[matchType](actual_values[key], expected_values[key])) {
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
        console.log("Validate Select/List Options/Items: ", JSON.stringify(differences, null, 2));
        throw new Error("Validate Select/List Options/Items\n" + JSON.stringify(differences, null, 2));
    }

    return result;
}

if (typeof expectedValues !== 'undefined' && expectedValues !== null) {

    validateItems(actualValues, expectedValues, match_type);

}

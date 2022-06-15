/**
 *  Select List - Items Validate
 *
 *      Return and optionally validate (option/li/<custom>) from a select/ol/ul/<custom> element
 * 
 *  Parameters
 * 
 *      element (HTML) : Target element (or child of) either a <select>, <ol>, <ul> or <user-defined>
 *      
 *      expectedValues (JS) : expected data example can be gotten by running this step with no expectedValue.  
 *                            The data will be in the clipboard and the variable actualItems (or returnVariableName if specified)
 *	                          If you set index:x key/value of an expected value node it validates that entry in that row of actual values.
 *
 *      returnVariableName (JS) [optional] : string name of variable to store actual values in that can be used for setting expectedValues
 *
 *      matchType [optional] : Textual match type when validating URL 
 *		            Examples: "exact", "startswith", "endswith", "includes", "contains"
 *                            "notexact", "notstartswith", "notendswith", "notincludes", "notcontains"
 *                            "NotFound", "NotExists", false
 *      resultsFilter (JS) [optional] : "first", "last", slice index ("5", "-5"), Default: All
 * 
 *      resultRegex (JS) [optional] : regex expression to parse each result
 *                                      Example: '(?<CC>Credit Card: [0-9\-]*)'
 * 
 *      customListSelectors (JS) [optional] : Array of one or more custom list selector pairs 
 *                                            used for defining what a list and list item look like
 *                                  Example:
 *                                          [{
 *                                               custom_list_selector: {
 *                                                   tagName: "div",
 *                                                   attributeName: "role",
 *                                                   attributeValue: "list",
 *                                                   querySelector: 'div[role="list"]'
 *                                               },
 *                                               custom_list_item_selector: {
 *                                                   tagName: "div",
 *                                                   attributeName: "role",
 *                                                   attributeValue: "listitem",
 *                                                   querySelector: 'div[role="listitem"]'
 *                                               }
 *                                           }]
 * 
 *      returnVariableName (JS) [optional] : string name of variable to store actual values in that can be used for setting expectedValues
 *
 *  Returns
 *      actualItems - unless returnVariableName is set whereby data will be in that variable name instead
 * 
 *  Notes
 * 
 *  Version     Date        Author          Notes             
 *      1.5.0   06/14/2022  Barry Solomon   Support out of order item validation
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new shared "Custom Action" named "Validate Select Items/Options"
 *      Set the new custom action's function body to this javascript
 *      Create parameters as outlined above
 *      Save the test and "Bob's your uncle"
 *
**/

/* eslint-disable camelcase */
/* eslint-disable no-global-assign */
/* globals document, element, matchType, returnType, expectedValues, returnVariableName, customListSelectors, resultsFilter, resultRegex */

// eslint-disable-next-line no-unused-vars
let custom_list_selector = null;
let custom_list_item_selector = null;

let custom_list_selectors = [
    {
        custom_list_selector: {
            tagName: "div",
            attributeName: "class",
            attributeValue: "styled__NavItemsContainer",
            querySelector: 'div[class^="styled__NavItemsContainer"]'
        },

        custom_list_item_selector: {
            tagName: "div",
            attributeName: "class",
            attributeValue: "styled__NavItemLabel",
            querySelector: 'div[class^="styled__NavItemLabel"]'
        }
    },
    {
        custom_list_selector: {
            tagName: "div",
            attributeName: "role",
            attributeValue: "list",
            querySelector: 'div[role="list"]'
        },
        custom_list_item_selector: {
            tagName: "div",
            attributeName: "role",
            attributeValue: "listitem",
            querySelector: 'div[role="listitem"]'
        }
    },
    {
        custom_list_selector: {
            tagName: "table",
            querySelector: 'table'
        },
        custom_list_item_selector: {
            tagName: "tr",
            querySelector: 'tr'
        }
    },
    {
        custom_list_selector: {
            tagName: "div",
            querySelector: 'div'
        },
        custom_list_item_selector: {
            tagName: "div",
            querySelector: 'div'
        }
    },

];
if (typeof customListSelectors === 'object')
    custom_list_selectors = customListSelectors;

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

let return_variable_name = 'actualItems';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

let result_filter = "All";
if (typeof resultsFilter !== 'undefined' && resultsFilter !== null) {
    result_filter = resultsFilter;
}

let result_regex = null;
if (typeof resultRegex !== 'undefined' && resultRegex !== null) {
    result_regex = resultRegex;
}

let match_type = 'exact';
if (typeof matchType !== 'undefined' && matchType !== null) {
    if (matchType == false || ["notfound", "notexists"].includes(matchType.toLowerCase()))
        matchType = "notexact";
    match_type = matchType.toLowerCase();
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
stringMatch['notexact'] = function (str1, str2) { return (str1 !== str2); };
stringMatch['notstartswith'] = function (str1, str2) { return !str1.startsWith(str2); };
stringMatch['notendswith'] = function (str1, str2) { return !str1.endsWith(str2); };
stringMatch['notincludes'] = function (str1, str2) { return !str1.includes(str2); };
stringMatch['notcontains'] = function (str1, str2) { return !str1.includes(str2); };

/* Find a target select/listbox 
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
        if (typeof select_list === 'undefined' || select_list === null) {
            custom_list_selectors.forEach((_custom_list_selector) => {
                if (typeof select_list === 'undefined' || select_list === null) {

                    select_list = startingElement.querySelectorAll(_custom_list_selector.custom_list_selector?.querySelector)[0];
                    if (select_list === undefined || select_list === null)
                        select_list = startingElement.parentNode.querySelectorAll(_custom_list_selector.custom_list_selector?.querySelector)[0];
                    if (typeof select_list !== 'undefined' && select_list !== null) {
                        tagname = 'custom';
                        custom_list_selector = _custom_list_selector.custom_list_selector;
                        custom_list_item_selector = _custom_list_selector.custom_list_item_selector;
                    }

                }
            })
        }
        else
            tagname = (typeof select_list == 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();
    }

    /* Search up the DOM tree
     */
    let stop_tags = ["select", "ul", "ol", "html", "custom"];
    if (!stop_tags.includes(tagname)) {
        select_list = startingElement;
        while (!stop_tags.includes(tagname)) {

            select_list = select_list.parentNode;
            tagname = (typeof select_list === 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();

            custom_list_selectors.forEach((_custom_list_selector) => {
                if (tagname === _custom_list_selector.custom_list_selector?.tagName && select_list.attributes[_custom_list_selector.custom_list_selector?.attributeName]?.nodeValue === _custom_list_selector.custom_list_selector?.attributeValue) {
                    tagname = 'custom';
                    custom_list_selector = _custom_list_selector.custom_list_selector;
                    custom_list_item_selector = _custom_list_selector.custom_list_item_selector;
                }
            })

        }
    }

    return { select_list, tagname };
}

/* Get select/listbox/custom items/rows
 */
function getSelectOptions(selectList, returnType) {

    let select_list = selectList.select_list;
    let listSelectOptions = [];
    let items = null;

    switch (selectList.tagname) {

        case "select":

            items = select_list.options;

            break;

        case "ul":
        case "ol":

            items = select_list.getElementsByTagName("li");

            break;

        case "custom":

            items = select_list.querySelectorAll(custom_list_item_selector?.querySelector);

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

            case "custom":

                switch (returnType) {
                    case "ITEM":
                        return_item_entry = { "index": i, "innerHTML": items[i].innerHTML };
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

/* If user pointed at a list item, option for the target element then be nice
 *	try to find the parent element <select>, <ul>, <ol>
 */
let select_list = selectListFind(element);
let tagname = select_list?.tagname.toLowerCase();

if (verbose) {
    console.log("select_list found", select_list);
}

let select_tags = ["select", "ol", "ul", "custom"];
if (!select_tags.includes(tagname)) {
    throw new Error("Select Option(s) ==> Target element must be a select, ol, ul, option, li or custom");
}

let actualValues = getSelectOptions(select_list, return_type);

let resultValues = actualValues;
switch (result_filter) {
    case "first":
        resultValues = actualValues[0];
        break;
    case "last":
        resultValues = actualValues[actualValues.length - 1];
        break;
    default:
        if (isNaN(result_filter))
            resultValues = actualValues;
        else
            resultValues = (result_filter < 0) ? actualValues.slice(result_filter) : actualValues.slice(0, result_filter);
        break;
}

if (typeof result_regex !== 'undefined' && result_regex !== null && ["TEXT", "STRING"].includes(return_type)) {
    result_regex = resultRegex;
    resultValues.forEach((result, index) => {
        let pattern = new RegExp(result_regex);
        let matches = result.match(pattern);
        if (matches !== null) {
            resultValues[index] = matches[0];
        }
    });
}

copyToClipboard(JSON.stringify(resultValues, null, 1));
exportsTest[return_variable_name] = resultValues;

if (verbose) {
    console.log("resultValues", JSON.stringify(resultValues));
    console.log("actualValues", JSON.stringify(actualValues));
    console.log("expectedValues", JSON.stringify(expectedValues));
}

// Validate
//
function validateItems(actualValues, expectedValues, matchType, enforceOrder) {

    let result = true;
    let expected_value;
    let actual_value;
    let row_differences;
    let differences = [];

    for (let evid = 0; evid < expectedValues.length; evid++) {

        expected_value = expectedValues[evid];

        let row_id = Object.keys(expected_value).includes("index") ? expected_value["index"] : evid;
        actual_value = (actualValues?.length >= actualValues && actualValues[row_id] !== null) ? actualValues[row_id] : undefined;

        row_differences = {};

        if (actualValues === undefined) {

            row_differences[evid] = { "index": evid, "Actual": "<<No Selection>>", "Expected": expected_value };
            result = false;

        }
        else if (typeof expected_value === 'string') {

            result = false;
            actualValues.forEach((actual_value) => {
                if (stringMatch[matchType](actual_value, expected_value)) {
                    if (!result)
                        result = true;
                }
            });
            if (!result)
                row_differences[evid] = { "Actual": "<<No match>>", "Expected": expected_value, "MatchType" : matchType };

        }

        if (Object.keys(row_differences).length > 0)
            differences.push(row_differences);

    }

    // If failed, echo to console and report an error
    //
    if (!result) {
        if (verbose) {
            console.log("expected_value", JSON.stringify(expectedValues));
            console.log("actual_value", JSON.stringify(actual_value));
        }
        console.log("Validate Select/List Options/Items: ", JSON.stringify(differences, null, 2));
        throw new Error("Validate Select/List Options/Items\n" + JSON.stringify(differences, null, 2));
    }

    return result;
}

if (typeof expectedValues !== 'undefined' && expectedValues !== null) {

    validateItems(resultValues, expectedValues, match_type);

}
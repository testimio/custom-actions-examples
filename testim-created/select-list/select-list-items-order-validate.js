/**
 *  Select List - Items Order Validate
 *
 *      Validate the items (option/li/<custom>) from a (select/ol/ul/<custom>) element are sorted properly
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) either a <select>, <ol>, <ul> or <user-defined>
 *
 *      sortOrder (JS) [optional] : "ASCENDING" (Default), "DESCENDING"  
 * 
 *      resultsFilter (JS) [optional] : Used to slice array.  Default: All
 *                                      Examples: 5, -5, [1, 4], [0, 4]  
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
 *                                           },
 *                                           {
 *                                               custom_list_selector: {
 *                                                   tagName: "table",
 *                                                   querySelector: 'table'
 *                                               },
 *                                               custom_list_item_selector: {
 *                                                   tagName: "tr",
 *                                                   querySelector: 'tr'
 *                                               }
 *                                           },]
 * 
 *      returnVariableName (JS) [optional] : string name of variable to store actual values in that can be used for setting expectedValues
 *
 *  Returns
 * 
 *      actualItems or returnVariableName if defined
 * 
 *  Notes
 * 
 *      If you get an error: Error while running step: Error: resultValues list not found
 *      then check your resultsFilter as it might be slicing an empty set
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 *
**/

/* eslint-disable no-unused-vars, camelcase */
/* globals document, element, returnType, returnVariableName, resultRegex, resultsFilter, customListSelectors */

let custom_list_selector = null;
let custom_list_item_selector = null;

let custom_list_selectors = [
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
];
if (typeof customListSelectors === 'object' && customListSelectors !== null)
    custom_list_selectors = customListSelectors;

let verbose = true;

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("Target List/Select element is undefined");
}

/* Default orderDescending if not defined
 */
let order_direction = "ASCENDING";
if (typeof sortOrder !== 'undefined' && sortOrder !== null) {
    order_direction = sortOrder.toUpperCase();
}

let return_type = 'STRING';
if (typeof returnType !== 'undefined' && returnType !== null) {
    return_type = returnType;
}

let return_variable_name = 'actualItems';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

let result_filter = "all";
if (typeof resultsFilter !== 'undefined' && resultsFilter !== null) {
    result_filter = (typeof resultsFilter === 'string') ? resultsFilter.toLowerCase() : resultsFilter;
}

let result_regex = null;
if (typeof resultRegex !== 'undefined' && resultRegex !== null) {
    result_regex = resultRegex;
}

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

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

/* Process raw result values
 */
let resultValues = null;
switch (result_filter) {
    case "first":
        resultValues = actualValues[0];
        break;
    case "last":
        resultValues = actualValues[actualValues.length - 1];
        break;
    case "all":
        resultValues = actualValues;
        break;
    default:
        if (typeof result_filter === 'object') { // assuming is an array [start, end]
            if (result_filter.length === 1)
                if (result_filter[0] < 0)
                    resultValues = actualValues.slice(result_filter[0]);
                else
                    resultValues = actualValues.slice(0, result_filter[1]);
        }
        else
            resultValues = actualValues.slice(result_filter);
        break;
}

if (resultValues === null) {
    console.log("No list items found");
    return;
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

/* Save data for posterity
 */
copyToClipboard(JSON.stringify(resultValues, null, 1));
exportsTest[return_variable_name] = resultValues;

if (verbose) {
    console.log("===>", return_variable_name, JSON.stringify(exportsTest[return_variable_name]));
}

/* Validate select/listbox item order
 */
function validateSelectOptionOrder(resultValues, order) {

    if (typeof resultValues === 'undefined' || resultValues === null || resultValues.length === 0)
        throw new Error("resultValues list not found");

    let actual_items = [];
    for (let i = 0; i < resultValues.length; i++) {
        actual_items.push(resultValues[i]);
    }

    let expected_items = [...actual_items];
    if (order === "DESCENDING")
        expected_items.sort().reverse();
    else
        expected_items.sort();

    console.log("Expected Item Order: " + JSON.stringify(expected_items));
    console.log("Actual Item Order:   " + JSON.stringify(actual_items));

    if (expected_items.every(function (value, index) { return value === actual_items[index] }) === false)
        throw new Error("Options are not in " + order + " Actual Order: " + JSON.stringify(actual_items, null, 2) + " Expected Order: " + JSON.stringify(expected_items, null, 2));

}
if (resultValues != null)
    validateSelectOptionOrder(resultValues, order_direction);

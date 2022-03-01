/**
 *  Select List - Items Get
 *
 *      Return items (option/li/<custom>) from a select/ol/ul/<custom> element
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) either a <select>, <ol>, <ul> or <user-defined>
 *
 *      returnVariableName (JS) [optional] : string name of variable to store actual values in that can be used for setting expectedValues
 *
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
if (typeof customListSelectors === 'object')
    custom_list_selectors = customListSelectors;

let verbose = false;

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("Target List/Select element is undefined");
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

let resultValues = null;
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
    console.log("===>", return_variable_name, JSON.stringify(exportsTest[return_variable_name]));
}

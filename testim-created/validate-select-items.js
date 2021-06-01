/**
 *  Validate Select Items/Options
 *
 *      Validate that all expectedOptions are in the target select/list element (Order independent)
 *      If sortOrder is defined then validation of the select/list's order will be performed
 * 
 *  Parameters
 *
 *      element (HTML)       : Target element (or child of) either a <select>, <ol> or <ul>
 *
 *	    expectedOptions (JS) : String array of expected itmes in list/select
 *                    
 *  	sortOrder (JS) [optional] : "ASCENDING" (Default), "DESCENDING"  
 * 
 *	    matchType (JS) [optional] : Text match type when searching for text in lists/selects
 *	    	Examples: 	'exact' (default), 
 *	    				'startswith', 
 *	    				'endswith', 
 *	    				'includes'
 * 
 *  Base Step
 *      Custom Validation
 * 
 *  Installation
 *      Create a new "Custom Validation"
 *      Name it "Validate Select Items/Options"
 *      Create parameters
 *          element (HTML)
 *          expectedOptions (JS)
 *      Optional - add optional parameters
 *          matchType (JS)  
 *          sortOrder (JS)  
 *      Set the new custom action's function body to this javascript
 *      Override timeout => Step timeout (milliseconds) = 2000
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals element, matchType, expectedOptions, sortOrder */

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("Target List/Select not found or not visible");
}

/* Validate expectedOptions is defined
 */
if (typeof expectedOptions === 'undefined' || expectedOptions === null) {
    throw new Error("expectedOptions is not defined");
}

let match_type = 'exact';
if (typeof matchType !== 'undefined' && matchType !== null) {
    match_type = matchType.toLowerCase();
}

/* If user pointed at a list item or for the target element then be nice
 *	try to find the parent element <select> or <ul>
 */
let select_list = selectListFind(element);
let tagname = select_list.tagName.toLowerCase();

let select_tags = ["select", "ol", "ul"];
if (!select_tags.includes(tagname)) {
    throw new Error("Select Option(s) ==> Target element must be a select, ol, ul, option or li");
}

/* Convenience functions used for matching
 */
const stringMatch = {};
stringMatch['exact'] = function (str1, str2) { return (str1 === str2); };
stringMatch['startswith'] = function (str1, str2) { return str1.startsWith(str2); };
stringMatch['endswith'] = function (str1, str2) { return str1.endsWith(str2); };
stringMatch['includes'] = function (str1, str2) { return str1.includes(str2); };

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
        tagname = (typeof select_list === 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();
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

/* Validate select/listbox items
 */
function validateSelectOptions(element, expectedOptions, matchType) {
    let tagname = element.tagName.toLowerCase();

    let matchtype = matchType.toLowerCase();
    if (typeof stringMatch[matchtype] === 'undefined' || stringMatch[matchtype] === null)
        matchtype = "exact";

    let items = (["ul", "ol"].includes(tagname)) ? element.getElementsByTagName("li") : element.options;
    for (let eo = 0; eo < expectedOptions.length; eo++) {
        let item_found = false;
        let expected_item_text = expectedOptions[eo];

        for (let i = 0; i < items.length; i++) {
            switch (tagname) {
                case "select":
                    if (stringMatch[matchtype](items[i].text, expected_item_text)) {
                        item_found = true;
                        break;
                    }
                    break;
                case "ol":
                case "ul":
                    if (stringMatch[matchtype](items[i].textContent, expected_item_text)) {
                        item_found = true;
                        break;
                    }
                    break;
            }

        }

        if (!item_found)
            throw new Error("Item " + expected_item_text + " not found");

    }

}
validateSelectOptions(element, expectedOptions, match_type);

/* Validate Select/List Order if sortOrder is defined
 */
function validateSelectOptionOrder(selectList, order) {

    let tagname = selectList.tagName.toLowerCase();
    let items = (tagname === "ul" || tagname === "ol") ? selectList.getElementsByTagName("li") : selectList.options;

    if (typeof items === 'undefined' || items === null || items.length === 0)
        throw new Error("items list not found");

    let actual_items = [];
    for (let i = 0; i < items.length; i++) {
        actual_items.push((tagname === "ul" || tagname === "ol") ? items[i].textContent : items[i].text);
    }

    let expected_items = [...actual_items];
    if (order === "DESCENDING")
        expected_items.sort().reverse();
    else
        expected_items.sort();

    console.log("Expected Item Order: " + JSON.stringify(expected_items));
    console.log("Actual Item Order:   " + JSON.stringify(actual_items));

    if (expected_items.every(function (value, index) { return value === actual_items[index] }) === false)
        throw new Error("Options are not in " + order + " order: " + JSON.stringify(actual_items, null, 2));

}
if (typeof sortOrder !== 'undefined' && sortOrder !== null) {

    let order_direction = (sortOrder.toUpperCase() !== 'DESCENDING') ? 'ASCENDING' : 'DESCENDING';

    validateSelectOptionOrder(select_list, order_direction);

}

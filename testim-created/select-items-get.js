/**
    Select Items Get

    Returns an array of all items in a list/select

  Parameters

    element (HTML)       : Target element (or child of) either a <select> or <ul>

    returnType (JS) [optional]:  "TEXT"  (default)  Return ["text0", "text1", ...]
                                 "VALUE"            Return ["value0", "value1", ...]
                                 "ITEM"             Return [{0,value0,text0}, {1,value1,text1}, ...] 
                                 "<attribute name>" Return [{0,text0,attribute0}, {1,text1,attribute1}, ...] 

  Returns

    listSelectOptions (array) 
                (Based on returnType)      
                    ["text0", "text1", ...]
                    ["value0", "value1", ...]
                    [{0,value0,text0}, {1,value1,text1}, ...] 
                    [{0,attribute0,text0}, {1,attribute1,text1}, ...] 

    Notes
        
**/

/* globals element, returnType */

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("Target List/Select not found or not visible");
}

let return_type = 'TEXT';
if (typeof returnType !== 'undefined' && returnType !== null) {
    return_type = returnType;
}

/* If user pointed at a list item or for the target element then be nice
 *	try to find the parent element <select> or <ul>
 */
let select_list = selectListFind(element);
let tagname = select_list.tagName.toLowerCase();

let select_tags = ["select", "ul"];
if (!select_tags.includes(tagname)) {
    throw new Error("Select Option(s) ==> Target element must be a select, ul, option or li");
}

/* Find a target select/listbox 
 */
function selectListFind(startingElement) {
    let select_list = startingElement;
    let tagname = select_list.tagName.toLowerCase();

    /* First search down the DOM tree 
     */
    console.log("First search down the DOM tree");
    let select_tags = ["select", "ul", "ol", "table"];
    if (!select_tags.includes(tagname)) {
        select_list = startingElement.getElementsByTagName('select')[0];
        if (typeof select_list === 'undefined' || select_list === null)
            select_list = startingElement.getElementsByTagName('ul')[0];
        if (typeof select_list === 'undefined' || select_list === null)
            select_list = startingElement.getElementsByTagName('ol')[0];
        if (typeof select_list === 'undefined' || select_list === null)
            select_list = startingElement.getElementsByTagName('table')[0];
        tagname = (typeof select_list === 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();
    }

    /* Search up the DOM tree
     */
    console.log("Search up the DOM tree");

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

/* Get select/listbox items
 */
function getSelectOptions(element, returnType) {
    let tagname = element.tagName.toLowerCase();

    let listSelectOptions = [];
    let return_item_entry = null;

    let items = (["ul","ol"].includes(tagname)) ? element.getElementsByTagName("li") : element.options;
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
                        return_item_entry = items[i].textContent;
                        break;
                    default:
                        return_item_entry = { "index": i, "text": items[i].textContent };
                        return_item_entry[returnType] = items[i].attributes[returnType].value;
                        break;
                }
                break;
        }
        listSelectOptions.push(return_item_entry);
    }

    return listSelectOptions;
}

exportsTest.listSelectOptions = getSelectOptions(element, return_type);

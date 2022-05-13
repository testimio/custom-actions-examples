/**
 *  Checkbox - Check/Uncheck
 * 
 *     Check/Uncheck a checkbox.  Supports custom checkbox controls and states (some assembly required)
 * 
 *  Parameters: 
 *
 *     element  : Target element
 *
 *     checkState [optional] : Only check item(s) if not checked/checked		
 *		    Examples: 	true    - Check
 *            			false   - Uncheck
 *                      <unset> - Toggle
 *                      <user-defined> - allows for option state interrogation            		
 *                    		"className === 'checked'"
 *		    		 		"querySelector(\"input[type='checkbox']\").checked === true"
 *
 *     customCheckboxSelectors (JS) [optional] : Array of one or more custom checkbox selector definitions 
 *                                            used for defining what a checkbox looks like
 *                                  Example:
 *                                          [{
 *                                               custom_checkbox_selector: {
 *                                                   tagName: "div",
 *                                                   attributeName: "role",
 *                                                   attributeValue: "checkbox",
 *                                                   querySelector: 'div[role="checkbox"]'
 *                                              }
 *                                           }]
 * 
 *  Author
 *      Barry Solomon
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 **/

/* eslint-disable no-var */
/* eslint-disable camelcase */
/* globals element, checkState, customListSelectors */

var is_checked = false;

let highlight_elements = false;
let highlight_checkbox = true;

if (typeof element === 'undefined' || element === null) {
    throw new Error("Target element is undefined.  Please set element parameter and try again");
}
let custom_checkbox_selector = null;

/* Validate/Process checkState
 */
let is_checked_logic;
if (typeof checkState !== 'undefined') {
    if (checkState == true)
        is_checked_logic = "checked === true";
    else if (checkState == false)
        is_checked_logic = "checked === false";
    else if (checkState !== null)
        is_checked_logic = checkState;
    console.log("is_checked_logic", is_checked_logic);
}

let custom_checkbox_selectors = [
    {
        custom_checkbox_selector: {
            tagName: "div",
            attributeName: "role",
            attributeValue: "checkbox",
            querySelector: 'div[role="checkbox"]'
        }
    }
];
if (typeof customListSelectors === 'object')
    custom_checkbox_selectors = customListSelectors;

if (highlight_elements && element !== null)
    element.style.border = "2px solid blue";

/* Find the target checkbox element based on selected element
 */
function checkboxFind(startingElement) {

    let checkbox = startingElement;
    let tagname = checkbox.tagName.toLowerCase();

    /* Search down the DOM tree 
     */
    let select_tags = ["input", "custom"];
    if (!select_tags.includes(tagname)) {
        checkbox = startingElement.getElementsByTagName('input')[0];
        if (typeof checkbox === 'undefined' || checkbox === null) {

            custom_checkbox_selectors.forEach((_custom_checkbox_selector) => {
                if (typeof checkbox === 'undefined' || checkbox === null) {
                    checkbox = startingElement.querySelectorAll(_custom_checkbox_selector.custom_checkbox_selector?.querySelector)[0];
                    if (checkbox === undefined || checkbox === null)
                        checkbox = startingElement.parentNode.querySelectorAll(_custom_checkbox_selector.custom_checkbox_selector?.querySelector)[0];
                    if (typeof checkbox !== 'undefined' && checkbox !== null) {
                        tagname = 'custom';
                        custom_checkbox_selector = _custom_checkbox_selector.custom_checkbox_selector;
                        console.log("custom_checkbox_selector", custom_checkbox_selector);
                    }
                }
            })
        }
        else
            tagname = (typeof checkbox == 'undefined' || checkbox == null) ? "" : checkbox.tagName.toLowerCase();
    }

    if (highlight_elements && highlight_checkbox && checkbox !== null)
        checkbox.style.border = "2px solid green";

    return { checkbox, tagname };
}
/* If user pointed at a list item or for the target element then be nice
 *	try to find the parent element <select> or <ul>
 */
let results = checkboxFind(element);
let tagname = results?.tagname.toLowerCase();
let checkbox = results?.checkbox;

let select_tags = ["input", "custom"];
if (!select_tags.includes(tagname)) {
    throw new Error("Select Option(s) ==> Target element must be a input or custom. Not: ", tagname);
}

/* Checkbox Check Core Function
 */
function checkItem(checkbox, is_checked_logic) {

    if (typeof is_checked_logic !== 'undefined') {
        is_checked = eval('(' + "checkbox." + is_checked_logic + ')');
        console.log("is_checked", is_checked);
    }
    if (!is_checked) {
        try {
            checkbox.firstElementChild.click();
        }
        catch (err) {
            try {
                checkbox.firstChild.click();
            }
            catch (err) {
                checkbox.click();
            }
        }
    }
    return true;

}

checkItem(checkbox, is_checked_logic);

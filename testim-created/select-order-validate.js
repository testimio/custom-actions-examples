/**
 *  Validate Select Items/Options Order
 *  
 *      Validate that items in a list are sorted properly
 *  
 *  Parameters
 *  
 *    element (HTML) : Target element (or child of) either a <select>, <ul> or <ol>
 *    sortOrder (JS) [optional] : "ASCENDING" (Default), "DESCENDING"  
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *    Custom Validation
 * 
 *  Installation
 *    Create a new "Custom Validation"
 *    Name it "Validate Select Items/Options Order"
 *    Create parameters
 *        element (HTML)
 *    Optional - add optional parameters
 *        sortOrder (JS)  
 *    Set the new custom action's function body to this javascript
 *    Exit the step editor
 *    Share the step if not already done so
 *    Save the test
 *    Bob's your uncle
 *
**/

/* globals element, sortOrder */

console.log("Validate Select Items/Options Order");

/* Validate a target element is defined
 */
if (typeof element === 'undefined' || element === null) {
  throw new Error("Target List/Select not found or not visible");
}

/* Default orderDescending if not defined
 */
let order_direction = "ASCENDING";
if (typeof sortOrder !== 'undefined' && sortOrder !== null) {
  order_direction = sortOrder.toUpperCase();
}

/* If user pointed at a list item or for the target element then be nice
 *	try to find the parent element <select> or <ul>
 */
let select_list = selectListFind(element);
let tagname     = select_list.tagName.toLowerCase();

let select_tags = ["select", "ul", "ol"];
if (!select_tags.includes(tagname))
{
  throw new Error("Select Option(s) ==> Target element must be a select, ul, ol, option or li");
}

/* Find a target select/listbox 
 */
function selectListFind(startingElement) 
{
  let select_list = startingElement;
  let tagname     = select_list.tagName.toLowerCase();

  /* First search down the DOM tree 
   */
  let select_tags = ["select", "ul", "ol"];
  if (!select_tags.includes(tagname))
  {
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
    while (!stop_tags.includes(tagname))
    {
      select_list = select_list.parentNode;
      tagname     = (typeof select_list === 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();
    }
  }
  
  return select_list;
}

/* Validate select/listbox item order
 */
function validateSelectOptionOrder (selectList, order) 
{
  let tagname = selectList.tagName.toLowerCase();
  let items   = (tagname === "ul" || tagname === "ol") ? selectList.getElementsByTagName("li") : selectList.options;  
  
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

  if (expected_items.every(function(value, index) { return value === actual_items[index]}) === false)
    throw new Error("Options are not in " + order + " order: " + JSON.stringify(actual_items, null, 2));
  
}
validateSelectOptionOrder (select_list, order_direction);

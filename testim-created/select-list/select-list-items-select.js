/* eslint-disable camelcase */
/**
 *  Select List - Items Select
 * 
 *      Select an item or multiple items from a listbox, dropdown, multi-select or table.  Optionally can support check list items
 *
 *  Parameters: 
 *
 *      element  : Target element (or parent/child of) a <select>, <ol>, <ul> or <table>
 *
 *      itemId   : String and/or Integer index (0-based) of target <option>, <li>, <tr>, <td> or any child of the aforementioned
 *    			  Can be an array for selecting multiple items ["Item 1", "Item 2", 3, 4, 5]
 *
 *      checkState [optional] : Only select item(s) if not checked/selected		
 *		    Examples: 	true    - Check
 *            			false   - Uncheck
 *                      <unset> - Toggle
 *                      <user-defined> - allows for option state interrogation            		
 *                    		"className === 'selected'"
 *		    		 		"querySelector(\"input[type='checkbox']\").checked"
 *                       
 *      matchType [optional] : Text match type when searching for text in lists/selects
 *		    Examples: exact (default), startswith, endswith, includes
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
 *          expectedOptions (JS)
 *      Optional - add optional parameters
 *          matchType (JS)  
 *          checkState (JS)  
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals element, matchType, checkState, Event, setTimeout, document, itemId, customListSelectors */

let custom_list_selector = null;
let custom_list_item_selector = null;

let custom_list_selectors = [
  {
    custom_list_selector: {
      tagName: "div",
      attributeName: "class",
      attributeValue: "o-resultsContainer",
      querySelector: '.o-resultsContainer'
    },
    custom_list_item_selector: {
      tagName: "a",
      attributeName: "class",
      attributeValue: "o-item",
      querySelector: 'a.o-item'
    }
  },
];
if (typeof customListSelectors === 'object')
  custom_list_selectors = customListSelectors;

if (typeof element === 'undefined' || element === null) {
  throw new Error("Target element is undefined.  Please set element parameter and try again");
}

let highlight_elements = true;
let highlight_select_item = true;
let highlight_selectlist = true;

/* Select Option/Item Core Function
 */
function selectItem(element, itemId, tagname, matchType) {

  let matchtype = matchType.toLowerCase();
  if (typeof stringMatch[matchtype] === 'undefined' || stringMatch[matchtype] === null)
    matchtype = "exact";

  let target_item_index = -1;
  let items;
  switch (tagname) {
    case "ol":
    case "ul":
      items = element.getElementsByTagName("li");
      break;
    case "custom":
      items = element.querySelectorAll(custom_list_item_selector?.querySelector);
      break;
    case "select":
    default:
      items = element.options;
      break;
  }

  switch (typeof itemId) {

    case "number":

      target_item_index = itemId;

      if (target_item_index >= items.length)
        target_item_index = items.length;
      if (items.length <= 0)
        return false;

      break;

    case "string":
    default:

      for (let i = 0; i < items.length; i++) {
        switch (tagname) {
          case "select":
            if (stringMatch[matchtype](element.options[i].text.toLowerCase(), itemId.toLowerCase())
              || (element.options[i].value.toLowerCase() === itemId.toLowerCase())
            ) {
              target_item_index = i;
            }
            break;
          case "ol":
          case "ul":
          default:
            if (stringMatch[matchtype](items[i].textContent.toLowerCase(), itemId.toLowerCase())) {
              target_item_index = i;
            }
            break;
        }

        if (target_item_index >= 0)
          break;

      }
      break;
  }

  /* Found target option.  Now select it
   */
  if (target_item_index >= 0) {

    let is_selected = false;
    let check_state;

    switch (tagname) {

      case "select":

        if (highlight_elements && highlight_select_item && element.options[target_item_index] !== null)
          element.options[target_item_index].style.border = "2px solid DarkBlue";

        if (typeof checkState !== 'undefined' && checkState != null) {
          check_state = checkState;
          console.log("is_selected", is_selected);
        }
        else {
          check_state = !element.options[target_item_index].selected;
        }

        try {
          if (element.options[target_item_index].selected != check_state) {
            element.options[target_item_index].selected = check_state;
            element.options[target_item_index].click();
          }
        }
        catch (err) {
          element.options[target_item_index].selected = check_state;
        }
        element.dispatchEvent(new Event('change'));

        return true;

      case "ol":
      case "ul":
      default:

        if (highlight_elements && highlight_select_item && items[target_item_index] !== null)
          items[target_item_index].style.border = "2px solid DarkBlue";

        if (typeof is_selected_logic !== 'undefined') {
          is_selected = eval('(' + "items[target_item_index]." + is_selected_logic + ')');
          console.log("is_selected", is_selected);
        }

        if (!is_selected) {
          try {
            items[target_item_index].firstElementChild.click();
          }
          catch (err) {
            try {
              items[target_item_index].firstChild.click();
            }
            catch (err) {
              items[target_item_index].click();
            }
          }
        }
        return true;

    }

  }

  return false;

}

/* Find the target select/list element based on selected element
 */
function selectListFind(startingElement) {

  let select_list = startingElement;
  let tagname = select_list.tagName.toLowerCase();

  /* First search down the DOM tree 
   */
  let select_tags = ["select", "ol", "ul", "table", "custom"];
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
  let stop_tags = ["select", "ul", "ol", "table", "custom", "html"];
  if (!stop_tags.includes(tagname)) {
    select_list = startingElement;
    while (!stop_tags.includes(tagname)) {

      select_list = select_list.parentNode;
      tagname = (typeof select_list === 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();

      custom_list_selectors.forEach((_custom_list_selector) => {
        if (tagname === _custom_list_selector.custom_list_selector?.tagName) {
          switch (_custom_list_selector.custom_list_selector?.attributeName) {
            case "class":
              if (select_list.classList.contains(_custom_list_selector.custom_list_selector?.attributeValue)) {
                tagname = 'custom';
                custom_list_selector = _custom_list_selector.custom_list_selector;
                custom_list_item_selector = _custom_list_selector.custom_list_item_selector;
              }
              break;
            default:
              if (select_list.attributes[_custom_list_selector.custom_list_selector?.attributeName]?.nodeValue === _custom_list_selector.custom_list_selector?.attributeValue) {
                tagname = 'custom';
                custom_list_selector = _custom_list_selector.custom_list_selector;
                custom_list_item_selector = _custom_list_selector.custom_list_item_selector;
              }
              break;
          }
        }
      })

    }
  }

  if (highlight_elements && highlight_selectlist && select_list !== null)
    select_list.style.border = "2px solid green";

  return { select_list, tagname };
}

/* Utility function
 */
function contains(selector, text) {
  let elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}

/* Find an <option>, <li> or <td> that has the target option text.  This can only work if using text to select
 */
if (typeof element !== 'undefined' && element !== null) {

  // Starting with TABLE/TD/BUTTON as this is for customer
  //
  if (typeof itemId === 'string') {

    let options = contains('td > button > span', itemId);
    if (typeof options !== 'undefined' && options.length > 0) {

      options[0].parentNode.setAttribute(
        "style",
        "border: 1px solid red;"
      );

      setTimeout(function () {
        options[0].parentNode.setAttribute(
          "style",
          "border: 0px solid black;"
        );
      }, 1000);

    }
  }
}

if (typeof element === 'undefined' || element === null) {
  throw new Error("Target List/Select not found or not visible");
}

/* If user pointed at a list item or for the target element then be nice
 *	try to find the parent element <select> or <ul>
 */
let results = selectListFind(element);
let tagname = results?.tagname.toLowerCase();
let select_list = results?.select_list;

let select_tags = ["select", "ol", "ul", "table", "custom"];
if (!select_tags.includes(tagname)) {
  throw new Error("Select Option(s) ==> Target element must be a select, ol, ul, option, li, table, or custom. Not: ", tagname);
}

/* Validate/Process checkState
 */
let is_selected_logic;
if (typeof checkState !== 'undefined') {
  if (checkState == true)
    is_selected_logic = "querySelector(\"input[type='checkbox']\").checked === true";
  else if (checkState == false)
    is_selected_logic = "querySelector(\"input[type='checkbox']\").checked === false";
  else if (checkState !== null)
    is_selected_logic = checkState;
}

/* Validate/Process matchType
 */
const stringMatch = {};
stringMatch['exact'] = function (str1, str2) { return (str1.trim() === str2.trim()); };
stringMatch['startswith'] = function (str1, str2) { return str1.trim().startsWith(str2.trim()); };
stringMatch['endswith'] = function (str1, str2) { return str1.trim().endsWith(str2.trim()); };
stringMatch['includes'] = function (str1, str2) { return str1.trim().includes(str2.trim()); };

let match_type = 'exact';
if (typeof matchType !== 'undefined' && matchType !== null) {
  match_type = matchType;
}

/* Normalize items to select
 */
let items_to_select = [];
if (typeof itemId !== 'object')
  items_to_select.push(itemId);
else
  items_to_select = itemId;

/* Execute (Loops each item to select and selects/deselects as appropriate and if possible)
 */
items_to_select.forEach(function (item_to_select) {

  selectItem(select_list, item_to_select, tagname, match_type, is_selected_logic);

});

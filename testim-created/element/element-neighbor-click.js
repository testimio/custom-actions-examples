/**
 *  Element Neighbor Click/Select
 * 
 *      Find an element by AI/Text/XPath or CSS and optionally a neighboring element based on xpath or relative position
 * 
 *  Parameters
 * 
 *      contextElement (HTML) [optional] : Container for either localizing the search area or a jump point
 * 
 *      elementLocator (JS) [optional] : used in initial object location by text or xpath
 *                          Example: "xpath://div"
 *                                   "xpath://*[@data-testid='login-button']"
 *                                   "Log In" - Find by innerText
 *                                   "css:tr:nth-child(2) > td:nth-child(1)"
 *                                   if unset then contextElement is the target element jump point
 * 
 *      relativeElementLocator (JS) [optional] : Method to find neighboring element - "RIGHT", "LEFT", "UP", "DOWN", <xpath>
 *             Examples:  "left", "right", "up", "down" 
 *                        "ancestor-or-self::div"
 *                        "/div"
 * 
 *      targetElementTypes (JS) [optional] : When using direction to find neighbor, filters target element type
 *                          Default  ["DIV", "INPUT", "BUTTON", "A"]
 * 
 *      selectedState (JS) [optional] : Only select item(s) if not checked/selected		
 *		    Examples: 	true    - Check
 *            			false   - Uncheck
 *                      <unset> - Toggle
 *                      <user-defined> - allows for option state interrogation            		
 *                    		"className === 'selected'"
 *		    		 		"querySelector(\"input[type='checkbox']\").checked"
 *                          'getAttribute("data-testid") === "checkbox-off"'
 *                          "checked === true"
 * 
 *  Notes
 * 
 *      Either contextElement or elementLocator must be defined
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 */

/* eslint-disable camelcase */
/* globals selectedState, maxOffset, stepDelta, elementLocator, document, contextElement, targetElementTypes, XPathResult, MouseEvent, ignoredElementTypes, relativeElementLocator */

/* Validate either contextElement or elementLocator is defined
 */
if ((typeof contextElement === 'undefined' || contextElement === null) && (typeof elementLocator === 'undefined' || elementLocator === null)) {
    throw new Error("Either contextElement or elementLocator must be defined");
}

/* Define target element types for location based searches (siblingFindByDirection)
 */
let target_element_types = ["DIV", "INPUT", "BUTTON", "A"];
if (typeof targetElementTypes !== 'undefined' && targetElementTypes !== null && targetElementTypes?.length > 0)
    target_element_types = targetElementTypes.map(e => e.toUpperCase());

let ignored_element_types = ['HTML'];
if (typeof ignoredElementTypes !== 'undefined' && ignoredElementTypes !== null)
    ignored_element_types = ignoredElementTypes.map(e => e.toUpperCase());

/* Validate/Process selectedState
 */
let selected_state = (typeof selectedState !== 'undefined' && selectedState !== null) ? selectedState : null;

let is_selected_logic;
if (typeof selected_state !== 'undefined') {
    if (selected_state == true)
        is_selected_logic = "checked === true";
    else if (selected_state == false)
        is_selected_logic = "checked === false";
    else if (selected_state !== null)
        is_selected_logic = selected_state;
}

let highlight_elements = false;
let highlight_target_element = true;
let highlight_parent_element = true;
let highlight_starting_element = false;
let highlight_ignored_elements = false;
let max_x_offset = 100;
let max_y_offset = 100;
let delta_x = 2;
let delta_y = 2;
let verbose = true;

function siblingFindByDirection(element, relativeElementLocator) {

    let element_bounds = element.getBoundingClientRect();
    let starting_element_top = element_bounds.top;
    let starting_element_bottom = element_bounds.bottom;
    let starting_element_left = element_bounds.left;
    let starting_element_right = element_bounds.right;

    let midline = starting_element_top + (starting_element_bottom - starting_element_top) / 2;
    let centerline = starting_element_left + (starting_element_right - starting_element_left) / 2;
    let test_x = starting_element_right + 1;
    let test_y = starting_element_bottom + 1;

    if (typeof maxOffset !== 'undefined' && maxOffset !== null) {
        max_x_offset = maxOffset;
        max_y_offset = maxOffset;
    }

    if (typeof stepDelta !== 'undefined' && stepDelta !== null) {
        max_x_offset = stepDelta;
        max_y_offset = stepDelta;
    }

    let search_direction = "Right";
    if (typeof relativeElementLocator !== 'undefined' && relativeElementLocator !== null && ["right", "left", "up", "down"].includes(relativeElementLocator?.toLowerCase()))
        search_direction = relativeElementLocator.toLowerCase();

    switch (search_direction.toLowerCase()) {
        case "up":
            test_y = starting_element_top - 1;
            break;
        case "down":
            test_y = starting_element_bottom + 1;
            break;
        case "left":
            test_x = starting_element_left - 1;
            break;
        case "right":
        default:
            test_x = starting_element_right + 1;
            break;
    }

    if (verbose)
        console.log("search_direction", search_direction, "test_x", test_x, "delta_x", delta_x, "test_y", test_y, "delta_y", delta_y);

    if (highlight_elements && highlight_starting_element)
        element.style.border = "1px solid blue";

    let done_searching = false;
    let max_steps = 500;
    let sibling_element = null;
    while ((sibling_element === undefined || sibling_element === null) && max_steps-- > 0 && !done_searching) {

        switch (search_direction.toLowerCase()) {
            case "up":
                test_y = test_y - delta_y;
                if (verbose)
                    console.log("Test Point = ", centerline, test_y);
                sibling_element = document.elementFromPoint(centerline, test_y);
                done_searching = test_y < starting_element_top - max_y_offset;
                break;
            case "down":
                test_y = test_y + delta_y;
                if (verbose)
                    console.log("Test Point = ", centerline, test_y);
                sibling_element = document.elementFromPoint(centerline, test_y);
                done_searching = test_y > starting_element_bottom + max_y_offset;
                break;
            case "left":
                test_x = test_x - delta_x;
                if (verbose)
                    console.log("Test Point = ", test_x, midline);
                sibling_element = document.elementFromPoint(test_x, midline);
                done_searching = test_x < starting_element_left - max_x_offset;
                break;
            case "right":
            default:
                test_x = test_x + delta_x;
                if (verbose)
                    console.log("Test Point = ", test_x, midline);
                sibling_element = document.elementFromPoint(test_x, midline);
                done_searching = test_x > starting_element_right + max_x_offset;
                break;
        }

        if (sibling_element !== undefined && sibling_element !== null) {

            try {

                if (verbose)
                    console.log(" found a \"", sibling_element.tagName.trim().toUpperCase() + "\" element");

                if (target_element_types != null && !target_element_types.includes(sibling_element.tagName.trim().toUpperCase())) {
                    if (highlight_elements && highlight_ignored_elements)
                        sibling_element.style.border = "1px solid red";
                    sibling_element = null;
                    if (verbose)
                        console.log("target_element_types does not contain a " + sibling_element.tagName.trim().toUpperCase())
                    continue;
                }
                if (ignored_element_types != null && ignored_element_types.includes(sibling_element.tagName.trim().toUpperCase())) {
                    if (highlight_elements && highlight_ignored_elements)
                        sibling_element.style.border = "1px solid red";
                    sibling_element = null;
                    if (verbose)
                        console.log("ignored_element_types matched " + sibling_element.tagName.trim().toUpperCase())
                    continue;
                }

                let sibling_element_bounds = sibling_element.getBoundingClientRect();

                switch (search_direction.toLowerCase()) {
                    case "up":
                        if (sibling_element_bounds.bottom > starting_element_top + 4)
                            sibling_element = null;
                        break;
                    case "down":
                        if (sibling_element_bounds.top < starting_element_bottom - 4)
                            sibling_element = null;
                        break;
                    case "left":
                        if (sibling_element_bounds.right > starting_element_left + 4) {
                            if (verbose)
                                console.log("sibling_element_bounds.right(" + sibling_element_bounds.right + ") >= starting_element_left(" + (starting_element_left + 4) + ")");
                            sibling_element.style.border = "1px solid grey";
                            sibling_element = null;
                        }
                        break;
                    case "right":
                    default:
                        if (sibling_element_bounds.left < starting_element_right - 4)
                            sibling_element = null;
                        break;
                }

                if (verbose)
                    console.log("sibling_element.innerText.toLowerCase()", sibling_element.innerText.toLowerCase(), relativeElementLocator.toLowerCase());

            }
            catch {
                //sibling_element = null;
            }
        }

        if (done_searching || test_y < 0 || test_x < 0)
            break;

    }

    if (sibling_element !== undefined && sibling_element !== null) {
        if (verbose)
            console.log("sibling_element found", sibling_element);
        if (highlight_elements && highlight_target_element)
            sibling_element.style.border = "2px solid green";
    }
    return sibling_element;
}

// Helper function to encode elementLocator so it can be used in XPath below
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function clickOnElem(elem, offsetX, offsetY) {
    let rect = elem.getBoundingClientRect(),
        posX = rect.left, posY = rect.top; // get elems coordinates
    // calculate position of click
    if (typeof offsetX == 'number') posX += offsetX;
    else if (offsetX == 'center') {
        posX += rect.width / 2;
        if (offsetY == null) posY += rect.height / 2;
    }
    if (typeof offsetY == 'number') posY += offsetY;
    // create event-object with calculated position
    let evt = new MouseEvent('click', { bubbles: true, clientX: posX, clientY: posY });
    elem.dispatchEvent(evt); // trigger the event on elem
}

try {

    let parent_element = (typeof contextElement === 'undefined' || contextElement === null) ? document.body : contextElement;
    if (verbose)
        console.log("parent_element", parent_element);

    if (highlight_elements && highlight_parent_element && parent_element !== null)
        parent_element.style.border = "2px solid DarkBlue";

    let element_locators = [];
    if (typeof elementLocator === 'object' && elementLocator !== null)
        element_locators = elementLocator;
    else if (typeof elementLocator === 'string')
        element_locators.push(elementLocator);
    else
        element_locators.push("contextElement");

    if (verbose)
        console.log("element_locators", element_locators);

    element_locators.forEach((element_locator) => {

        let matchingElements = [];

        if (element_locator === "contextElement" && document.body !== parent_element) {

            matchingElements.push(parent_element);

        }
        else {

            if (elementLocator.toLowerCase().startsWith("xpath:")) {
                if (verbose) console.log("USING xpath:", elementLocator.replace("xpath:", ""));
                matchingElements = document.evaluate(elementLocator.replace("xpath:", ""), parent_element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            }
            else if (elementLocator.toLowerCase().startsWith("css:")) {
                if (verbose) console.log("USING css:", elementLocator.toLowerCase().replace("css:", ""));
                matchingElements = document.querySelectorAll(elementLocator.toLowerCase().replace("css:", ""));
            }
            else {
                let xpath = "//*[translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = '" + escapeXml(element_locator.toLowerCase()) + "']";
                if (verbose) console.log("USING Text xpath:", xpath);
                matchingElements = document.evaluate(xpath, parent_element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            }

        }

        let matching_elements = [];
        try {
            let matchingElement = matchingElements.iterateNext();
            while (matchingElement) {
                if (verbose) console.log("matchingElement", matchingElement);
                matching_elements.push(matchingElement);
                matchingElement = matchingElements.iterateNext();
            }
        }
        catch {
            matching_elements = Array.from(matchingElements);
        }

        if (verbose)
            console.log(matching_elements?.length, matching_elements);

        if (matching_elements !== null) {

            matching_elements.forEach((matchingElement) => {

                if (verbose)
                    console.log("matchingElement", matchingElement);

                // do something with found element
                if (highlight_elements && highlight_starting_element)
                    matchingElement.style.border = "2px solid blue";

                let target_element = matchingElement;

                // if relativeElementLocator is specified find the first element in relativeElementLocator 
                //
                if (relativeElementLocator !== null) {
                    if (["right", "left", "up", "down"].includes(relativeElementLocator?.toLowerCase())) {
                        target_element = siblingFindByDirection(matchingElement, relativeElementLocator);
                    }
                    else {
                        let neighbor_xpath = relativeElementLocator;
                        if (verbose)
                            console.log("neighbor_xpath", neighbor_xpath);
                        let target_elements = document.evaluate(neighbor_xpath, matchingElement, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
                        target_element = target_elements.iterateNext();
                        if (verbose)
                            console.log("target_element found", target_element);
                    }
                }

                if (highlight_elements && highlight_target_element && target_element !== null)
                    target_element.style.border = "2px solid green";

                // Determine if the element is already checked/selected
                //
                let is_selected = false;
                if (typeof is_selected_logic !== undefined && target_element !== null) {
                    try {
                        is_selected = eval('(' + "target_element." + is_selected_logic + ')');
                        if (is_selected_logic?.length == 0)
                            is_selected = false;
                        console.log("is_selected", is_selected, is_selected_logic?.length);
                    }
                    catch (err) {
                        console.log("err", err);
                    }
                }

                console.log("target_element", target_element);
                if (target_element !== null && !is_selected) {
                    console.log("target_element.click()", target_element);
                    try {
                        target_element.click();
                    }
                    catch {
                        try {
                            //clickOnElem(target_element); // clicks on topLeft corner
                            clickOnElem(target_element, 'center'); // clicks on elements center
                            //clickOnElem(target_element, 5, 5); // clicks inside element, 30px from left and 40px from top
                        }
                        catch {
                            console.log("UGH!");
                        }
                    }
                }

                matchingElement = null;

            });

        }

    });

}
catch (err) {

    console.log(err);

}

/**
 *  Element(ByXPath) - Click
 * 
 *      Find an element by XPath and click it
 * 
 *  Parameters
 * 
 *      elementXPath (JS) : XPath used to find an element 
 * 
 *      parentElement (HTML) [optional] : Parent element for localizing the search area or providing a relative object for XPath
 * 
 *  Notes
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 */

/* eslint-disable camelcase */
/* globals elementXPath, document, parentElement, XPathResult, MouseEvent */

let highlight_elements = false;
let highlight_target_element = true;
let highlight_parent_element = true;
let verbose = false;

/* Validate elementXPath is defined
 */
if (typeof elementXPath === 'undefined' || elementXPath === null) {
    throw new Error("elementXPath is not defined");
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

    let parent_element = (typeof parentElement === 'undefined' || parentElement === null) ? document.body : parentElement;
    if (verbose)
        console.log("parent_element", parent_element);

    if (highlight_elements && highlight_parent_element && parent_element !== null)
        parent_element.style.border = "2px solid DarkBlue";

    let element_locators = [];
    if (typeof elementXPath === 'string')
        element_locators.push(elementXPath);
    else
        element_locators = elementXPath;

    if (verbose)
        console.log("element_locators", element_locators);

    element_locators.forEach((element_locator) => {

        let matchingElements = [];

        let xpath = element_locator;
        if (verbose) console.log("USING XPath:", xpath);
        matchingElements = document.evaluate(xpath, parent_element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

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

                let target_element = matchingElement;

                if (highlight_elements && highlight_target_element && target_element !== null)
                    target_element.style.border = "2px solid green";

                console.log("target_element", target_element);
                if (target_element !== null) {
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

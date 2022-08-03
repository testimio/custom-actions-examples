/**
 *  Element(ByXPath) - Wait Exists
 * 
 *      Wait for an element by XPath to be found in the DOM
 * 
 *  Parameters
 * 
 *      elementXPath (JS) : XPath used to find an element 
 * 
 *      anchorElement (HTML) [optional] : Anchor element for localizing the search area or providing a relative object for XPath
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
/* globals elementXPath, document, anchorElement, XPathResult, MouseEvent */

let highlight_elements = false;
let highlight_target_element = true;
let highlight_parent_element = true;
let verbose = false;

exportsTest.xpathElementFound = false;

/* Validate elementXPath is defined
 */
if (typeof elementXPath === 'undefined' || elementXPath === null) {
    throw new Error("elementXPath is not defined");
}

return new Promise((resolve, reject) => {

    try {

        let parent_element = (typeof anchorElement === 'undefined' || anchorElement === null) ? document.body : anchorElement;
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
                    exportsTest.xpathElementFound = true;

                    matchingElement = null;

                });

            }

        });

        if (exportsTest.xpathElementFound == true)
            resolve();
        else
            reject();

    }
    catch (err) {

        console.log(err);
        reject(err.message);

    }

});
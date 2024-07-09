/**
 *  Generic Modal Handler (aka "random popup killer")
 * 
 *      When a target object is displayed, it is immediately hidden.  
 *      Useful for random annoying alerts and offer messages
 * 
 *  Parameters
 * 
 *      targetElementCSS (JS) : CSS or CSS Array of target objects to watch and destroy
 * 
 *      highlightElements (JS) [optional] : Highlight Target Grid, Header, RowGroup, Cells for posterity (and debugging)
 * 
 *  Notes
 * 
 *		This custom step needs to be run once per page (after the hidden object is defined)
 *		
 *		This checks for a CHANGE to the visibility, so if the object is already visible it won't dismiss it
 *		You will need to dismiss it, but then after that it will be dismissed
 *
 *      Best place to add this is the Before Step Hook or early in the test flow (once per unique page)
 *
 *      If used in a before step hook then targetElementCSS parameter will be undefined 
 *		and you will need to add/manage your own list of CSS locators
 * 
 *      When defining static selectors, find the line that defines "target_element_selectors" 
 *		and add all desired elements to watch and destroy
 *      You can also define a test or suite level variable TARGET_ELEMENT_SELECTORS as this will use those if defined.
 * 
 *		Possible enhancement would be to find a close button and dismiss the popup
 *      
 *      You can try this out by using the page https://www.w3schools.com/howto/howto_css_modals.asp  
 *          Set targetElementCSS '#id01' 
 *          If you click the "Open Modal" button a modal dialog comes up.
 *          After you run this step and click the button again, it will not display.
 *
 *  Version       Date       Author          Details
 *      2.0.0     06/15/2023 Barry Solomon   Handle case where popup already is visible and highlight logic for debugging 
 *
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action" step
 *      Name it "Generic Modal Handler" 
 *      Create parameters
 *          targetElementCSS (JS)  
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 * 
 **/

/* globals MutationObserver, observer, targetElementCSS, TARGET_ELEMENT_SELECTORS, highlightElements, document */

const ELEMENT_HIGHLIGHT_BORDER = "2px solid Green";
var highlight_elements = false;
if (typeof highlightElements !== 'undefined' && highlightElements === true) {
    highlight_elements = true;
}

var TARGET_ELEMENT_SELECTORS = [
      `[id="attentive_overlay"]`
    , `[class="js-modal-close cx-modal-close-button"]`
    , `[class="yie-outer-element"]`
    , `[id^="yie-backdrop"]`
    , `[class="usabilla__overlay"]`
    , `[class*="cookie-consent-overlay"]`
    , `body`
    , `[y-type="custom-close-button"]`
];

// Set to a default list of CSS selectors as needed  
//
var target_element_selectors = [];

if (typeof TARGET_ELEMENT_SELECTORS !== 'undefined' && TARGET_ELEMENT_SELECTORS !== null) {
    if (typeof TARGET_ELEMENT_SELECTORS === 'string') {
        target_element_selectors.push(TARGET_ELEMENT_SELECTORS);
    }
    else {
        target_element_selectors = TARGET_ELEMENT_SELECTORS;
    }
}
if (typeof targetElementCSS !== 'undefined' && targetElementCSS !== null) {
    if (typeof targetElementCSS === 'string') {
        target_element_selectors.push(targetElementCSS);
    }
    else {
        target_element_selectors = targetElementCSS;
    }
}

// Only add the observer once
//
if (typeof observer === 'undefined' || observer === null) {

    var observer = new MutationObserver(function (mutations) {

        mutations.forEach(function (mutation) {

            if (mutation.type === 'attributes') {

                console.log('target.style.visibility = ' + mutation.target.style.visibility);
                if (highlight_elements)
                    mutation.target.style.border = ELEMENT_HIGHLIGHT_BORDER;

                if (mutation.target.id.includes("close")) {
                    try {
                        mutation.target.firstElementChild.click();
                    }
                    catch (err) {
                        try {
                            mutation.target.firstChild.click();
                        }
                        catch (err) {
                            mutation.target.click();
                        }
                    }
                } else {
                    if (mutation.target.tagName.toLowerCase() !== `body`) {
                        if (mutation.target.style.visibility !== "hidden") {
                            mutation.target.style.visibility = "hidden";
                        }
                        mutation.target.remove();
                    }
                }
            }
            else {

                target_element_selectors.forEach((target_element_selector) => {
                    if ((target_element_selector !== `body`) 
                     && !target_element_selector.includes("close")) {
                        let target_element = document.querySelector(target_element_selector);
                        if (target_element !== null) {
                            target_element.remove();
                        }
                    }
                });

            }

        });
    });

    let observerConfig = {
        attributes: true,
        attributeFilter: ['style'],
        childList: true,
        subtree: false,
        // characterData: true 
        // attributeOldValue: true,
        // characterDataOldValue: false,
    };

    /* Add an observer for all target elements
    */
    target_element_selectors.forEach((target_element_selector) => {
        let target_element = document.querySelector(target_element_selector);
        if (target_element !== null) {
            observer.observe(target_element, observerConfig);
        }
    });

}

/* Handle case where popup already is visible
*/
target_element_selectors.forEach((target_element_selector) => {

    let target_element = document.querySelector(target_element_selector);
    if (target_element !== null) {

        if (highlight_elements)
            target_element.style.border = ELEMENT_HIGHLIGHT_BORDER;

        console.log('target_element.style.visibility = ' + target_element.style.visibility);

        if (target_element_selector.includes("close")) {
            try {
                target_element.firstElementChild.click();
            }
            catch (err) {
                try {
                    target_element.firstChild.click();
                }
                catch (err) {
                    target_element.click();
                }
            }
        } else if (target_element_selector !== `body`) {

            if (target_element.style.visibility !== "hidden") {
                target_element.style.visibility = "hidden";
            }
            target_element.remove();

        }

    }

});

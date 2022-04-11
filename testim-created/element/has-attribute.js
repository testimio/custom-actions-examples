/**
 *  hasAttribute
 * 
 *      Validate that an element [does]/[does not] have an attribute defined and optionally validate its value
 * 
 *  Parameters
 *      element (HTML)
 *      attributeName  (JS)            - Name of attribute
 *      attributeValue (JS) [optional] - Value of attribute.  If defined 
 *      hasAttribute   (JS) [optional] - Attribute Exists/NotExists flag true/false.  Default (true).  
 * 
 *  Notes
 *      element and attributeName are the only required paramters for this "hasAttribute" function.
 *      add [attributeValue] if you want to validate an attribute's value in addition to its existence
 *      add [hasAttribute] if you want to support validating that an attribute does NOT exist for a target element
 * 
 *  Base Step
 *      Custom Validation
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

function hasAttribute(element, attributeName, attributeValue) {
    /* Validate required parameters
    */
    if (typeof (element) === 'undefined' || element === null)
        throw new Error("Target element has not been specified.");
    if (typeof (attributeName) === 'undefined' || attributeName === null)
        throw new Error("Parameter attributeName is undefined.");

    /* Validate Attribute exists/does not exist
    */
    let expected_has_attribute = (typeof (hasAttribute) !== 'undefined' && hasAttribute !== null) ? hasAttribute : true;
    let actual_has_attribute = element.hasAttribute(attributeName);
    if (actual_has_attribute !== expected_has_attribute) {
        console.error("Element " + ((!expected_has_attribute) ? "HAS" : "DOES NOT HAVE") + " the attribute '" + attributeName.toUpperCase() + "' when it should " + ((expected_has_attribute) ? "HAVE it." : "NOT HAVE it.") + "\n" + element.outerHTML);
        throw new Error("Element " + ((!expected_has_attribute) ? "HAS" : "DOES NOT HAVE") + " the attribute '" + attributeName.toUpperCase() + "' when it should " + ((expected_has_attribute) ? "HAVE it." : "NOT HAVE it.") + "\n" + element.outerHTML);
    }

    /* Validate Attribute value (if defined)
    */
    let expected_value = (typeof (attributeValue) !== 'undefined' && attributeValue !== null) ? attributeValue : null;
    if (expected_value !== null) {
        let actual_value = element.getAttribute(attributeName);
        if (actual_value !== expected_value) {
            console.error("Element attribute [" + attributeName + "]  Expected Value: '" + expected_value + "' Actual Value: '" + actual_value + "'\n" + element.outerHTML);
            throw new Error("Element attribute [" + attributeName + "]  Expected Value: '" + expected_value + "' Actual Value: '" + actual_value + "'\n" + element.outerHTML);
        }
    }

    return true;
}

return hasAttribute(element, attributeName, attributeValue);
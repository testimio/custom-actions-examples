/**
 *  Validate Currency
 * 
 *      Vaildate that an element displays an expected value formatted as currency
 * 
 *  Parameters
 *      element (HTML)
 *      expectedValue (JS) : Expected value.  Must be numeric
 *      locale (JS) [optional] : Locale for currency value.  Default: 'en-US'
 *      currency (JS) [optional] : Currency type.  Default: 'USD'
 * 
 *  Notes
 *      https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
 * 
 *  Base Step
 *      Custom Validation
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

/* Validate required parameters
 */
if (typeof (element) === 'undefined' || element === null)
    throw new Error("Target element has not been specified.");

if (typeof (expectedValue) === 'undefined' || expectedValue === null)
    throw new Error("expectedValue has not been specified.");

if (typeof (expectedValue) !== 'number')
    expectedValue = Number(expectedValue);

/* Default optional parameters
 */
eval('locale   = (typeof locale   !== "undefined" && locale   !== null) ? locale   : "en-US" ');
eval('style    = (typeof style    !== "undefined" && style    !== null) ? style    : "currency" ');
eval('currency = (typeof currency !== "undefined" && currency !== null) ? currency : "USD" ');

function validateCurrency(element, expectedValue, locale) {

    let actual_value = element.innerText;
    let expected_value = Intl.NumberFormat(locale, { style: style, currency: currency, }).format(Number(expectedValue));

    console.log(`actual_value: ${actual_value}, expected_value: ${expected_value}`);

    if (actual_value !== expected_value)
        throw new Error(`actual_value: ${actual_value}, expected_value: ${expected_value}`);

}
return validateCurrency(element, expectedValue, locale);

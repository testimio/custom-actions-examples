/**
 *  Validate HTML Markup
 * 
 *      Validates the current page's HTML markup contains certain markup
 * 
 *  Parameters 
 * 
 *      element (HTML)
 * 
 *      expectedMarkup (JS)
 * 
 *      matchType [optional] : Textual match type when validating HTML markup 
 *		            Examples: exact, startswith, endswith, contains (default), includes
 * 
 *  Base Step Type
 * 
 *      Custom Validation
 */

/* eslint-disable no-global-assign */
/* globals document, element, element, expectedMarkup, matchType */

if (typeof element === 'undefined' || element === null) {
    element = document.documentElement;
}

if (typeof expectedMarkup === 'undefined' || expectedMarkup === null) {
    throw new Error("Error: expectedMarkup is undefined");
}

let matchtype = "contains";
if (typeof matchType !== 'undefined' && matchType !== null){
    matchtype = matchType.toLowerCase();
}

/* Convenience functions used for matching
 */
const stringMatch = {};
stringMatch['exact'] = function (str1, str2) { return (str1 === str2); };
stringMatch['startswith'] = function (str1, str2) { return str1.startsWith(str2); };
stringMatch['endswith'] = function (str1, str2) { return str1.endsWith(str2); };
stringMatch['includes'] = function (str1, str2) { return str1.includes(str2); };
stringMatch['contains'] = function (str1, str2) { return str1.includes(str2); };

/* Validate
 */
if (stringMatch[matchtype](element.innerHTML.toString(), expectedMarkup) === false) {
    throw new Error("Expected: '" + expectedMarkup + "', Actual: '" + element.innerHTML.toString() +"', MatchType: " + matchtype);
}
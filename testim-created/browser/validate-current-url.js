/**
 *  Validate Current URL
 * 
 *      Validates the current page's URL
 * 
 *  Parameters 
 * 
 *      expectedURL (JS)
 * 
 *      matchType [optional] : Textual match type when validating URL 
 *		            Examples: exact, startswith (default), endswith, includes
 * 
 *  Step Type
 * 
 *      Custom Validation
 */

/* globals window, expectedURL,matchType */

if (typeof expectedURL === 'undefined' || expectedURL === null) {
    throw new Error("Error: expectedURL is undefined");
}

let matchtype = "startswith";
if (typeof matchType !== 'undefined' && matchType !== null)
    matchtype = matchType.toLowerCase();

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
if (stringMatch[matchtype](window.location.href.toString(), expectedURL) === false) {
    throw new Error("Expected: '" + expectedURL + "', Actual: '" + window.location.href +"', MatchType: " + matchtype);
}

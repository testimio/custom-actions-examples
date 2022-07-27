 /**      
 *  Console Log - Validate Text
 * 
 *      Validates the console log output captured via "Console Log - Override" 
 * 
 *  Parameters
 * 
 *      expectedText (JS)
 * 
 *      matchType [optional] : Textual match type (Default: contains)
 *		            Examples: "exact", "startswith", "endswith", "includes", "contains"
 *                            "notexact", "notstartswith", "notendswith", "notincludes", "notcontains"
 *                            "NotFound", "NotExists", false
 * 
 *  Version       Date       Author          Details
 *      1.0.0     07/18/2022  Barry Solomon   Inital implementation
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Validation
 *
 **/

/* eslint-disable camelcase */
/* globals matchType, expectedText */

exportsTest.console_everything = console.everything;

/* Convenience functions used for matching
 */
const stringMatch = {};
stringMatch['exact'] = function (str1, str2) { return (str1 === str2); };
stringMatch['startswith'] = function (str1, str2) { return str1.startsWith(str2); };
stringMatch['endswith'] = function (str1, str2) { return str1.endsWith(str2); };
stringMatch['includes'] = function (str1, str2) { return str1.includes(str2); };
stringMatch['contains'] = function (str1, str2) { return str1.includes(str2); };
stringMatch['notexact'] = function (str1, str2) { return (str1 !== str2); };
stringMatch['notstartswith'] = function (str1, str2) { return !str1.startsWith(str2); };
stringMatch['notendswith'] = function (str1, str2) { return !str1.endsWith(str2); };
stringMatch['notincludes'] = function (str1, str2) { return !str1.includes(str2); };
stringMatch['notcontains'] = function (str1, str2) { return !str1.includes(str2); };

let match_type = 'contains';
if (typeof matchType !== 'undefined' && matchType !== null) {
    if (matchType == false || ["notfound", "notexists"].includes(matchType.toLowerCase()))
    match_type = "notcontains";
    match_type = matchType.toLowerCase();
}

let matched = null;

let actual_text = JSON.stringify(console.everything);

if (match_type.startsWith("not")) {
    matched = !stringMatch[match_type.replace("not", "")](actual_text, expectedText);
}
else {
    matched = stringMatch[match_type](actual_text, expectedText);
}

if (!matched) {
    throw new Error(`Validation (${match_type}) failed. expectedText: ${expectedText}, actualText: ${actual_text}`);
}


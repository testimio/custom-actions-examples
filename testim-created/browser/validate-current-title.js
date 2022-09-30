/**
 *  Validate Current Title
 * 
 *      Validates the current page's title
 * 
 *  Parameters 
 * 
 *      expectedTitle (JS)
 * 
 *      matchType (JS) [optional] : Textual match type when validating Title 
 *		            Examples: exact, startswith (default), endswith, includes
 * 
 *  Step Type
 *      Custom Validation
 * 
 *  Version       Date          Author          Details
 *      1.0.0     09/29/2022    Barry Solomon   Initial Version
 *  
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

/* globals document, expectedTitle, matchType */

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

let actualTitle = document.title;

copyToClipboard(actualTitle);
exportsTest['windowTitle'] = actualTitle;

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
if (typeof expectedTitle === 'undefined' || expectedTitle === null) {
    if (stringMatch[matchtype](actualTitle, expectedTitle) === false) {
        throw new Error("Expected: '" + expectedTitle + "', Actual: '" + actualTitle + "', MatchType: " + matchtype);
    }
}

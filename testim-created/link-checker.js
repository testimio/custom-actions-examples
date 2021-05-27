/***
 * CLI Link Checker
 * 
 *      Detect broken links and broken fragments for a given url
 *      Based on https://github.com/w3c/node-linkchecker
 * 
 * Parameters
 *      nlc (NPM) - node-linkchecker@latest 
 *					https://github.com/w3c/node-linkchecker
 *      url (JS)  - Url to check
 * 
 *  Returns
 *      brokenLinks     - Array of full links that are not quite right
 *      brokenFragments - Array of partial links that are not quite right
 *  
 *  Base Step
 *      CLI Action
 * 
 *  Installation
 *      Create a new "CLI action" step
 *      Name it "Link Checker (CLI)"
 *      Create parameters
 *          nlc (NPM) and set its value = node-linkchecker @ latest 
 *          url (JS) 
 *      Set the new custom action's function body to this javascript
 *      Override timeout => Step timeout (milliseconds) = 10000, higher if lots of links on the page and you get timeouts
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */

var options = {
    schemes: ["http:", "https:"],
    userAgent: "W3C node linkchecker",
    fragments: false
};

exportsTest.brokenLinks     = [];
exportsTest.brokenFragments = [];

return new Promise((resolve, reject) => {

    nlc.check(url, options).then(function (result) {

        exportsTest.brokenLinks     = result.brokenLinks;
        exportsTest.brokenFragments = result.brokenFragments;

        if (result.brokenLinks.length > 0) {
            console.error(result.brokenLinks);
            reject("Error: " + url + ' contains broken links ' + JSON.stringify(result.brokenLinks,null,2));
        }
        if (result.brokenFragments.length > 0) {
            console.error(result.brokenFragments);
            reject("Error: " + url + ' contains broken fragments ' + JSON.stringify(result.brokenFragments,null,2));
       }
       resolve();

    });
    
});

/**
 * Network Performance Summary
 * 
 *      Creates a summary of network requests with min/max/avg duration and request size
 *          count, 
 *          minDuration, maxDuration, aveDuration, totDuration
 *          minResponseSize, maxResponseSize, aveResponseSize, totResponseSize
 * 
 * Parameters
 * 
 *      networkRequestURLs  (JS) [optional] : Array of response urls to include
 *              Example: ["www.amazon.com", "www.google.com"]
 *      networkRequestTypes (JS) [optional] : Array of response types to include
 *              Example: ["Image", "Media", "Document", "Stylesheet", "Script", "Font", "XHR"]
 *      consoleLogDisable (JS) [optional] : Do not output to the console (set true when using Transaction Summary Report as results are displayed there)
 * 
 *  Notes
 *      Output to console is done using a console.table command and is best visualized in the chrome debugger
 * 
 *  Returns
 *      networkPerformanceSummaryIndex - Index of last networkRequests entry checked.  
 *   
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Network Validation
 * 
 *  Installation
 *      Create a new "Network Performance Summary"
 *      Name it "Network Performance Check"
 *      Optional - add optional parameters
 *          networkRequestURLs  (JS) 
 *          networkRequestTypes (JS)  
 *          consoleLogDisable (JS)
 *      Set the new custom action's function body to this javascript
 *      Override timeout => Step timeout (milliseconds) = 2000
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 **/

/* global networkRequestTypes, networkRequestURLs, networkRequests, consoleLogDisable */

/*  Used for debugging.  Enable/disable writing interim data to the console
 */
let verbose = false;

let targetRequestTypes = null;
if (typeof networkRequestTypes !== 'undefined' && networkRequestTypes !== null)
    targetRequestTypes = networkRequestTypes;

let targetRequestUrls = null;
if (typeof networkRequestURLs !== 'undefined' && networkRequestURLs !== null)
    targetRequestUrls = networkRequestURLs;

exportsTest.networkPerformanceSummaryIndex = networkRequests.length;

const filteredNetworkRequests = networkRequests.filter((request, index) => {

    /* Filter requests to only those types that are interesting
    */
    if (targetRequestTypes !== null && !targetRequestTypes.includes(request.type)) {
        if (verbose)
            console.log("skipping request.type: ", request.type);
        return false;
    }

    /* Only consider requests from certain domains/subdomains 
     */
    if (targetRequestUrls !== null && !targetRequestUrls.some((requestUrl) => request.url.includes(requestUrl))) {
        if (verbose)
            console.log("skipping request.url: ", request.url);
        return false;
    }

    request.count = (request.count || 0) + 1;

    request.totDuration = (request.endTime !== undefined && request.startTime != undefined) ? request.endTime - request.startTime : 0;
    request.minDuration = request.totDuration;
    request.maxDuration = request.totDuration;
    request.aveDuration = request.totDuration;

    request.totResponseSize = request.responseSize || 0;
    request.minResponseSize = request.totResponseSize;
    request.maxResponseSize = request.totResponseSize;
    request.aveResponseSize = request.totResponseSize;

    const prevIndex = networkRequests.findIndex(r => r.url == request.url);
    if (prevIndex < index) {
        const previousRequest = networkRequests[prevIndex];
        previousRequest.count += 1;
        previousRequest.totDuration += request.totDuration;
        previousRequest.totResponseSize += request.totResponseSize;
        previousRequest.minDuration = Math.min(request.minDuration, previousRequest.minDuration);
        previousRequest.maxDuration = Math.max(request.maxDuration, previousRequest.maxDuration);
        previousRequest.aveDuration = previousRequest.totDuration / previousRequest.count;
        previousRequest.minResponseSize = Math.min(request.minResponseSize, previousRequest.minResponseSize);
        previousRequest.maxResponseSize = Math.max(request.maxResponseSize, previousRequest.maxResponseSize);
        previousRequest.aveResponseSize = previousRequest.totResponseSize / previousRequest.count;
    }
    return prevIndex === index;
})
exportsTest.networkRequestStats = filteredNetworkRequests.map(({ url, count, minDuration, maxDuration, aveDuration, totDuration, minResponseSize, maxResponseSize, aveResponseSize, totResponseSize }) => ({ url, count, minDuration, maxDuration, aveDuration, totDuration, minResponseSize, maxResponseSize, aveResponseSize, totResponseSize }));

if (typeof consoleLogDisable === 'undefined' || consoleLogDisable === true) {
    console.table(exportsTest.networkRequestStats.sort((a, b) => b.maxDuration - a.maxDuration));
    console.table(JSON.stringify(exportsTest.networkRequestStats.sort((a, b) => b.maxDuration - a.maxDuration)));
}

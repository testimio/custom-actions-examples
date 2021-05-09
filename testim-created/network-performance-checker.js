/**
 * Network Performance Check
 * 
 *      Validates that all network requests are completed under maxResponseTime milliseconds
 * 
 * Parameters
 * 
 *      networkRequests (readonly) : Domain of network requests in consideration
 * 	    maxResponseTime     (JS) :  Max alloted time for any network request to finish
 * 
 *      networkRequestURLs  (JS) [optional] : Array of response urls to validate
 *              Example: ["www.amazon.com", "www.google.com"]
 *      networkRequestTypes (JS) [optional] : Array of response types to validate
 *              Example: ["Image", "Media", "Document", "Stylesheet", "Script", "Font", "XHR"]
 * 
 *  Returns
 *      slowNetworkRequests          - Array of network requests that were slower than maxResponseTime
 *      networkPerformanceCheckIndex - Index of last networkRequests entry checked.  Prevents rechecking requests down the line 
 *  
 *  Notes
 *      Warning: if setting verbose to true then performance may be affected due to massive amounts of console logging
 * 
 *      networkRequests fields
 *         isBlocked
 *         isDone
 *         method
 *         isCancelled
 *         url
 *         source
 *         tab
 *         type
 *         statusCode
 *         statusText
 *         startTime
 *         protocol
 *         responseSize
 *         endTime
 * 
 *  Base Step
 *      Network Validation
 * 
 *  Installation
 *      Create a new "Network Validation"
 *      Name it "Network Performance Check"
 *      Create parameters
 *          maxResponseTime (JS)
 *      Optional - add optional parameters
 *          networkRequestURLs  (JS) 
 *          networkRequestTypes (JS)  
 *      Set the new custom action's function body to this javascript
 *      Override timeout => Step timeout (milliseconds) = 2000
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
 **/

/*  Used for debugging.  Enable/disable writing interim data to the console
 *      WARNING: Setting this true may affect performance of the run and more importantly loading of test results!
 */

/* global maxResponseTime, networkRequestTypes, networkRequestURLs, networkRequests */
let verbose = false;

if (typeof maxResponseTime == 'undefined' || maxResponseTime == null)
    throw new Error("maxResponseTime is undefined");

let wantedRequestTypes = null;
if (typeof networkRequestTypes !== 'undefined' && networkRequestTypes !== null)
    wantedRequestTypes = networkRequestTypes;

let wantedRequestUrls = null;
if (typeof networkRequestURLs !== 'undefined' && networkRequestURLs !== null)
    wantedRequestUrls = networkRequestURLs;

console.log("Network Performance Check: maxResponseTime(" + maxResponseTime + ")");

let networkPerformanceCheckIndexLast = 0;
let networkPerformanceCheckIndex = null;
if (typeof networkPerformanceCheckIndex !== 'undefined' && networkPerformanceCheckIndex !== null) {
    networkPerformanceCheckIndexLast = networkPerformanceCheckIndex;
}

exportsTest.networkPerformanceCheckIndex = networkRequests.length;

if (verbose) {
    console.log("networkRequests.length", networkRequests.length);
    console.log("networkPerformanceCheckIndexLast", networkPerformanceCheckIndexLast);
    console.log("exportsTest.networkPerformanceCheckIndex", exportsTest.networkPerformanceCheckIndex);
}

/* Find all slow network requests and return them in _networkRequestsSlow
 */
let _networkRequestsSlow = networkRequests.filter((request, index) => {

    /* Filter requests to only those types that are interesting
    */
    if (wantedRequestTypes !== null && !wantedRequestTypes.includes(request.type)) {
        if (verbose)
            console.log("skipping request.type: ", request.type);
        return false;
    }

    /* Only consider requests from certain domains/subdomains 
     */
    if (wantedRequestUrls !== null && !wantedRequestUrls.some((networkRequestUrl) => request.url.includes(networkRequestUrl))) {
        if (verbose)
            console.log("skipping request.url: ", request.url);
        return false;
    }

    /* Only consider requests since last instantiation 
     */
    if (index < networkPerformanceCheckIndexLast) {
        return false;
    }

    //if (verbose)
    //    console.log("checking request.url: ", request.url);

    /* Calculate duration and add to request as well as maxResponseTime for posterity
     */
    request.duration = (request.endTime !== undefined && request.startTime != undefined) ? request.endTime - request.startTime : 0;
    request.maxResponseTime = maxResponseTime;

    return request.duration > maxResponseTime;

});

//let slowNetworkRequests = _networkRequestsSlow.map(({ url, duration, responseSize, protocol, method, statusCode, statusText, source, isBlocked, isDone, isCancelled, type, ...theRest }) => ({ url, duration, responseSize, protocol, method, statusCode, statusText, source, isBlocked, isDone, isCancelled, type }));
let slowNetworkRequests = _networkRequestsSlow.map(({ url, duration, responseSize, protocol, method, statusCode, statusText, isBlocked, isDone, isCancelled, type }) => ({ url, duration, responseSize, protocol, method, statusCode, statusText, isBlocked, isDone, isCancelled, type }));
exportsTest.slowNetworkRequests = slowNetworkRequests;

if (slowNetworkRequests !== null && slowNetworkRequests.length > 0) {
    console.error('There were ' + slowNetworkRequests.length + ' slow requests: [duration > ' + maxResponseTime + '] found.');  
    for (const request of slowNetworkRequests)
        console.error(` ==>`, JSON.stringify(request));
    throw new Error('There were ' + slowNetworkRequests.length + ' slow requests: [duration > ' + maxResponseTime + '] found.  See Console Log for details');
}

/**
 * Network Validate Requests
 * 
 *  Validate that a network request was made and optionally validate that the status is correct and/or is not slower than maxDuration (ms)
 * 
 *  Parameters
 *      networkRequests (readonly)  : Domain of network requests in consideration
 *      requestUrl (JS)             : Target network request 
 *      statusCode (JS) [optional]  : Expected status code
 *      maxDuration (JS) [optional] : max response time
 *          
 *  Base Step
 *      Network Validation
 * 
 *  Notes
 *      if statusCode is not set then it will not be checked
 *      if maxDuration is not set then it will not be checked
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
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Network Validation
 * 
 *  Installation
 *      Create a new "Network Validation"
 *      Name it "Network Validate Request"
 *      Create parameters
 *          requestUrl (JS)
 *      Optional - add optional parameters
 *          statusCode (JS) [optional]
 *          maxDuration (JS) [optional] 
 *      Set the new custom action's function body to this javascript
 *      Override timeout => Step timeout (milliseconds) = 1000
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */

/* globals networkRequests, requestUrl, statusCode, maxDuration, networkValidationCheckIndex, networkValidationCheckIndexLast */

/*  Used for debugging.  Enable/disable writing interim data to the console
 */
let verbose = false;

// Validate that expectedNetworkRequest is defined
//
if (typeof requestUrl === 'undefined' || requestUrl === null)
    throw new Error("requestUrl is undefined");

let expectedNetworkRequest = {
    "url": requestUrl,
    "statusCode": statusCode,
    "maxDuration": maxDuration,
}

// Only consider requests since last time 
//
let networkPerformanceCheckIndexLast = 0;
if (typeof networkValidationCheckIndex !== 'undefined' && networkValidationCheckIndex !== null)
    networkPerformanceCheckIndexLast = networkValidationCheckIndex;

exportsTest.networkValidationCheckIndex = networkRequests.length;

if (verbose)
    console.table(networkRequests)

// Result object
//
let networkValidationResults = {
    success: false,
    numMatchedURLs: 0,
    errorDetails: {
        url: null,
        errors: [],
    },
    matchingRequests: []
}

// Loop all requests and look for matches/status
//
let _networkRequestMatches = networkRequests.filter((request, index) => {

    if (verbose)
        console.log("networkRequests.filter", index);

    /* Only consider requests since last instantiation 
     */
    if (index < networkPerformanceCheckIndexLast) {
        return false;
    }

    let match = request.url.includes(expectedNetworkRequest.url);
    if (match) {

        // Calculate call duration
        //
        request.duration = (request.endTime !== undefined && request.startTime != undefined) ? request.endTime - request.startTime : 0;

        // Run all checks and note statuses
        //
        request.validateMaxDuration = (typeof expectedNetworkRequest.maxDuration === 'undefined' || expectedNetworkRequest.maxDuration === null || request.duration <= expectedNetworkRequest.maxDuration) ? true : false;
        request.validateStatusCode = (typeof expectedNetworkRequest.statusCode === 'undefined' || expectedNetworkRequest.statusCode === null || request.statusCode == expectedNetworkRequest.statusCode) ? true : false;

        // Mark success based on sub-check validations
        //
        if (!networkValidationResults.success) {

            networkValidationResults.success = request.validateMaxDuration && request.validateStatusCode;

            if (!networkValidationResults.success) {

                networkValidationResults.errorDetails.url = request.url;

                if (request.validateMaxDuration === false)
                    networkValidationResults.errorDetails.errors.push("MaxDuration: Actual: " + request.duration + " Expected MaxDuration " + expectedNetworkRequest.maxDuration);
                if (request.validateStatusCode === false)
                    networkValidationResults.errorDetails.errors.push("StatusCode: Expected: " + expectedNetworkRequest.statusCode + ", Actual: " + request.statusCode);
            }

        }

        networkValidationResults.numMatchedURLs += 1;
    }

    return (match);

});
networkValidationResults.matchingRequests = _networkRequestMatches.map(({ url, validateStatusCode, validateMaxDuration, duration, responseSize, protocol, method, statusCode, statusText, source, isBlocked, isDone, isCancelled, type }) => ({ url, validateStatusCode, validateMaxDuration, duration, responseSize, protocol, method, statusCode, statusText, source, isBlocked, isDone, isCancelled, type }));

if (verbose)
    console.table(networkValidationResults.matchingRequests)

//
// Validation
//         

if (networkValidationResults.matchedRequests === null && networkValidationResults.matchedRequests.length === 0) {
    console.error('No call(s) to URL "' + expectedNetworkRequest + '" found. (LNIID:' + networkValidationCheckIndexLast + ")");
    throw new Error(JSON.stringify('No call(s) to URL "' + expectedNetworkRequest + '" found. (LNIID:' + networkValidationCheckIndexLast + ")"));
}

if (networkValidationResults.success === false) {
    console.error(JSON.stringify(networkValidationResults.errorDetails));
    throw new Error(JSON.stringify(networkValidationResults.errorDetails));
}

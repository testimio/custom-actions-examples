/**
 * Network Validate Requests
 * 
 *      Validate that network requests were made and optionally validate response status(es) and/or request(s) are not slower than maxDuration (ms)
 * 
 *  Parameters
 *      requestUrlFilter (JS)       : Target network request filter.  Partial match to URL to pick a subset of requests to validate
 *                                      Examples: "demo.testim.io" or ["demo.testim.io/login", "demo.testim.io/checkout"]
 *      statusCode (JS) [optional]  : Expected status code(s) to be returned 
 *                                      Examples: 200 or [200,204]
 *      maxDuration (JS) [optional] : max response time
 *          
 *  Base Step
 *      Network Validation
 * 
 *  Notes
 *      if statusCode is not set then it will not be checked
 *      if maxDuration is not set then it will not be checked
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

/* eslint-disable no-var */
/* eslint-disable camelcase */
/* globals networkRequests, requestUrlFilter, statusCode, maxDuration, networkValidationCheckIndex */

/*  Used for debugging.  Enable/disable writing interim data to the console
 */
var verbose = false;

// Validate that requestUrlFilter is defined
//
if (typeof requestUrlFilter === 'undefined' || requestUrlFilter === null)
    throw new Error("requestUrlFilter is undefined");

var expectedNetworkRequests = [];
if (typeof requestUrlFilter === 'string') {
    expectedNetworkRequests.push({
        "url": requestUrlFilter,
        "statusCode": statusCode,
        "maxDuration": maxDuration,
    });
}
else {
    requestUrlFilter.forEach((requestUrl) => {
        if (typeof requestUrl === 'string') {
            expectedNetworkRequests.push({
                "url": requestUrl,
                "statusCode": statusCode,
                "maxDuration": maxDuration,
            });
        }
        else {
            expectedNetworkRequests = requestUrlFilter;
        }
    });
}
if (verbose) {
    console.log("requestUrlFilter", requestUrlFilter);
    console.log("expectedNetworkRequests", JSON.stringify(expectedNetworkRequests));
}

// Only consider requests since last time 
//
var networkValidationCheckIndexLast = 0;
if (typeof networkValidationCheckIndex !== 'undefined' && networkValidationCheckIndex !== null)
    networkValidationCheckIndexLast = networkValidationCheckIndex;

exportsTest.networkValidationCheckIndex = networkRequests.length;

if (verbose)
    console.table(networkRequests)

// Result object
//
var networkValidationResults = {
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
var _networkRequestMatches = networkRequests.filter((request, index) => {

    /* Only consider requests since last instantiation 
     */
    if (index < networkValidationCheckIndexLast) {
        return false;
    }

    var expected_network_request_match = null;

    var expected_network_request_matches = Array.from(expectedNetworkRequests).filter(expectedNetworkRequest => {
        return request.url.includes(expectedNetworkRequest.url);
    });

    if (verbose)
        console.log("expected_network_request_matches?.length", expected_network_request_matches?.length);

    var match = (expected_network_request_matches?.length > 0);
    if (match) {

        expected_network_request_match = expected_network_request_matches[0];
        if (verbose)
            console.log("expected_network_request_match", JSON.stringify(expected_network_request_match, null, 2));

        // Calculate call duration
        //
        request.duration = (request.endTime !== undefined && request.startTime != undefined) ? request.endTime - request.startTime : 0;

        // Run all checks and note statuses
        //
        var expected_statuses = [];
        if (typeof expected_network_request_match.statusCode === 'object')
            expected_statuses = expected_network_request_match.statusCode;
        else
            expected_statuses.push(expected_network_request_match.statusCode);

        request.validateStatusCode = (typeof expected_network_request_match.statusCode === 'undefined' || expected_network_request_match.statusCode === null || expected_statuses.includes(request.statusCode)) ? true : false;
        request.validateMaxDuration = (typeof expected_network_request_match.maxDuration === 'undefined' || expected_network_request_match.maxDuration === null || request.duration <= expected_network_request_match.maxDuration) ? true : false;

        // Mark success based on sub-check validations
        //
        if (!networkValidationResults.success) {

            networkValidationResults.success = request.validateMaxDuration && request.validateStatusCode;

            if (!networkValidationResults.success) {

                networkValidationResults.errorDetails.url = request.url;

                if (request.validateMaxDuration === false)
                    networkValidationResults.errorDetails.errors.push(request.url + ":: MaxDuration: Actual: " + request.duration + " Expected MaxDuration " + expected_network_request_match.maxDuration);
                if (request.validateStatusCode === false)
                    networkValidationResults.errorDetails.errors.push(request.url + ":: StatusCode: Expected: " + expected_network_request_match.statusCode + ", Actual: " + request.statusCode);
            }

        }

        networkValidationResults.numMatchedURLs += 1;

        request.status = networkValidationResults.success;
    }

    return (match);

});
networkValidationResults.matchingRequests = _networkRequestMatches.map(({ url, status, validateStatusCode, validateMaxDuration, duration, responseSize, protocol, method, statusCode, statusText, source, isBlocked, isDone, isCancelled, type }) => ({ url, status, validateStatusCode, validateMaxDuration, duration, responseSize, protocol, method, statusCode, statusText, source, isBlocked, isDone, isCancelled, type }));

if (verbose)
    console.table(networkValidationResults.matchingRequests)

//
// Validate all expectedNetworkRequests were found
//       
Array.from(expectedNetworkRequests).forEach(expectedNetworkRequest => {
    // Validate all URLs were found
    if (!Array.from(networkValidationResults.matchingRequests).some(networkValidationResult => networkValidationResult.url.includes(expectedNetworkRequest.url))) {
        console.error(`${expectedNetworkRequest.url} not found in networkRequests`);
        throw new Error(`${expectedNetworkRequest.url} not found in networkRequests`);
    }
});

// Validate all URLs found have successful validations
if (networkValidationResults?.errorDetails?.errors?.length > 0) {
    console.error("Error: " + JSON.stringify(networkValidationResults?.errorDetails?.errors,null,2));
    throw new Error("Error: " + JSON.stringify(networkValidationResults?.errorDetails?.errors,null,2));
}

/** 
 *  SOAP Request
 *
 *	Parameters
 *  
 *      url (JS)    
 *          example 'https://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php'
 *      soapHeaders (JS)
 *          example: {
 *                      "user-agent": "sampleTest",
 *                      "Content-Type": "text/xml;charset=UTF-8",
 *                      "soapAction": "https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl#LatLonListZipCode"
 *                   }
 *      soapenv (JS)  : SOAP XML
 *          example:
 *              '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ndf="https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl">
 *                 <soapenv:Header/>
 *                 <soapenv:Body>
 *                    <ndf:LatLonListZipCode soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
 *                       <zipCodeList xsi:type="dwml:zipCodeListType" xmlns:dwml="https://graphical.weather.gov/xml/DWMLgen/schema/DWML.xsd">80127</zipCodeList>
 *                    </ndf:LatLonListZipCode>
 *                 </soapenv:Body>
 *              </soapenv:Envelope>'
 *		soapRequest (npm) : easy-soap-request
 *		prettifyXml (npm) : prettify-xml
 *
 *  Returns
 *      soapResponseBody 
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      CLI Action
 * 
 *  Installation
 *      Create a new "CLI action" step
 *      Name it "SOAP Request"
 *      Create parameters
    *      url (JS)
    *      soapHeaders (JS)
    *      soapenv     (JS) 
 *          soapRequest (NPM) and set its value = easy-soap-request @ latest 
 *          prettifyXml (NPM) and set its value = prettify-xml @ latest 
 *      Set the new custom action's function body to this javascript
 *      Set connection information
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */

//const soapRequest = require('easy-soap-request');
const fs = require('fs');

let timeout = 10000;
if (typeof callTimeout !== 'undefined' && callTimeout > 0)
    timeout = callTimeout;

// example data

return new Promise((resolve, reject) => {

    // usage of module
    (async () => {

        const { response } = await soapRequest({ url: url, headers: soapHeaders, xml: soapenv, timeout: timeout }); // Optional timeout parameter(milliseconds)
        const { headers, body, statusCode } = response;
        console.log("headers:    " + JSON.stringify(headers,null,2));
        console.log("statusCode: " + statusCode);

        const options = {indent: 2, newline: '\n'} // 2 spaces is default, newline defaults to require('os').EOL
        const output = prettifyXml(body, options) // options is optional

        console.log("body:       " + output);
        exportsTest.soapResponseBody = output;

        resolve();
        
    })();

});

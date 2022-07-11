/**
 *  Email Validate
 * 
 *    Process email inbox and validate/parse last message in for subject/body/links and regex to pull data
 * 
 *  Parameters
 * 
 *    expectedSubject (JS) [optional] : 
 *    expectedMessage (JS) [optional] : 
 *    emailExipirationSeconds (JS) [optional] : 
 *    emailCode (JS) [optional] : Specification on how to extract text from the email
 *         /regex/  - Return matched regex
 *         { "start" : <string>/<number> } - return text from start <string>/<number> to end of email
 *         { "end" : <string>/<number> } - return text from start of email  to end <string>/<number>
 *         { "start" : 10, "end" : <string>/<number> } - return text from charater 10 to end <string>/<number>
 *         { "start" : <string>/<number>, "end" : <string>/<number> } - return text bracketed by start <string> and end <string>/<number>
 *
 *    targetLinkText (JS) [optional] : Optionally match text in link for specifying specific links in an email
 * 	  matchType (JS) [optional] : Text match type when searching for text in links (Default: includes)
 * 
 *  Returns
 * 
 *    emailCode - OTP or other data based on emailCode
 *    emailLinks - array of links found in the email
 * 
 *  Version       Date        Author          Details
 *      2.0.1     07/11/2022  Barry Solomon   Enhanced email code parsing logic
 * 
 *  Disclaimer
 * 
 *    This Custom Email Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 * 
 *    Email validation 
 *
 **/

/* eslint-disable no-var */
/* eslint-disable no-redeclare */
/* globals messages, emailAddress, emailExipirationSeconds, expectedSubject, expectedMessage, emailCode, matchType, DOMParser, targetLinkText */

let verbose = false;

/* Check that we have emails to validate
 */
if (messages === null || messages.length === 0) {
  throw new Error("Failed to find message in inbox " + emailAddress);
}

/* Convenience functions used for matching
 */
const stringMatch = {};
stringMatch['exact'] = function (str1, str2) { return (str1 === str2); };
stringMatch['startswith'] = function (str1, str2) { return str1.startsWith(str2); };
stringMatch['endswith'] = function (str1, str2) { return str1.endsWith(str2); };
stringMatch['includes'] = function (str1, str2) { return str1.includes(str2); };
stringMatch['contains'] = function (str1, str2) { return str1.includes(str2); };

let matchtype = "includes";
if (typeof matchType !== 'undefined' && matchType !== null) {
  matchtype = matchType;
}

/* The latest message in our inbox is last in the email message list
 */
let id = messages.length - 1;

/* Print out parameters for debugging purposes
 */
console.log("emailAddress:    " + (typeof emailAddress === 'undefined') ? 'undefined' : emailAddress);
console.log("expectedSubject: " + (typeof expectedSubject === 'undefined') ? 'undefined' : expectedSubject);
console.log("expectedMessage: " + (typeof expectedMessage === 'undefined') ? 'undefined' : expectedMessage);

/* Print out the last email's information for debugging purposes
 */
console.log("Subject = " + messages[id].subject);
console.log("Message = " + messages[id].html);
console.log("Date    = " + messages[id].date);
console.log("To      = " + JSON.stringify(messages[id].to));
console.log("From    = " + JSON.stringify(messages[id].from));

/* If an email expiration date has been set
 *  then only condsider emails that arrived in last emailExipirationSeconds seconds
 */
if (typeof emailExipirationSeconds !== 'undefined' && emailExipirationSeconds > 0) {
  console.log("Validate email expiration");

  let emailDate = Date.parse(messages[id].date);
  let time_diff = (Date.now() - emailDate) / 1000;

  if (time_diff > emailExipirationSeconds) {
    console.log("EXPIRED");
    throw new Error("Emails have expired");
  }
}

/* VALIDATE SUBJECT
 */
if (typeof expectedSubject !== 'undefined' && expectedSubject !== null) {
  let emailSubject = messages[id].subject;
  if (emailSubject !== expectedSubject) {
    throw new Error("Email subject not match " + emailSubject);
  }
}

/* VALIDATE EMAIL BODY contains the expected text expectedMessage
 */

let emailText = messages[id].html.replace(/ {2}|\r\n|\n|\r/gm, "");
if (typeof expectedMessage !== 'undefined' && expectedMessage !== null) {
  if (!emailText.includes(expectedMessage)) {
    throw new Error("Email text not include expected text " + emailText);
  }
}

/* Parse a One Time Code from the email body
 */
function codeParser(sourceText, codeDef) {

  let codeRegex = (typeof (codeDef) == "string") ? codeDef : null; //"\\d+";
  let startPosition = codeDef?.start ?? 0;
  let endPosition = codeDef?.end ?? sourceText.length;

  let code = "";
  let startOffset = 0;
  let endOffset = sourceText.length;

  if (typeof codeRegex !== 'undefined' && codeRegex !== null) {

    let pattern = new RegExp(codeRegex); // / [0-9]*\./; // new RegExp(codeRegex); // 

    let matches = sourceText.match(pattern);
    if (matches !== null && matches.length > 0) {

      if (verbose)
        console.log("matches.length=" + matches.length + ", matches = " + matches);

      code = matches[matches.length - 1]; // .join();

      code = code.toString().replace(" ", "");

      if (typeof (exportsTest) !== 'undefined')
        exportsTest["emailCode"] = code;
    }

  }
  else if (typeof startPosition !== 'undefined' && startPosition !== null) {

    if (typeof startPosition !== 'undefined' && startPosition !== null) {
      if (typeof startPosition === 'string')
        startOffset = sourceText.toLowerCase().indexOf(startPosition.toLowerCase()) + startPosition.length;
      else
        startOffset = startPosition;
    }
    if (typeof endPosition !== 'undefined' && endPosition !== null) {
      if (typeof endPosition === 'string')
        endOffset = sourceText.toLowerCase().indexOf(endPosition.toLowerCase());
      else
        endOffset = endPosition;
    }

    if (verbose)
      console.log("startOffset", startOffset, "endOffset", endOffset);

    if (startOffset < 0 || startOffset >= sourceText.length)
      startOffset = 0;
    if (endOffset < 0 || endOffset >= sourceText.length)
      endOffset = sourceText.length;
    if (startOffset >= endOffset) {
      throw new Error("startOffseting position (" + startOffset + ") can not be after endOffset positon (" + endOffset + ")");
    }

    code = sourceText.substring(startOffset, endOffset).trim();

  }

  return code;

}
if (typeof emailCode !== 'undefined' && emailCode !== null) {

  let code = codeParser(emailText, emailCode);

  console.log("Onetime use code = " + code);
  if (typeof (exportsTest) !== 'undefined')
    exportsTest["emailCode"] = code;

}

/* Search for and return any links found in the email
 */
let target_link_text = null;
if (typeof target_link_text !== 'undefined' && target_link_text !== null)
  target_link_text = targetLinkText;

if (typeof (DOMParser) !== 'undefined') {

  let parser = new DOMParser();
  let doc = parser.parseFromString(messages[id].html, "text/html");
  let linksElements = Array.from(doc.querySelectorAll("a"));
  if (verbose)
    console.log("linksElements", linksElements);

  exportsTest.emailLinks = [];
  if (linksElements !== null) {
    linksElements.map(linkElement => ({ text: linkElement.innerText, link: linkElement.getAttribute("href") }));

    for (let i = 0; i < linksElements.length; i++) {
      if (target_link_text === null || stringMatch[matchtype](linksElements[i].text, target_link_text)) {
        let link = linksElements[i].getAttribute("href");
        if (verbose) {
          console.log("Found link", link);
        }
        if (typeof (exportsTest) !== 'undefined')
          exportsTest.emailLinks.push(link);
      }
    }
  }

}
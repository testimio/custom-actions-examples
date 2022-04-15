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
 *    codeRegex (JS) [optional] : Regular expression string to extract verification code or other data from email
 *    targetLinkText (JS) [optional] : Optionally match text in link for specifying specific links in an email
 * 	  matchType (JS) [optional] : Text match type when searching for text in links (Default: includes)
 * 
 *  Returns
 * 
 *    emailCode - OTP or other data based on codeRegex
 *    emailLinks - array of links found in the email
 * 
 *  Author
 * 
 *      Barry Solomon 2022, Tricentis Testim
 * 
 *  Disclaimer
 * 
 *    This Custom Email Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 * 
 *    Email validation 
 * 
 *  Installation
 * 
 *    Create a new "Email validation" step
 *    Name it "Email Validate"
 *    Create parameters
 *        expectedSubject (JS)
 *        expectedMessage (JS)  
 *        emailExipirationSeconds (JS)  
 *        codeRegex (JS)  
 *        targetLinkText (JS)  
 *        matchType (JS)  
 *    Set the new email validation step's function body to this javascript
 *    Exit the step editor
 *    Share the step if not already done so
 *    Save the test
 *    Bob's your uncle
 */

/* globals messages, emailAddress, emailExipirationSeconds, expectedSubject, expectedMessage, codeRegex, DOMParser, targetLinkText, matchType */

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

let emailText = "";

if (typeof expectedMessage !== 'undefined' && expectedMessage !== null) {
  emailText = messages[id].html.replace(/ {2}|\r\n|\n|\r/gm, "");
  if (!emailText.includes(expectedMessage)) {
    throw new Error("Email text not include expected text " + emailText);
  }
}

/* Parse a One Time Code from the email body
 */
if (typeof codeRegex !== 'undefined' && codeRegex !== null) {
  let pattern = new RegExp(codeRegex); // / [0-9]*\./; // new RegExp(codeRegex); // 
  let matches = emailText.match(pattern);
  if (matches !== null) {
    let code = matches.join();
    code = code.replace(" ", "").replace(".", "");
    console.log("Onetime use code = " + code);
    exportsTest["emailCode"] = code;
  }
}

/* Search for and return any links found in the email
 */
let target_link_text = null;
if (typeof target_link_text !== 'undefined' && target_link_text !== null)
  target_link_text = targetLinkText;

let parser = new DOMParser();
let doc = parser.parseFromString(messages[id].html, "text/html");
let linksElements = Array.from(doc.querySelectorAll("a"));
if (verbose)
  console.log("linksElements", linksElements);

exportsTest.emailLinks = [];
if (linksElements !== null) {
  linksElements.map(linkElement => ({ text: linkElement.innerText, link: linkElement.getAttribute("href") }));

  for (let i = 0; i < linksElements.length; i++) {
    if (target_link_text === null || stringMatch[matchtype](linksElements[i].text, target_link_text || stringMatch[matchtype](linksElements[i].getAttribute("href"), target_link_text))) {
      let link = linksElements[i].getAttribute("href");
      if (verbose) {
        console.log("Found link", link);
      }
      if (link !== "#")
        exportsTest.emailLinks.push(link);
    }
  }
}

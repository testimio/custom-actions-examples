/**
 *   Generate Data
 *
 *	    Generate fake data for use in tests using the nodejs library faker.js
 *
 *  Parameters
 *
 *	    dataSchema (JS) : String array of data items to generate
 *               Supported data schema types:
 *                   [
 *                       "id", "firstName","lastName","prefix","suffix", "fullName"
 *                      ,"company", "jobTitle","jobArea"
 *                      ,"email", "emailWork", "emailAddr", "emailAddress"
 *                      ,"ssn"
 *                      ,"homepage", "webPage"
 *                      ,"streetAddress","secondaryAddress","city","state","zipCode"
 *                      ,"country"
 *                      ,"phoneNumber","faxNumber","phoneWork","phoneHome","phoneMain","phoneMobile"
 *                   ]
 *
 *	    numDataSets (JS) : How many instances of fake data to generate.  If undefined then 1 set will be generated
 *
 *      dataVariableName (JS) [optional] : Name of returned data array.  Default "generatedData"
 * 
 *	    faker (NPM) : Faker NodeJS Package
 *
 *  Returns
 * 
 *      generatedData
 *      named variables with the same name as the data schema elements requested (firstName, lastName, etc)
 * 
 *   NOTES: 
 *
 *      Data generated is stored in a test level variable array named "generatedData". 
 *		
 *      The first set of generated data is stored in test level variable(s) using the name of the schema elements generated 
 *			
 *		  For example, if you request 3 ["firstName", "lastName"] sets of data, 
 *
 *		    generatedData will have 3 entries [["firstName", "lastName"], ["firstName", "lastName"], ["firstName" ,"lastName"]]
 *
 *        Two variables will be created: "firstName" and "lastName" with values that match the first set of data generated
 *				  firstName === generatedData[0].firstName 
 *			    lastName  === generatedData[0].lastName
 *
 *  Disclaimer
 *      This Custom CLI Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      CLI Action
 * 
 *  Installation
 *      Create a new "CLI Action"
 *      Name it "Generate Data"
 *      Create parameters
 *          dataSchema (JS)
 *          numDataSets (JS)
 *          faker (NPM)
 *      Optional - add optional parameters
 *          dataVariableName (JS)  
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* global faker, dataSchema, numDataSets, dataVariableName */

let generatedData = [];
let generatedDataInstance = {};

function generateDatum(value) {

  let dataType = value;
  let variableName = value;

  let datum = "";
  switch (dataType) {

    case "id":
      datum = Math.floor(Math.random() * 1000000000);;
      break;
    case "firstName":
      datum = faker.name.firstName();
      break;
    case "lastName":
      datum = faker.name.lastName();
      break;
    case "fullName":
      datum = faker.fake("{{name.suffix}} {{name.firstName}} {{name.lastName}}");
      break;

    case "jobTitle":
      datum = faker.name.jobTitle();
      break;
    case "prefix":
      datum = faker.name.prefix();
      break;
    case "suffix":
      datum = faker.name.suffix();
      break;
    case "jobArea":
      datum = faker.name.jobArea();
      break;

    case "ssn":
      datum = faker.phone.phoneNumber('###-##-####');
      break;

    case "company":
    case "companyName":
      datum = faker.company.companyName();
      break;

    case "phoneWork":
    case "phoneHome":
    case "phoneMain":
    case "phoneNumber":
    case "phoneMobile":
      datum = faker.phone.phoneNumber();
      break;

    case "email":
    case "emailWork":
    case "emailAddr":
    case "emailAddress":
      datum = faker.internet.email();
      break;
    case "homepage":
    case "webPage":
      datum = faker.internet.url();
      break;

    case "streetAddress":
      datum = faker.address.streetAddress();
      break;
    case "secondaryAddress":
      datum = faker.address.secondaryAddress();
      break;
    case "city":
      datum = faker.address.city();
      break;
    case "state":
      datum = faker.address.state();
      break;
    case "stateAbbr":
      datum = faker.address.stateAbbr();
      break;
    case "zipCode":
      datum = faker.address.zipCode();
      break;
    case "country":
      datum = faker.address.country();
      break;
  }

  generatedDataInstance[variableName] = datum;

}

if (typeof dataSchema === 'undefined' || dataSchema === null)
  throw new Error("dataSchema undefined.");

let count = 1;
if (typeof numDataSets !== 'undefined' && numDataSets > 1)
  count = numDataSets;

// Create count number of instances of faked data 
//
for (let i = 0; i < count; i++) {

  generatedDataInstance = {};

  dataSchema.forEach(generateDatum);

  generatedData.push(generatedDataInstance);

}
console.log("Generated " + generatedData.length + " instances of data for dataSchema " + JSON.stringify(dataSchema) + " into exportsTest.generatedData");

// Store all instances of faked data in a global/test variable (generatedData)
//
let faked_data_variable_name = "generatedData";
if (typeof dataVariableName !== 'undefined' && dataVariableName !== null)
  faked_data_variable_name = dataVariableName;

exportsTest[faked_data_variable_name] = generatedData;
console.log("Faked data stored in exportsTest." + faked_data_variable_name + " and variable(s) of the same name as there type in dataSchema");

// Take an index and store generatedData[0]'s values as naked top level variables
//
let naked_variable_index = 0;
function storeFirstAsGlobalNakedVariables(value) {

  let variableName = value;
  let variableValue = generatedData[naked_variable_index][variableName];

  let setString = "exportsTest." + variableName + " = '" + variableValue + "'";
  console.log("  " + setString);
  eval(setString);

}
Object.keys(generatedData[naked_variable_index]).forEach(storeFirstAsGlobalNakedVariables);

console.log("generatedData = " + JSON.stringify(generatedData));

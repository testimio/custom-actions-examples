/**
 *  Excel - Import Data
 * 
 *      Process Excel download file and save sheet data values as test data (testData)
 * 
 *  Parameters
 * 
 *      returnVariableName (JS) [Optional] : Name of return data variable.  
 *              Uses testData if not defined
 *      sheetName (JS) [Optional] : Name of worksheet to pull data from.  
 *              Uses "Sheet1" if not defined
 *      xlsx (NPM) xlsx @ latest
 * 
 *  Returns
 * 
 *      testData or returnVariableName if defined
 * 
 *  Usage
 * 
 *      Record action that triggers download of the Excel file and its associated Download Validation step
 *      Replace the recorded Validate Download step with an instance of this step from your step library
 * 
 *  Disclaimer
 * 
 *      This Custom CLI Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 * 
 *      Validate Download 
 * 
 *  Installation
 *      Create a new "Validate Download" step
 *      Name it "Excel - Import Data"
 *      Create parameters
 *          returnVariableName (JS)
 *          sheetName (JS)  
 *          xlsx (NPM) and set its value = xlsx @ latest 
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */

/* globals fileBuffer, sheetName, returnVariableName, xlsx */

console.log("Get TestData from Download (Excel File)");

const { SheetNames, Sheets } = xlsx.read(fileBuffer);
if (SheetNames.length === 0) {
  throw new Error('No sheets found.');
}
//console.log("SheetNames: ", SheetNames);

let sheet_name = "Sheet1";
if (typeof sheetName!== 'undefined' && sheetName !== null) 
   sheet_name = sheetName;

if (!SheetNames.includes(sheet_name))
   throw new Error('Sheet ' + sheet_name + ' is not found');

let TestData = xlsx.utils.make_json(Sheets[sheet_name]);  
console.log("TestData", JSON.stringify(TestData));

let return_variable_name = 'testData';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

exportsTest[return_variable_name] = TestData;

// Take an index and store generatedData[0]'s values as naked top level variables
//
let naked_variable_index = 0;
function storeFirstAsGlobalNakedVariables(value) {
  
  let variableName  = value;
  let variableValue = TestData[naked_variable_index][variableName];
   
  exportsTest[variableName] = variableValue;
  console.log("variableName = " + variableValue);

}
Object.keys(TestData[naked_variable_index]).forEach(storeFirstAsGlobalNakedVariables);


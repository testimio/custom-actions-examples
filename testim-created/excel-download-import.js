/**
 *  Excel - Import Data
 * 
 *      Process Excel download file and store as JSON
 * 
 *  Parameters
 * 
 *      returnVariableName (JS) [Optional] : Name of return data variable.  
 *              Uses testData if not defined
 *      xlsx (NPM) xlsx @ latest
 * 
 *  Returns
 *      queryResults or returnVariableName if defined
 * 
 *  Disclaimer
 *      This Custom CLI Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Validate Download 
 * 
 *  Installation
 *      Create a new "Validate Download" step
 *      Name it "Excel - Import Data"
 *      Create parameters
 *          returnVariableName (JS) 
 *          maxPages (JS) 
 *          xlsx (NPM) and set its value = xlsx @ latest 
 *      Set the new custom action's function body to this javascript
 *      Set connection information
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */

/* globals fileBuffer, returnVariableName, xlsx */

 console.log("Get TestData from Download (Excel File)");

 const { SheetNames, Sheets } = xlsx.read(fileBuffer);
 if (SheetNames.length === 0) {
   throw new Error('No sheets found.');
 }
 
 let TestData = xlsx.utils.make_json(Sheets[SheetNames[0]]);  
 console.log("TestData", JSON.stringify(TestData));
 
 let return_variable_name = 'testData';
 if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
     return_variable_name = returnVariableName;
 
 exportsTest[return_variable_name] = TestData;
 
 console.log("Initialize TestData Iterator");
 exportsTest.tdid          = -1;
 exportsTest.maxTestDataId = TestData.length;
 
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
 
 
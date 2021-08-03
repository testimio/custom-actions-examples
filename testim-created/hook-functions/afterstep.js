/**
 *  AfterStep
 * 
 *      Collect step information for AfterTest reporting
 *
 *  Parameters
 *
 *  Notes
 * 
 *      Use this with "AfterTest" hooks if you wish to include detailed step information with reported results
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "AfterStep" or base it on the target reporting system.  For example "AfterStep - Azure Devops"
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Assign this step as an "After Step" hook in the configuration
 *      Save the test
 *      Bob's your uncle
 *
 **/
 
 console.log("TEST LEVEL - AfterStep");

/* _steps will contain all step information for use in communicating results after the test is complete
 */
exportsTest._steps = [];
if (typeof _steps !== 'undefined' && _steps !== null) {
    exportsTest._steps = [..._steps];
}

// Marshal this step's data and add to the _steps array
let step = Object.assign(_stepData, _stepInternalData);
step['stepNumber'] = exportsTest._steps.length + 1;
step['endTime'] = Date.now();
exportsTest._steps.push(step);



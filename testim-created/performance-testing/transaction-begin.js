/**
 * Transaction Begin
 * 
 *      Start a transaction 
 * 
 * Parameters
 * 
 *      transactionName (JS) : Name of transaction
 * 
 *  Notes
 *      Transaction Begin/End can be added as Before/After test hooks to get timing information for every step
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Transaction Begin"
 *      Add parameters
 *          transactionName  (JS) 
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 **/

/* global transactionName, transactions */

//console.log("Begin Transaction");

// Create global transactions accumulator if necessary
//
if (typeof transactions === 'undefined' || transactions == null) {
    exportsTest.transactions = [];
}
else {
    exportsTest.transactions = transactions;
}

////
//// Note: In a BEFORE step, _stepData.name is undefined
////     Meaning we cannot set the name of the step transaction automatically
////	 so we add a placeholder "_stepData" to be replaced in the after step 
////

// If transactionName is undefined then use a generic 
//
let transaction_name;
if (typeof _stepData !== 'undefined') {
    transaction_name = "_stepData";
}
else {
    transaction_name = (typeof transactionName !== 'undefined' && transactionName != null) ? transactionName : "Transaction";
}

// Find open transaction with this name 
//
var openTransactions = [];
if (exportsTest.transactions !== null && exportsTest.transactions.length > 0) {

    openTransactions = exportsTest.transactions.filter((transaction, index) => {

        return (transaction.transactionName === transaction_name
            && transaction.status === "Open"
        );

    });

}

if (openTransactions !== null && openTransactions.length === 0) {

    // Create a new transaction object
    //
    let transaction_template = {
        transactionName: transaction_name,
        startTime: new Date(),
        endTime: null,
        duration: 0,
        status: "Open",
        type: (transaction_name == "_stepData") ? "Step" : "User",
    }

    exportsTest.transactions.push(transaction_template);

}

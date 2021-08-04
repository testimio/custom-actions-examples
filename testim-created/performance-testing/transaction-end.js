/**
 * Transaction End
 * 
 *      End a transaction 
 * 
 * Parameters
 * 
 *      transactionName  (JS) : Name of transaction
 * 
 *  Notes
 *      If transactionName is set to "OpenTransactions" then all open transactions will be ended
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Transaction End"
 *      Add parameters
 *          transactionName  (JS) 
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 **/

/* global transactionName, transactions */

//console.log("End Transaction");

/* Create global transactions accumulator if necessary
 */
exportsTest.transactions = (typeof transactions === 'undefined' || transactions == null) ? [] : transactions;

/* If transactionName is undefined then use a generic 
 */
let DEFAULT_TRANSACTION_NAME = "Transaction_" + exportsTest.transactions.length;
let transaction_name;
if (typeof _stepData !== 'undefined') {
    transaction_name = "_stepData";
}
else {
    transaction_name = (typeof transactionName !== 'undefined' && transactionName != null) ? transactionName : DEFAULT_TRANSACTION_NAME;
}

/* Close target (named) or all opened transactions
 */
if (exportsTest.transactions !== null && exportsTest.transactions.length > 0) {

    exportsTest.transactions.forEach((transaction, index) => {

        /* Mark the target transaction completed
         */
        if ((transaction.transactionName === transaction_name || transaction_name === "OpenTransactions")
            && transaction.status === "Open"
        ) {

            /* If this is an endStep hook call 
             * then NOW we can set the transaction name to the step name
             */
            if (transaction_name == "_stepData") {
                transaction.transactionName = _stepData.name;
            }

            transaction.endTime = new Date();
            transaction.status = "Complete";
            transaction.duration = (new Date(transaction.endTime.valueOf()) - new Date(transaction.startTime.valueOf())) / 1000;

        }

    });

}

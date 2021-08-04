/**
 * Transaction Summary Report
 * 
 *      Log/Report all transactions
 * 
 * Parameters
 *      showOpenTransactions  (JS) [optional] : Include open and scratch transactions created by step hooks 
 *              
 *  Notes
 *      Output to console is done using a console.table command and is best visualized in the chrome debugger
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Transaction Summary Report"
 *      Optional - add optional parameters
 *          showOpenTransactions (JS) 
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 **/

/* global showOpenTransactions, transactions, networkRequestStats */

console.log("=====================================================================");
console.log("Transaction Summary Report");
console.log("=====================================================================");

/* Filter Scratch Transactions created by step hooks 
 */
if (typeof showOpenTransactions === 'undefined' || showOpenTransactions == null || showOpenTransactions === false) {

  if (transactions !== null && transactions.length > 0) {

    transactions = transactions.filter((transaction, index) => {

      let keep = (transaction.transactionName !== "_stepData" && transaction.status !== "Open")
      if (transaction.transactionName == "_stepData"   && transaction.status == "Open")
        keep = false;
      if (transaction.transactionName == "Transaction" && transaction.status == "Open")
        keep = false;
      
      return keep;

    });

  }  
}

/* Loop all transactions and Write to Log
 */
if (transactions !== null && transactions.length > 0) {
  
  console.table( transactions);
  
  //console.log( "transactionName", "status", "duration", "startTime", "endTime"); 
  //transactions.forEach((transaction, index) => {                                                                    
  //  switch (transaction.status) {       
  //    case "Open":
  //      break;
  //    case "Complete":
  //      break;
  //  }  
  //  console.table( transaction.transactionName, transaction.status, transaction.duration, transaction.startTime, transaction.endTime);
  //});
 
  console.table( JSON.stringify(transactions));

}

/* If networkRequestStats is defined the include it
 */
if (typeof networkRequestStats !== 'undefined' && networkRequestStats !== null){
    console.log("---------------------------------------------------------------------");
    console.log("Network Performance Summary");
    console.log("---------------------------------------------------------------------");
    console.table(JSON.stringify(networkRequestStats.sort((a, b) => b.maxDuration - a.maxDuration))); 
}
console.log("");

console.log("=====================================================================");

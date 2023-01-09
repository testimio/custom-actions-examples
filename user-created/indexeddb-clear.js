/**
 *  indexedDB - Clear
 * 
 *      Clear all ObjectStores from the named indexedDB database
 * 
 *  Parameters
 * 
 *      dbName (JS) : Name of indexedDB
 *      
 *  Returns
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Notes
 * 
 *  Version       Date          Author          Details
 *      1.0.0     01/09/2023    Barry Solomon   Initial Version
 *  
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

/* Validate the target database name is defined
 */
if (typeof dbName === 'undefined' || dbName === null) {
    throw new Error("dbName is null or undefined");
}

return new Promise((resolve, reject) => {

    function clearIndexedDB(dbName) {
        
        // Open a connection to the database
        const request = window.indexedDB.open(dbName);

        // Wait for the database to open
        request.onsuccess = function () {
            const db = request.result;

            // Get a list of all object stores in the database
            const objectStoreNames = db.objectStoreNames;

            // Open a transaction to the database
            const transaction = db.transaction(objectStoreNames, 'readwrite');

            // Clear all object stores
            for (let i = 0; i < objectStoreNames.length; i++) {
                const objectStore = transaction.objectStore(objectStoreNames[i]);
                objectStore.clear();
            }

            // Wait for the transaction to complete
            transaction.oncomplete = function () {
                console.log('All object stores cleared');
                resolve();
            };
        };
    }
    
    clearIndexedDB(dbName);

})

/**
 *  MongoDB Query
 * 
 *          Execute a MongoDB query and return results
 * 
 *  Parameters - Packages and JavaScript used in this example:
 * 	    query (JS)      : '{"name":"test"}'
 *      returnVariableName (JS) [Optional] : Name of return data variable.  
 *              Uses queryResults if not defined
 * 	    collection (JS) : 'users'
 * 	    database (JS)   : 'myproject'
 * 	    connectionURL (JS) [optional] : default = "mongodb://localhost:27017/"
 *      mongodb (npm)   : mongodb@latest
 * 
 *  Returns
 *      queryResults or returnVariableName if defined
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      CLI Action
 * 
 *  Installation
 *      Create a new "CLI action" step
 *      Name it "MongoDB Query"
 *      Create parameters
 *          query (JS) 
 *          returnVariableName (JS) 
 *          collection (JS) 
 *          database (JS) 
 *          mongodb (NPM) and set its value = mongodb @ latest 
 *      Set the new custom action's function body to this javascript
 *      Set connection information
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */

const MongoClient = mongodb.MongoClient;

// Connection URL
let url = "mongodb://localhost:27017/";
if (typeof connectionURL !== 'undefined' && connectionURL != null)
    url = connectionURL;

if (typeof query === 'string')
    query = JSON.parse(query);

/* if returnVariableName is defined then use it else use 'queryResults' as the return variable
*/
var return_variable_name = (typeof returnVariableName !== 'undefined' && returnVariableName !== null) ? returnVariableName : 'queryResults';

let client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

const connect = () => {
    return new Promise((resolve, reject) => {
        client.connect(function (err) {
            if (err) {
                return reject(err);
            }
            console.log("Connected successfully to server");
            const db = client.db(database);
            resolve(db);
        });
    });
};

const findOne = (db, collection) => {
    return new Promise((resolve, reject) => {
        const coll = db.collection(collection);
        coll.findOne(query, (err, result) => {
            if (err) {
                return reject(err);
            }

            exportsTest[return_variable_name] = result;
            console.log(return_variable_name, exportsTest[return_variable_name]);

            resolve(result);
        });
    });
};

return connect()
    .then(db => findOne(db, collection, query))
    .then(result => {
        if (!result) {
            return Promise.reject(new Error("Failed to find object"));
        }
    })
    .finally(() => client.close());

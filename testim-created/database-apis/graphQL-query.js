/**
 *  graphQL Query
 * 
 *      Execute a graphQL Query and return results
 * 
 *  Parameters - Packages and JavaScript used in this example:
 * 
 *      url (JS) : url of graphQL endpoint (usually ends in '/graphql')
 *
 *      graphQLquery (JS)
 *          'query { <query query> }'
 *          'mutation { <mutuation query> } '
 *
 *      fetch (NPM) = isomorphic-fetch@latest
 * 
 *  Returns
 * 
 *      graphQLResponse
 * 
 *  Notes
 * 
 *      Interesting sites for graphQL
 *          https://api.spacex.land/graphql/
 *          https://moonhighway.com/public-graphql-apis
 *
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      CLI Action
 * 
 *  Installation
 *      Create a new "CLI action" step
 *      Name it "graphQL Query"
 *      Create parameters
 *          url (JS) 
 *          graphQLquery (JS) 
 *          fetch (NPM) and set its value = isomorphic-fetch @ latest 
 *      Set the new custom action's function body to this javascript
 *      Set connection information
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */

/* Validate a graphQL query has been defined
 */
if (typeof graphQLquery === 'undefined' || graphQLquery === null) {
    throw new Error("graphQLquery is undefined.  Please set the graphQLquery parameter to a valid graphQLquery and try again.")
}
let graphql_query = graphQLquery;

return new Promise((resolve, reject) => {

    console.log("Execute graphQLquery:", graphql_query);

    fetch(url, {

        method: 'POST',
        credentials: 'same-origin',
        headers: {
            "Accept": 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                query: graphql_query
            }
        ),
    })
        .then(res => res.json())
        .then(res => {

            exportsTest.graphQLResponse = res;
            console.log("graphQLResponse:", JSON.stringify(exportsTest.graphQLResponse));

            resolve();

        })
        .catch(error => { console.log(error.message); reject(); });

});


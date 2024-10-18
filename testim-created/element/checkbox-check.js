/**
 *  Checkbox - Check/Uncheck
 * 
 *     Check/Uncheck/Toggle a checkbox.  Supports custom checkbox controls and states (some assembly required)
 * 
 *  Parameters: 
 *
 *     element  : Target element
 *
 *     checkState [optional] : Only check item(s) if not checked/checked		
 *		    Examples: 	true    - Check
 *            			false   - Uncheck
 *                      <unset> - Toggle
 *                      <user-defined> - allows for option state interrogation            		
 *                    		"className === 'checked'"
 *		    		 		"querySelector(\"input[type='checkbox']\").checked === true"
 *                          'classList.contains("x-menu-item-checked")'
 *
 *  Version       Date          Author          Details
 *      2.1.0     10/18/2024    Barry Solomon   Updated click logic
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 **/

/* eslint-disable no-var */
/* eslint-disable camelcase */
/* globals element, checkState, customListSelectors */

if (typeof element === 'undefined' || element === null) {
    throw new Error("Target element is undefined.  Please set element parameter and try again");
}

/*** CHECKBOX FUNCTIONS v2.1.0 ***/
var D=v;function v(R,p){var g=I();return v=function(m,f){m=m-0x197;var P=g[m];return P;},v(R,p);}function I(){var F=['getElementsByTagName','565836EQbplc','2px\x20solid\x20green','toLowerCase','is_checked_logic','input','keypress','log','querySelectorAll','custom_checkbox_selector','checked\x20===\x20true','135cWcgRf','div','dispatchEvent','simulated','keydown','36806110RdPLSL','forEach','includes','keyup','1170408rKTmbH','error','click','undefined','div[role=\x22checkbox\x22]','querySelector','input[type=\x22checkbox\x22]','style','5026161dpJqxY','764914AETpCw','parentNode','string','No\x20valid\x20target\x20element\x20found','checkbox','1169632UDVdQa','role','27TTEuxV','Target\x20element\x20is\x20undefined\x20or\x20null','47988NoNXPG','20mWekHL','checked\x20===\x20false','mouseup','New\x20element\x20detected:','then','border','tagName'];I=function(){return F;};return I();}(function(R,p){var Y=v,g=R();while(!![]){try{var m=-parseInt(Y(0x1ae))/0x1+parseInt(Y(0x1b7))/0x2*(-parseInt(Y(0x19c))/0x3)+parseInt(Y(0x1a5))/0x4+-parseInt(Y(0x1b8))/0x5*(parseInt(Y(0x1c0))/0x6)+-parseInt(Y(0x1ad))/0x7+-parseInt(Y(0x1b3))/0x8*(parseInt(Y(0x1b5))/0x9)+parseInt(Y(0x1a1))/0xa;if(m===p)break;else g['push'](g['shift']());}catch(f){g['push'](g['shift']());}}}(I,0x91316));var is_checked=![],clickEventMethod='dispatchEvent',click_to_open=![],popup_timeout=0x3e8,checkbox=null;let highlight_elements=!![],highlight_checkbox=!![],custom_checkbox_selector=null,is_checked_logic;if(typeof checkState!==D(0x1a8)){if(checkState==!![])is_checked_logic=D(0x19b);else{if(checkState==![])is_checked_logic=D(0x1b9);else{if(checkState!==null)is_checked_logic=checkState;}}console['log'](D(0x1c3),is_checked_logic);}let custom_checkbox_selectors=[{'custom_checkbox_selector':{'tagName':'input','attributeName':'type','attributeValue':D(0x1b2),'querySelector':D(0x1ab)}},{'custom_checkbox_selector':{'tagName':D(0x19d),'attributeName':D(0x1b4),'attributeValue':D(0x1b2),'querySelector':D(0x1a9)}}];function checkboxFind(R){var x=D;let p=R,g=p[x(0x1be)][x(0x1c2)](),m=[x(0x1c4),'custom'];if(!m[x(0x1a3)](g)){p=R[x(0x1bf)](x(0x1c4))[0x0];if(typeof p==='undefined'||p===null)custom_checkbox_selectors[x(0x1a2)](f=>{var b=x;if(typeof p===b(0x1a8)||p===null){p=R[b(0x199)](f[b(0x19a)]?.['querySelector'])[0x0];if(p===undefined||p===null)p=R[b(0x1af)][b(0x199)](f[b(0x19a)]?.[b(0x1aa)])[0x0];typeof p!==b(0x1a8)&&p!==null&&(g='custom',custom_checkbox_selector=f[b(0x19a)],console[b(0x198)]('custom_checkbox_selector',custom_checkbox_selector));}});else g=typeof p==x(0x1a8)||p==null?'':p[x(0x1be)][x(0x1c2)]();}if(highlight_elements&&highlight_checkbox&&p!==null)p[x(0x1ac)][x(0x1bd)]=x(0x1c1);return{'checkbox':p,'tagname':g};}function checkItem(R,p){var W=D;typeof p!==W(0x1a8)&&(is_checked=eval('('+'checkbox.'+p+')'),console[W(0x198)]('is_checked',is_checked));if(!is_checked)try{return executeActionWithXPath({'eventMethod':clickEventMethod,'clickMethod':W(0x1a7),'targetSelector':R,'targetElementXPath':null,'observerTarget':null,'timeoutDuration':0x64,'useTimeout':!![]})[W(0x1bc)](g=>{var Z=W;console[Z(0x198)](Z(0x1bb),g);});}catch(g){try{R['firstChild']['click']();}catch(m){R[W(0x1a7)]();}}return!![];}function handleEvent(R){var h=D;if(!R)throw new Error(h(0x1b6));try{var p=new Event('hover',{'bubbles':!![],'composed':!![]});p[h(0x19f)]=!![],R[h(0x19e)](p);var g=new KeyboardEvent(h(0x1a0),{'key':'\x20','code':'Space','keyCode':0x20,'charCode':0x20,'bubbles':!![],'composed':!![]});R[h(0x19e)](g);var m=new KeyboardEvent(h(0x197),{'key':'\x20','code':'Space','keyCode':0x20,'charCode':0x20,'bubbles':!![],'composed':!![]});R[h(0x19e)](m);var f=new KeyboardEvent(h(0x1a4),{'key':'\x20','code':'Space','keyCode':0x20,'charCode':0x20,'bubbles':!![],'composed':!![]});R[h(0x19e)](f);var P=new Event(h(0x1a7),{'bubbles':!![],'composed':!![]});P['simulated']=!![],R[h(0x19e)](P);var M=new Event('change',{'bubbles':!![],'composed':!![]});M[h(0x19f)]=!![],R[h(0x19e)](M);}catch(X){console[h(0x1a6)](X);throw X;}}function executeActionWithXPath({eventMethod:eventMethod='dispatchEvent',targetSelector:R,targetElementXPath:targetElementXPath=null,timeoutDuration:timeoutDuration=0x7d0,useTimeout:useTimeout=!![]}){return new Promise((p,g)=>{var d=v;function m(P){var r=v;try{const M=['mouseover','mousedown',r(0x1ba),r(0x1a7)];M[r(0x1a2)](X=>{var q=r;const N=new MouseEvent(X,{'bubbles':!![],'composed':!![],'cancelable':!![],'view':window});P[q(0x19e)](N);});}catch(X){g(X);}}let f=typeof R===d(0x1b0)?document[d(0x1aa)](R):R;if(f&&targetElementXPath)try{const P=document['evaluate'](targetElementXPath,f,null,XPathResult['FIRST_ORDERED_NODE_TYPE'],null)['singleNodeValue'];P&&(f=P);}catch(M){console[d(0x1a6)]('Failed\x20to\x20evaluate\x20XPath:',M);}if(!f){g(new Error(d(0x1b1)));return;}m(f),useTimeout?setTimeout(()=>{p(f);},timeoutDuration):p(f);});}

if (typeof customListSelectors === 'object')
    custom_checkbox_selectors.push(...customListSelectors);

/* Checkstate is either true or false or a custom string that will be evaluated for the checkbox state
 */
if (typeof checkState === 'string'){
    is_checked_logic = checkState;
    console.log("is_checked_logic", is_checked_logic);
}

if (highlight_elements && element !== null)
    element.style.border = "2px solid blue";

return new Promise((resolve, reject) => {

    if (click_to_open === true) {
        return executeActionWithXPath({
            clickMethod: clickEventMethod, // Configurable click method
            targetSelector: element, // Configurable target element
            targetElementXPath: null, // XPath to the child checkbox within the item
            observerTarget: document.body, // Observe the whole document for new elements
            timeoutDuration: popup_timeout, // Configurable timeout duration
            useTimeout: true // Conditionally use timeout if event method is invoked
        })
            .then(result => {
                foundElement = checkbox ?? result;
                console.log('New element detected:', foundElement);
                resolve(foundElement);  // Pass the found element to the next .then()
            })
    }
    else {
        resolve(element);
    }

})
    .then(foundElement => {

        /* If user pointed at a list item or for the target element then be nice
        *	try to find the parent element <select> or <ul>
        */
        let results = checkboxFind(foundElement);
        let tagname = results?.tagname.toLowerCase();
        checkbox = results?.checkbox;
    
        if (checkbox === undefined || checkbox === null) {
            throw new Error("Select Option(s) ==> Target element must be a input or custom. Not: ", tagname);
        }

        let select_tags = ["input", "custom"];
        if (!select_tags.includes(tagname)) {
            throw new Error("Select Option(s) ==> Target element must be a input or custom. Not: ", tagname);
        }

        return (checkbox);
    
    })
    .then((checkbox) => {

        return checkItem(checkbox, is_checked_logic);

    })
    .catch(error => {
        console.error('Error:', error);
    });

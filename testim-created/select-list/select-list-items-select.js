/**
 *  Select List - Items Select
 *. 
 *      Select an item or multiple items from a listbox, dropdown, multi-select or table.  Optionally can support check list items
 * 
 *  Parameters: 
 * 
 *      element  : Target element (or parent/child of) a <select>, <ol>, <ul>
 * 
 *      itemId   : String and/or Integer index (0-based) of target <option>, <li>, <tr>, <td> or any child of the aforementioned
 *    			  Can be an array for selecting multiple items ["Item 1", "Item 2", 3, 4, 5, 'Random']
 * 
 *      checkState [optional] : Only select item(s) if not checked/selected		
 *		    Examples: 	true    - Check
 *            			false   - Uncheck
 *                      <unset> - Toggle
 *                      <user-defined> - allows for option state interrogation            		
 *                    		"className === 'selected'"
 *		    		 		"querySelector(\"input[type='checkbox']\").checked"
 * 
 *      clickToOpen (JS) [optional] : If select is triggered by an action then element is the trigger. Default (true)
 *
 *      matchType [optional] : Text match type when searching for text in lists/selects
 *		    Examples: exact, startswith, endswith, includes (default)
 *
 *      highlightElements (JS) [optional] : Highlight Target Grid, Header, RowGroup, Cells for posterity (and debugging)
 *
 *  Returns
 *      selectedIndex
 *      selectedText
 *      selectedValue
 *
 *  Version       Date          Author            Details
 *      3.1.1     10/01/2024    Barry Solomon     Major update to find and select logic.  Support for popup lists
 *      3.1.2     10/03/2024    Barry Solomon     Minor cleanup, set default click to open true
 *
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 *
 *  Base Step
 *      Custom Action
 * 
**/

var verbose = false;

/*** START COMMON LIST FUNCTIONALITY ***/

/* User setable parameters (do not change without understanding what these are for) 
 */
var return_variable_name = undefined;
var return_type = 'STRING';
var result_filter = "All";
var result_regex = null;
var target_state = undefined;
var popup_timeout = 2000;

var click_to_open = true;
if (typeof clickToOpen !== 'undefined' && clickToOpen !== null)
    click_to_open = clickToOpen;

var match_type = 'exact';
if (typeof matchType !== 'undefined' && matchType !== null)
    match_type = matchType;

var DEFAULT_RETURN_VARIABLE_NAME = 'actualItems';

var results = null;
var select_list_tagname = null;
var select_list = null;
var select_list_opener = null;
var select_listitem_groupbox = null;
var selected_item_indexes = [];
var unselected_item_indexes = null;


/*** LIST FUNCTIONS v3.1.1 ***/
const U=j;(function(L,O){const q=j,l=L();while(!![]){try{const y=-parseInt(q(0x185))/0x1+parseInt(q(0x134))/0x2*(parseInt(q(0x186))/0x3)+-parseInt(q(0x157))/0x4*(parseInt(q(0x118))/0x5)+-parseInt(q(0xfd))/0x6*(-parseInt(q(0x139))/0x7)+-parseInt(q(0x11b))/0x8+parseInt(q(0x17d))/0x9*(parseInt(q(0x15f))/0xa)+parseInt(q(0x17a))/0xb*(parseInt(q(0x152))/0xc);if(y===O)break;else l['push'](l['shift']());}catch(s){l['push'](l['shift']());}}}(h,0x4b5f9));var clickEventMethod=U(0xde),popupTimeout=0x7d0,selectItemTimeout=0x7d0,highlight_elements=![],highlight_select_item=![],highlight_groupbox=![],highlight_selectlist=![],highlight_selectlist_opener=![],LIST_HIGHLIGHT_BORDER=U(0x163),LIST_OPENER_HIGHLIGHT_BORDER=U(0x12b),LIST_GROUPBOX_HIGHLIGHT_BORDER=U(0x163),LIST_ITEM_SELECTED_HIGHLIGHT_BORDER=U(0x165),current_list_selector=null,current_list_opener_selector=null,current_listitem_groupbox_selector=null,current_listitem_selector=null;const valid_container_tags=[U(0xea),'ol','ul','table',U(0x16f)],valid_item_tags=[U(0x107),'li'];var custom_list_selectors=[{'name':U(0xf2),'custom_list_selector':{'tagName':'select','querySelector':U(0xea)},'custom_listitem_selector':{'tagName':'option','querySelector':'option'}},{'name':U(0x145),'custom_list_selector':{'tagName':'ul','querySelector':'ul'},'custom_listitem_selector':{'tagName':'li','querySelector':'li'}},{'name':'orderedList','custom_list_selector':{'tagName':'ol','querySelector':'ol'},'custom_listitem_selector':{'tagName':'li','querySelector':'li'}},{'name':U(0x132),'custom_list_selector':{'tagName':U(0xf1),'attributeName':U(0x14c),'attributeValue':U(0x193),'querySelector':U(0x18d)},'custom_listitem_selector':{'tagName':U(0x102),'querySelector':U(0x127)}},{'name':U(0x182),'custom_list_selector':{'tagName':U(0x11f),'attributeName':U(0x14c),'attributeValue':U(0xe5),'querySelector':U(0x155)},'custom_listitem_selector':{'tagName':'a','querySelector':'a'}},{'name':U(0xe4),'custom_list_selector':{'tagName':U(0xe0),'attributeName':'role','attributeValue':'combobox','querySelector':U(0x160)},'custom_listitem_groupbox_selector':{'display':U(0x14f),'parentElement':document,'selectListLinkAttribute':U(0x12f),'tagName':'ul','querySelector':U(0x189)},'custom_listitem_selector':{'tagName':'li','querySelector':'li'}},{'name':U(0x136),'custom_list_selector':{'tagName':U(0x11f),'attributeName':U(0x10e),'attributeValue':U(0xda),'querySelector':U(0x117)},'custom_listitem_selector':{'tagName':U(0x11f),'attributeName':U(0x10e),'attributeValue':'listitem','querySelector':U(0xe9)}},{'name':U(0xf0),'custom_list_selector':{'tagName':U(0x11f),'attributeName':'role','attributeValue':U(0x18c),'querySelector':'div[role=\x22listbox\x22]'},'custom_listitem_selector':{'tagName':'div','attributeName':U(0x10e),'attributeValue':U(0x107),'querySelector':U(0x147)}},{'name':U(0x125),'custom_list_selector':{'tagName':U(0x11f),'attributeName':U(0x14c),'attributeValue':U(0x128),'querySelector':U(0x10d)},'custom_listitem_selector':{'tagName':'a','attributeName':U(0x14c),'attributeValue':U(0x18b),'querySelector':U(0x141)}},{'name':U(0xef),'custom_list_selector':{'tagName':'div','attributeName':'data-react-toolbox','attributeValue':U(0x18a),'querySelector':U(0x17c),'openerSelector':U(0xdd)},'custom_listitem_groupbox_selector':{'tagName':'ul','querySelector':'ul','display':U(0x14f)},'custom_listitem_selector':{'tagName':'li','querySelector':'li'}},{'name':'menuListItem','custom_list_selector':{'tagName':'div','attributeName':U(0x10e),'attributeValue':U(0xdc),'querySelector':U(0x146)},'custom_listitem_selector':{'tagName':'li','querySelector':'li'}}];function elementMatchesCustomSelector(L,O){const A=U;if(L[A(0x16a)][A(0x133)]()===O[A(0x16a)][A(0x133)]()){if(O[A(0x122)]&&O[A(0xfa)])return L[A(0x14a)](O[A(0x122)])===O[A(0xfa)];return!![];}return![];}function selectListFind(L,O=custom_list_selectors){const r=U;let l=L,y=l['tagName'][r(0x133)](),s=[];[r(0xea),'ul','ol'][r(0x108)](y)&&O[r(0x154)](S=>{const I=r;elementMatchesCustomSelector(l,S['custom_list_selector'])&&(y=l['tagName'][I(0x133)](),S[I(0x11c)]=l,s['push'](S));});!valid_container_tags[r(0x108)](y)&&(l=L[r(0xdb)](r(0xea))[0x0]||L[r(0xdb)]('ul')[0x0]||L[r(0xdb)]('ol')[0x0],l?O[r(0x154)](S=>{const k=r;elementMatchesCustomSelector(l,S[k(0x16b)])&&(y=l[k(0x16a)][k(0x133)](),S['select_list_instance']=l,s[k(0x176)](S));}):O[r(0x154)](S=>{const t=r;elementMatchesCustomSelector(L,S[t(0x16b)])&&(S['select_list_instance']=l,s[t(0x176)](S));}),!l&&O['forEach'](S=>{const F=r;!l&&(l=L[F(0x14b)](S[F(0x16b)][F(0x14b)]),!l&&(l=L['parentNode']['querySelector'](S[F(0x16b)][F(0x14b)])),l&&(S[F(0x11c)]=l,s[F(0x176)](S)));}));if(!valid_container_tags[r(0x108)](y)){l=L;while(!valid_container_tags[r(0x108)](y)&&l){l=l['parentNode'],y=(l?.[r(0x16a)]||'')['toLowerCase'](),O[r(0x154)](S=>{const W=r;y===S[W(0x16b)]?.['tagName']&&(S[W(0x16b)][W(0x122)]&&S[W(0x16b)][W(0xfa)]?l[W(0x14a)](S['custom_list_selector']['attributeName'])===S[W(0x16b)][W(0xfa)]&&(S[W(0x11c)]=l,s[W(0x176)](S)):(S[W(0x11c)]=l,s[W(0x176)](S)));});}}let T=selectBestMatch(s,L);if(T){current_list=T['select_list_instance'],current_match=T,current_listitem_selector=T[r(0x10c)],current_listitem_groupbox_selector=T[r(0x168)];switch(T[r(0x15b)]){case r(0xf2):y='select';break;case r(0x145):y='ul';break;case'orderedList':y='ol';break;default:y=r(0x16f);break;}return{'best_match':T,'select_list':current_list,'select_list_opener':current_list_selector?.[r(0x192)]?l[r(0x14b)](current_list_selector['openerSelector']):l,'select_listitem_groupbox':current_listitem_groupbox_selector?l['querySelector'](current_listitem_groupbox_selector['querySelector']):null,'select_list_tagname':y};}else return console[r(0x15d)](r(0xf3)),null;}function findBestSelectList(L){return selectListFind(L);}function isElementMatching(L,O){const u=U;if(!L||!O)return![];let l=!![];O[u(0x16b)]?.['tagName']&&(l=l&&L[u(0x16a)]['toLowerCase']()===O[u(0x16b)][u(0x16a)]['toLowerCase']());if(O[u(0x16b)]?.[u(0x14b)]){const y=L[u(0x142)](O[u(0x16b)][u(0x14b)]);l=l&&y;}O[u(0x16b)]?.['attributes']&&Object['keys'](O[u(0x16b)]['attributes'])[u(0x154)](s=>{const b=u,T=O[b(0x16b)]['attributes'][s],S=L[b(0x14a)](s);T!==S&&(l=![]);});if(O[u(0x16b)]?.['role']){const s=L[u(0x14a)](u(0x10e));l=l&&s===O['custom_list_selector'][u(0x10e)];}if(O[u(0x10c)]?.[u(0x14b)]){const T=L[u(0x120)](O['custom_listitem_selector'][u(0x14b)]);T['length']===0x0&&(l=![]);}return l;}function selectBestMatch(L){const n=U;if(L[n(0x105)]===0x0)return null;let O=null,l=0x0;return L[n(0x154)](y=>{const c=n;let s=0x0;const T=isElementMatching(y?.['select_list_instance'],y);if(T&&y['custom_list_selector'])s++;if(T&&y[c(0x10c)])s++;if(T&&y['custom_listitem_groupbox_selector'])s++;if(T&&y[c(0x10c)]?.[c(0x14b)]){const S=y?.[c(0x11c)][c(0x120)](y[c(0x10c)]['querySelector']);S[c(0x105)]>0x0&&(s+=S[c(0x105)]);}s>l&&(l=s,O=y);}),O;}function selectListItemsGet(L,O){const f=U;let l=L[f(0xf6)],y=[],s=[];switch(L[f(0x115)]){case f(0xea):s=l[f(0x166)];break;case'ul':case'ol':s=l[f(0xdb)]('li');break;case'custom':s=l[f(0x120)](current_listitem_selector?.[f(0x14b)]);break;}console['log']('items.length',s[f(0x105)]);let T=null;for(let S=0x0;S<s[f(0x105)];S++){switch(select_list_tagname){case'select':switch(O){case f(0x181):T={'index':S,'text':s[S][f(0xe1)],'value':s[S][f(0x194)]};break;case f(0x13b):T=s[S]['value'];break;case f(0x13e):case'STRING':T=s[S][f(0xe1)];break;default:T={'index':S,'text':s[S][f(0xe1)]},T[O]=s[S][f(0x12d)][O][f(0x194)];break;}break;case'ul':case'ol':switch(O){case f(0x181):T={'index':S,'text':s[S][f(0x170)]};break;case'VALUE':T=s[S][f(0x194)];break;case'TEXT':case f(0x144):T=s[S][f(0x170)];break;default:T={'index':S,'text':s[S][f(0x170)]},T[O]=s[S][f(0x12d)][O][f(0x194)];break;}break;case'custom':switch(O){case f(0x181):T={'index':S,'innerHTML':s[S]['innerHTML']};break;case'VALUE':T=s[S][f(0x194)];break;case f(0x13e):case'STRING':T=s[S][f(0x170)];break;default:T={'index':S,'text':s[S][f(0x170)]},T[O]=s[S]['attributes'][O][f(0x194)];break;}break;}if(T!==null)y['push'](T);}return y;}function selectItem(L,O,l,y){const v=U;let s=-0x1,T=[];switch(l){case'ol':case'ul':T=L['getElementsByTagName']('li');break;case v(0x16f):T=L['querySelectorAll'](current_listitem_selector?.[v(0x14b)]);break;case'select':default:T=L[v(0x166)];break;}switch(typeof O){case v(0x171):s=O;if(s>=T[v(0x105)])s=T[v(0x105)];if(T['length']<=0x0)return![];break;case'string':default:if(O[v(0x133)]()==v(0x14e)){s=Math['floor'](Math[v(0x14e)]()*T[v(0x105)]);break;}for(let S=0x0;S<T['length'];S++){switch(l){case v(0xea):(stringMatch[y](L['options'][S][v(0xe1)][v(0x133)](),O[v(0x133)]())||L[v(0x166)][S][v(0x194)]['toLowerCase']()===O['toLowerCase']())&&(s=S);break;case'ol':case'ul':default:stringMatch[y](T[S]['textContent']['toLowerCase'](),O[v(0x133)]())&&(s=S);break;}if(s>=0x0)break;}break;}if(s>=0x0){let X=![],H;switch(l){case'select':if(highlight_elements&&highlight_select_item&&L[v(0x166)][s]!==null)L[v(0x166)][s][v(0x112)]['border']=LIST_ITEM_SELECTED_HIGHLIGHT_BORDER;typeof checkState!==v(0x126)&&checkState!=null?(H=checkState,console['log']('is_selected',X)):H=!L[v(0x166)][s][v(0xfe)];try{L['options'][s]['selected']!=H&&(L[v(0x166)][s][v(0xfe)]=H,L[v(0x166)][s][v(0x15c)]());}catch(G){L[v(0x166)][s][v(0xfe)]=H;}L[v(0x180)](new Event('change'));return!![];case'ol':case'ul':default:if(highlight_elements&&highlight_select_item&&T[s]!==null)T[s][v(0x112)][v(0x10a)]=LIST_ITEM_SELECTED_HIGHLIGHT_BORDER;typeof target_state!==v(0x126)&&(X=eval('('+v(0x12c)+target_state+')'),console[v(0x10f)]('is_selected',X));if(!X)try{T[s][v(0x130)][v(0x15c)]();}catch(p){try{T[s][v(0x162)][v(0x15c)]();}catch(B){T[s][v(0x15c)]();}}return!![];}}return![];}function contains(L,O){const C=U;let l=document[C(0x120)](L);return Array[C(0x167)]['filter'][C(0x103)](l,function(y){const N=C;return RegExp(O)['test'](y[N(0x170)]);});}function j(L,O){const l=h();return j=function(y,s){y=y-0xda;let T=l[y];return T;},j(L,O);}function selectListItemsGet(L,O){const D=U;let l=[],y=null;switch(select_list_tagname){case D(0xea):y=L[D(0x166)];break;case'ul':case'ol':y=L[D(0xdb)]('li');break;case D(0x16f):y=L['querySelectorAll'](current_listitem_selector?.['querySelector']);break;}console[D(0x10f)](D(0x148),y[D(0x105)]);let s=null;for(let T=0x0;T<y[D(0x105)];T++){switch(select_list_tagname){case D(0xea):switch(O){case D(0x181):s={'index':T,'text':y[T][D(0xe1)],'value':y[T][D(0x194)]};break;case D(0x13b):s=y[T][D(0x194)];break;case D(0x13e):case D(0x144):s=y[T]['text'];break;default:s={'index':T,'text':y[T][D(0xe1)]},s[O]=y[T]['attributes'][O][D(0x194)];break;}break;case'ul':case'ol':switch(O){case D(0x181):s={'index':T,'text':y[T][D(0x170)]};break;case D(0x13b):s=y[T][D(0x194)];break;case'TEXT':case D(0x144):s=y[T][D(0x170)];break;default:s={'index':T,'text':y[T][D(0x170)]},s[O]=y[T][D(0x12d)][O][D(0x194)];break;}break;case D(0x16f):switch(O){case D(0x181):s={'index':T,'innerHTML':y[T]['innerHTML']};break;case D(0x13b):s=y[T][D(0x194)];break;case D(0x13e):case'STRING':s=y[T][D(0x170)];break;default:s={'index':T,'text':y[T][D(0x170)]},s[O]=y[T][D(0x12d)][O]['value'];break;}break;}if(s!==null)l['push'](s);}return l;}function selectListItemsFilter(L){const V=U;let O=null;switch(result_filter){case'first':O=L[0x0];break;case V(0x173):O=L[L[V(0x105)]-0x1];break;default:if(isNaN(result_filter))O=L;else O=result_filter<0x0?L[V(0x13d)](result_filter):L[V(0x13d)](0x0,result_filter);break;}return typeof result_regex!==V(0x126)&&result_regex!==null&&[V(0x13e),V(0x144)][V(0x108)](return_type)&&(result_regex=resultRegex,O[V(0x154)]((l,y)=>{const P=V;let s=new RegExp(result_regex),T=l[P(0xee)](s);T!==null&&(O[y]=T[0x0]);})),O;}function validateSelectOptionOrder(L,O){const J=U;if(typeof L===J(0x126)||L===null||L[J(0x105)]===0x0)throw new Error(J(0x149));let l=[];for(let s=0x0;s<L[J(0x105)];s++){l[J(0x176)](L[s]);}let y=[...l];if(O==='DESCENDING')y[J(0x119)]()[J(0xeb)]();else y['sort']();console[J(0x10f)]('Expected\x20Item\x20Order:\x20'+JSON[J(0xf8)](y)),console[J(0x10f)](J(0xe3)+JSON[J(0xf8)](l));if(y[J(0x13c)](function(T,S){return T===l[S];})===![])throw new Error(J(0x188)+O+'\x20Actual\x20Order:\x20'+JSON[J(0xf8)](l,null,0x2)+J(0x101)+JSON['stringify'](y,null,0x2));}function validateItems(L,O,l){const Z=U;let y=!![],s,T,S=[];for(let X=0x0;X<O['length'];X++){s=O[X];let H=Object['keys'](s)['includes']('index')?s[Z(0x11d)]:X;T=L?.[Z(0x105)]>=L&&L[H]!==null?L[H]:undefined;if(typeof s===Z(0x151)){y=![],L[Z(0x154)](G=>{if(stringMatch[l](G,s)){if(!y)y=!![];}});if(!y)S[Z(0x176)]({'Expected':s,'MatchType':l});}}if(S?.['length']>0x0){verbose&&(console[Z(0x10f)](Z(0x111),JSON[Z(0xf8)](O)),console[Z(0x10f)](Z(0x10b),JSON[Z(0xf8)](T)));console['log'](Z(0x121),JSON['stringify'](S,null,0x2));throw new Error('SelectList\x20Items\x20Validate\x20-\x20Not\x20Found:\x0a'+JSON[Z(0xf8)](S,null,0x2));}return y;}function getSelectedOptions(L){const Y=U;var O=[],l=[],y=[];switch(element_type){case Y(0xea):default:for(var s=0x0,T=L[Y(0x166)][Y(0x105)];s<T;s++){let S=L[Y(0x166)][s];O[Y(0x176)]({'text':S[Y(0xe1)],'value':S[Y(0x194)],'index':s}),S[Y(0xfe)]&&(l[Y(0x176)]({'text':S[Y(0xe1)],'value':S[Y(0x194)],'index':s}),expected_values?.[Y(0x105)]>0x0&&expected_values[Y(0x179)](X=>{const x=Y;return stringMatch[match_type](S?.[x(0xe1)],X?.[x(0xe1)])||stringMatch[match_type](S?.[x(0x194)],X?.[x(0x194)]);})&&y[Y(0x176)]({'text':S[Y(0xe1)],'value':S['value'],'index':s}));}break;}return{'options':O,'selected_options':l,'selected_options_matched':y};}function findFirstClickableChild(L){const m=U,O=['a'],l=L['querySelectorAll'](O[m(0x138)](',\x20'));return l[0x0]||null;}function selectItem(L,O,l,y){const g=U;let s=-0x1,T=[];switch(l){case'ol':case'ul':T=L[g(0x120)](g(0x17f));if(typeof O===g(0x151)&&O['toLowerCase']()==='random'){let S=[...L[g(0x120)](g(0x17f))];T=S[g(0x13a)](X=>{const d=g;try{let H=X[d(0x14a)](d(0x16d)),G=X[d(0x14b)](d(0x143))['innerText'][d(0xe8)]();return!(H?.[d(0x108)](d(0x113))||G?.[d(0x108)](d(0x100)));}catch(p){return![];}});}break;case g(0x16f):T=L[g(0x120)](current_listitem_selector?.[g(0x14b)]);break;case g(0xea):default:T=L[g(0x166)];break;}switch(typeof O){case g(0x171):s=O;if(s>=T['length'])s=T['length'];if(T[g(0x105)]<=0x0)return![];break;case g(0x151):default:if(O['toLowerCase']()==g(0x14e)){unselected_item_indexes===null&&T[g(0x105)]>0x0&&(unselected_item_indexes=[],T[g(0x154)]((X,H)=>{const e=g;unselected_item_indexes[e(0x176)](H);}));s=unselected_item_indexes[Math[g(0x158)](Math['random']()*unselected_item_indexes[g(0x105)])],selected_item_indexes[g(0x176)](s);break;}for(let X=0x0;X<T[g(0x105)];X++){switch(l){case g(0xea):(stringMatch[y](L[g(0x166)][X][g(0xe1)][g(0x133)](),O[g(0x133)]())||L['options'][X][g(0x194)][g(0x133)]()===O['toLowerCase']())&&(s=X);break;case'ol':case'ul':default:stringMatch[y](T[X]['textContent'][g(0x133)](),O[g(0x133)]())&&(s=X);break;}if(s>=0x0)break;}break;}if(s>=0x0){selected_item_indexes[g(0x176)](s);if(unselected_item_indexes!==null)unselected_item_indexes[g(0x175)](s,0x1);let H=![],G;switch(l){case g(0xea):if(highlight_elements&&highlight_select_item&&L[g(0x166)][s]!==null)L[g(0x166)][s]['style'][g(0x10a)]=LIST_ITEM_SELECTED_HIGHLIGHT_BORDER;typeof checkState!=='undefined'&&checkState!=null?(G=checkState,console[g(0x10f)]('is_selected',H)):G=!L[g(0x166)][s]['selected'];try{L[g(0x166)][s][g(0xfe)]!=G&&(L[g(0x166)][s][g(0xfe)]=G,L['options'][s]['click']());}catch(p){L[g(0x166)][s]['selected']=G;}L[g(0x180)](new Event('change'));return!![];case'ol':case'ul':default:if(highlight_elements&&highlight_select_item&&T[s]!==null)T[s]['style'][g(0x10a)]=LIST_ITEM_SELECTED_HIGHLIGHT_BORDER;typeof target_state!==g(0x126)&&(H=eval('('+g(0x12c)+target_state+')'),console[g(0x10f)]('is_selected',H));if(!H)return new Promise((B,R)=>{const i=g;executeActionWithXPath({'clickMethod':clickEventMethod,'targetSelector':T[s],'targetElementXPath':'.//input','observerTarget':null,'timeoutDuration':selectItemTimeout,'useTimeout':!![]})[i(0x18e)](E=>{const K=i;console[K(0x10f)](E),B(E);})[i(0x183)](E=>{console['error'](E),R(E);});});return!![];}}return![];}function handleEventsPlaceholder(L){const h0=U;if(!L)throw new Error(h0(0x172));try{var O=new Event(h0(0x164),{'bubbles':!![],'composed':!![]});O[h0(0x15e)]=!![],L[h0(0x180)](O);var l=new KeyboardEvent(h0(0x110),{'key':'\x20','code':'Space','keyCode':0x20,'charCode':0x20,'bubbles':!![],'composed':!![]});L[h0(0x180)](l);var y=new KeyboardEvent('keypress',{'key':'\x20','code':'Space','keyCode':0x20,'charCode':0x20,'bubbles':!![],'composed':!![]});L['dispatchEvent'](y);var s=new KeyboardEvent(h0(0x114),{'key':'\x20','code':h0(0x106),'keyCode':0x20,'charCode':0x20,'bubbles':!![],'composed':!![]});L[h0(0x180)](s);var T=new Event(h0(0x15c),{'bubbles':!![],'composed':!![]});T[h0(0x15e)]=!![],L[h0(0x180)](T);var S=new Event(h0(0x123),{'bubbles':!![],'composed':!![]});S[h0(0x15e)]=!![],L[h0(0x180)](S);}catch(X){console[h0(0x15d)](X);throw X;}}function simulateFullClick(L){const h1=U;try{const O=[h1(0x156),h1(0x150),'mouseup','click'];O[h1(0x154)](l=>{const h2=h1,y=new MouseEvent(l,{'bubbles':!![],'composed':!![],'cancelable':!![],'view':window});L[h2(0x180)](y);});}catch(l){reject(l);}}function executeActionWithXPath({clickMethod:clickMethod=clickEventMethod,targetSelector:L,targetElementXPath:targetElementXPath=null,observerTarget:O,timeoutDuration:timeoutDuration=0x7d0,useTimeout:useTimeout=!![]}){return new Promise((l,y)=>{const h6=j;if(O!==null){const S=new MutationObserver((H,G)=>{const h3=j;var p=[];H[h3(0x154)](R=>{const h4=h3;select_list=null;if(R[h4(0x12e)]===h4(0x12d)){var E=R['target'],Q=E['offsetParent']!==null;if(Q)try{select_list=selectListFind(E),select_list&&(!p[h4(0x179)](M=>M===select_list['best_match'])&&p[h4(0x176)](select_list[h4(0xe7)]));}catch(M){console[h4(0x15d)](h4(0x14d),M);}}R[h4(0x12e)]==='childList'&&R[h4(0x131)][h4(0x154)](w=>{const h5=h4;if(w[h5(0xe6)]===0x1){const a=w[h5(0x11e)]!==null;if(a){var z=w;try{select_list=selectListFind(z),select_list&&(!p[h5(0x179)](o=>o===select_list[h5(0xe7)])&&p['push'](select_list['best_match']));}catch(o){console[h5(0x15d)](h5(0x14d),o);}}}});});let B=selectBestMatch(p);if(B){current_list=B[h3(0x11c)],current_list_selector=B['custom_list_selector'],current_listitem_selector=B[h3(0x10c)],current_listitem_groupbox_selector=B['custom_listitem_groupbox_selector'];switch(B[h3(0x15b)]){case h3(0xf2):select_list_tagname=h3(0xea);break;case'unorderedList':select_list_tagname='ul';break;case'orderedList':select_list_tagname='ol';break;default:select_list_tagname=h3(0x16f);break;}G['disconnect'](),l(B);}else return console['error'](h3(0xf3)),null;});let X=typeof O==='string'?document['querySelector'](O):O;if(X)S[h6(0xf4)](X,{'attributes':!![],'childList':!![],'subtree':!![]});else{y(new Error(h6(0x140)));return;}}function s(H,G){const h7=h6;if(!H){y(new Error(h7(0x172)));return;}try{if(G===h7(0xde))simulateFullClick(H);else{if(G===h7(0x180))s(H);else G==='click'&&H[h7(0x15c)]();}}catch(p){y(p);}}let T=typeof L==='string'?document[h6(0x14b)](L):L;if(T&&targetElementXPath)try{const H=document['evaluate'](targetElementXPath,T,null,XPathResult[h6(0x187)],null)[h6(0x12a)];H&&(T=H);}catch(G){console[h6(0x15d)](h6(0x161),G);}if(!T){y(new Error('No\x20valid\x20target\x20element\x20found'));return;}s(T,clickMethod);if(useTimeout)setTimeout(()=>{y(new Error('Timeout\x20reached\x20without\x20detecting\x20visibility\x20or\x20new\x20element.'));},timeoutDuration);else clickToOpen!==!![]&&l(element);});}const stringMatch={};stringMatch[U(0x129)]=function(L,O){return L===O;},stringMatch['startswith']=function(L,O){const h8=U;return L[h8(0x15a)](O);},stringMatch[U(0x18f)]=function(L,O){const h9=U;return L[h9(0x177)](O);},stringMatch[U(0x108)]=function(L,O){return L['includes'](O);},stringMatch[U(0xec)]=function(L,O){const hh=U;return L[hh(0x108)](O);},stringMatch[U(0xdf)]=function(L,O){return L!==O;},stringMatch['notstartswith']=function(L,O){const hj=U;return!L[hj(0x15a)](O);},stringMatch[U(0x16e)]=function(L,O){return!L['endsWith'](O);},stringMatch[U(0xfc)]=function(L,O){return!L['includes'](O);},stringMatch[U(0x17b)]=function(L,O){const hL=U;return!L[hL(0x108)](O);},stringMatch['regex']=function(L,O){const hO=U,l=O['match'](/\/(.+?)\/([a-z]*)$/);if(l){const y=l[0x1],s=l[0x2],T=new RegExp(y,s);return T['test'](L);}else{const S=new RegExp(O);return S[hO(0x174)](L);}};const copyToClipboard=L=>{const hl=U,O=document[hl(0x190)](hl(0x137));O[hl(0x194)]=L,O[hl(0x153)](hl(0x191),''),O[hl(0x112)][hl(0x17e)]=hl(0x109),O['style'][hl(0x135)]='-9999px',document['body'][hl(0x124)](O);const l=document[hl(0x11a)]()['rangeCount']>0x0?document[hl(0x11a)]()[hl(0xed)](0x0):![];O[hl(0xea)](),document[hl(0xff)]('copy'),document[hl(0x16c)][hl(0x104)](O),l&&(document[hl(0x11a)]()['removeAllRanges'](),document[hl(0x11a)]()['addRange'](l));};function parametersProcess(){const hy=U;if(typeof element===hy(0x126)||element===null)throw new Error(hy(0x159));return_type=hy(0x144);typeof returnType!==hy(0x126)&&returnType!==null&&(return_type=returnType);return_variable_name=typeof DEFAULT_RETURN_VARIABLE_NAME===hy(0x126)?DEFAULT_RETURN_VARIABLE_NAME:'actualItems';if(typeof returnVariableName!==hy(0x126)&&returnVariableName!==null)return_variable_name=returnVariableName;result_filter='All';typeof resultsFilter!==hy(0x126)&&resultsFilter!==null&&(result_filter=resultsFilter);result_regex=null;typeof resultRegex!==hy(0x126)&&resultRegex!==null&&(result_regex=resultRegex);typeof highlightElements!==hy(0x126)&&highlightElements===!![]&&(highlight_elements=!![],highlight_grid=!![],highlight_headers=!![],highlight_rowgroup=!![],highlight_rows=!![],highlight_cells=!![],highlight_target_row=!![],highlight_target_cell=!![]);match_type=hy(0x129);typeof matchType!==hy(0x126)&&matchType!==null&&(match_type=matchType);if(typeof customListSelectors===hy(0x184))custom_list_selectors=customListSelectors;order_direction=hy(0x116);typeof sortOrder!==hy(0x126)&&sortOrder!==null&&(order_direction=sortOrder[hy(0xe8)]());target_state;if(typeof checkState!==hy(0x126)){if(checkState==!![])target_state=hy(0xfb);else{if(checkState==![])target_state=hy(0x169);else{if(checkState!==null)target_state=checkState;}}}typeof highlightElements!=='undefined'&&highlightElements===!![]&&(highlight_elements=!![],highlight_select_item=!![],highlight_groupbox=!![],highlight_selectlist=!![],highlight_selectlist_opener=!![]),verbose&&(console[hy(0xf7)](hy(0x178),return_type),console['info'](hy(0xe2),return_variable_name),console['info'](hy(0xf5),result_filter),console[hy(0xf7)](hy(0x13f),result_regex),console[hy(0xf7)](hy(0xf9),match_type),console[hy(0xf7)]('custom_list_selectors',custom_list_selectors));}parametersProcess();function h(){const hs=['cx-fieldset','value','list','getElementsByTagName','menu','input','simulateFullClick','notexact','span','text','return_variable_name','Actual\x20Item\x20Order:\x20\x20\x20','comboboxList','pull-right','nodeType','best_match','toUpperCase','div[role=\x22listitem\x22]','select','reverse','contains','getRangeAt','match','dropdownUl','listboxOptionDiv','fieldset','standardSelect','Select\x20Option(s)\x20==>\x20Target\x20element\x20must\x20be\x20a\x20select,\x20ol,\x20ul,\x20or\x20custom\x20container.','observe','result_filter','select_list','info','stringify','match_type','attributeValue','querySelector(\x22input[type=\x27checkbox\x27]\x22).checked\x20===\x20true','notincludes','18BvMUUa','selected','execCommand','COMING\x20SOON','\x20Expected\x20Order:\x20','label','call','removeChild','length','Space','option','includes','absolute','border','actual_value','custom_listitem_selector','.o-resultsContainer','role','log','keydown','expected_value','style','product-set','keyup','select_list_tagname','ASCENDING','div[role=\x22list\x22]','2195AgPoew','sort','getSelection','4110832VthmuB','select_list_instance','index','offsetParent','div','querySelectorAll','SelectList\x20Items\x20Validate\x20-\x20Not\x20Found:\x20','attributeName','change','appendChild','resultsContainerItem','undefined','label[class*=\x22cx-checkbox\x22]','o-resultsContainer','exact','singleNodeValue','2px\x20dashed\x20Green','items[target_item_index].','attributes','type','aria-controls','firstElementChild','addedNodes','cxFieldsetCheckbox','toLowerCase','2NriopE','left','divRoleList','textarea','join','1392783KBWhlm','filter','VALUE','every','slice','TEXT','result_regex','No\x20valid\x20observer\x20target\x20found','a.o-item','matches','.cx-productcard-snipe-label','STRING','unorderedList','div[role=\x22menu\x22]','div[role=\x22option\x22]','items.length','resultValues\x20list\x20not\x20found','getAttribute','querySelector','class','executeActionWithXPath:err','random','hidden','mousedown','string','4596XfNSmr','setAttribute','forEach','.pull-right','mouseover','4164qCFSnj','floor','Target\x20List/Select\x20element\x20is\x20undefined','startsWith','name','click','error','simulated','1970jUhgfj','span[role=\x22combobox\x22]','Failed\x20to\x20evaluate\x20XPath:','firstChild','2px\x20solid\x20Green','hover','2px\x20solid\x20Red','options','prototype','custom_listitem_groupbox_selector','querySelector(\x22input[type=\x27checkbox\x27]\x22).checked\x20===\x20false','tagName','custom_list_selector','body','href','notendswith','custom','textContent','number','Target\x20element\x20is\x20undefined\x20or\x20null','last','test','splice','push','endsWith','return_type','some','5907TNNDdC','notcontains','div[data-react-toolbox=\x22dropdown\x22]','19611hJcSxx','position','ul\x20>\x20li,\x20ol\x20>\x20li','dispatchEvent','ITEM','pullRightAnchor','catch','object','484374LmPzHl','1596345dGSLih','FIRST_ORDERED_NODE_TYPE','Options\x20are\x20not\x20in\x20','#categories_listbox','dropdown','o-item','listbox','fieldset[class=\x22cx-fieldset\x22]','then','endswith','createElement','readonly','openerSelector'];h=function(){return hs;};return h();}

/*** END COMMON TABLE FUNCTIONALITY ***/

/*** Function Specific Logic Below ***/

// custom_list_selectors.push(
//         {
//         name: "divRoleList",
//         custom_list_selector: {
//             tagName: "div",
//             attributeName: "role",
//             attributeValue: "list",
//             querySelector: 'div[role="list"]'
//         },
//         custom_listitem_selector: {
//             tagName: "div",
//             attributeName: "role",
//             attributeValue: "listitem",
//             querySelector: 'div[role="listitem"]'
//         }
//     }
// );

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
                foundElement = select_list ?? result;
                console.log('New element detected:', foundElement);
                resolve(foundElement.select_list_instance ?? foundElement.select_list);  // Pass the found element to the next .then()
            })
    }
    else {
        resolve(element);
    }

})
    .then(foundElement => {

        results = selectListFind(foundElement);

        select_list = results?.select_list;
        select_list_tagname = results?.select_list?.tagName.toLowerCase();
        select_list_opener = results?.select_list_opener;
        select_listitem_groupbox = results?.select_listitem_groupbox;
        selected_item_indexes = [];
        unselected_item_indexes = null;

        var select_tags = ["select", "ol", "ul", "custom"];
        if (!select_tags.includes(select_list_tagname)) {
            throw new Error("Select Option(s) ==> Target element must be a select, ol, ul, option, li, or custom");
        }

        var actualValues = selectListItemsGet(select_list, return_type);

        var filteredValues = selectListItemsFilter(actualValues);

        copyToClipboard(JSON.stringify(filteredValues, null, 1));
        exportsTest[return_variable_name] = filteredValues;

        if (verbose) {
            console.log("===>", return_variable_name, JSON.stringify(exportsTest[return_variable_name]));
        }

    })
    .then(() => {

        /* Normalize items to select
         */
        var items_to_select = [];
        if (typeof itemId !== 'object')
            items_to_select.push(itemId);
        else
            items_to_select = itemId;

        /* Execute (Loops each item to select and selects/deselects as appropriate and if possible)
         */
        items_to_select.forEach(function (item_to_select) {
            if (select_listitem_groupbox !== undefined && select_listitem_groupbox !== null)
                selectItem(select_listitem_groupbox, item_to_select, select_list_tagname, match_type, target_state);
            else
                selectItem(select_list, item_to_select, select_list_tagname, match_type, target_state);

        });

    })
    .catch(error => {
        console.error('Error:', error);
    });

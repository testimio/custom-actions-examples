/**
 *  Select List - Items Select
 * 
 *      Select an item or multiple items from a listbox, dropdown, multi-select or table.  Optionally can support check list items
 *
 *  Parameters: 
 *
 *      element  : Target element (or parent/child of) a <select>, <ol>, <ul> or <table>
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
 *      matchType [optional] : Text match type when searching for text in lists/selects
 *		    Examples: exact (default), startswith, endswith, includes
 *
 *      highlightElements (JS) [optional] : Highlight Target Grid, Header, RowGroup, Cells for posterity (and debugging)
 * 
 *  Returns
 *      selectedIndex
 *      selectedText
 *      selectedValue
 * 
 *  Version       Date       Author          Details
 *      2.0.1     07/15/2022  Barry Solomon   Inital support for "KENDO" listboxes and major refactoring
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 *
**/

/*** START COMMON LIST FUNCTIONALITY ***/

/* User setable parameters
 */
var return_variable_name = undefined;
var return_type = 'STRING';
var result_filter = "All";
var result_regex = null;
var match_type = 'exact';
var target_state = undefined;
var verbose = true;

var DEFAULT_RETURN_VARIABLE_NAME = 'actualItems';

/*** LIST FUNCTIONS v2.0.1 ***/
const _0x53d5ff=_0x139c;(function(_0x374a9c,_0x212f83){const _0x2a95fb=_0x139c,_0x5d7315=_0x374a9c();while(!![]){try{const _0x60835f=parseInt(_0x2a95fb(0x90,'1qFW'))/0x1+parseInt(_0x2a95fb(0x181,'u20m'))/0x2+-parseInt(_0x2a95fb(0xc5,'nvzw'))/0x3+-parseInt(_0x2a95fb(0x8d,'zIhe'))/0x4+-parseInt(_0x2a95fb(0xf8,'nt*x'))/0x5*(-parseInt(_0x2a95fb(0xd1,'wq@d'))/0x6)+parseInt(_0x2a95fb(0x14c,'5^W('))/0x7*(parseInt(_0x2a95fb(0xa7,'i3BT'))/0x8)+-parseInt(_0x2a95fb(0x132,'AQLw'))/0x9;if(_0x60835f===_0x212f83)break;else _0x5d7315['push'](_0x5d7315['shift']());}catch(_0x2cccfa){_0x5d7315['push'](_0x5d7315['shift']());}}}(_0x47da,0xd9c7c));var highlight_elements=![],highlight_select_item=![],highlight_groupbox=![],highlight_selectlist=![],highlight_selectlist_opener=![],LIST_HIGHLIGHT_BORDER=_0x53d5ff(0x149,'C9Fn'),LIST_OPENER_HIGHLIGHT_BORDER=_0x53d5ff(0x9f,'7MSO'),LIST_GROUPBOX_HIGHLIGHT_BORDER=_0x53d5ff(0x15c,'Lg*$'),LIST_ITEM_SELECTED_HIGHLIGHT_BORDER=_0x53d5ff(0x8c,'5^W('),current_list_selector=null,current_list_opener_selector=null,current_listitem_groupbox_selector=null,current_listitem_selector=null,custom_list_selectors=[{'custom_list_selector':{'tagName':'span','attributeName':_0x53d5ff(0x1b0,'u20m'),'attributeValue':'combobox','querySelector':_0x53d5ff(0x105,'WxAS')},'custom_listitem_groupbox_selector':{'display':'hidden','parentElement':document,'selectListLinkAttribute':_0x53d5ff(0x196,'WxAS'),'tagName':'ul','querySelector':_0x53d5ff(0x169,'Lg*$')},'custom_listitem_selector':{'tagName':'li','querySelector':'li'}},{'custom_list_selector':{'tagName':_0x53d5ff(0xb0,'cgjV'),'attributeName':_0x53d5ff(0x106,'nt*x'),'attributeValue':_0x53d5ff(0x10e,'EZxn'),'querySelector':_0x53d5ff(0xf9,'M395')},'custom_listitem_selector':{'tagName':'div','attributeName':_0x53d5ff(0xf0,'tmIa'),'attributeValue':_0x53d5ff(0xbc,'5^W('),'querySelector':_0x53d5ff(0x1b1,'Qq*K')}},{'custom_list_selector':{'tagName':_0x53d5ff(0x143,'jyii'),'attributeName':_0x53d5ff(0x16f,'jyii'),'attributeValue':_0x53d5ff(0x191,'WxAS'),'querySelector':'div[role=\x22listbox\x22]'},'custom_listitem_selector':{'tagName':'div','attributeName':_0x53d5ff(0x168,'@0Vx'),'attributeValue':'option','querySelector':_0x53d5ff(0x16d,'7MSO')}},{'custom_list_selector':{'tagName':_0x53d5ff(0x8b,'tXNw'),'attributeName':_0x53d5ff(0x182,'!FLr'),'attributeValue':_0x53d5ff(0x174,'d[d('),'querySelector':'.o-resultsContainer'},'custom_listitem_selector':{'tagName':'a','attributeName':'class','attributeValue':_0x53d5ff(0xc7,'6eaL'),'querySelector':_0x53d5ff(0x17b,'6eaL')}},{'custom_list_selector':{'tagName':_0x53d5ff(0xa3,'efsP'),'attributeName':'data-react-toolbox','attributeValue':_0x53d5ff(0xab,'cgjV'),'querySelector':'div[data-react-toolbox=\x22dropdown\x22]','openerSelector':_0x53d5ff(0xe1,'5^W(')},'custom_listitem_groupbox_selector':{'tagName':'ul','querySelector':'ul','display':_0x53d5ff(0x131,'e7bS')},'custom_listitem_selector':{'tagName':'li','querySelector':'li'}}];function parametersProcess(){const _0x51c543=_0x53d5ff;if(typeof element==='undefined'||element===null)throw new Error(_0x51c543(0x184,'jyii'));return_type=_0x51c543(0xdd,'!OfX');typeof returnType!=='undefined'&&returnType!==null&&(return_type=returnType);return_variable_name=DEFAULT_RETURN_VARIABLE_NAME??'actualItems';if(typeof returnVariableName!==_0x51c543(0xac,'U!m8')&&returnVariableName!==null)return_variable_name=returnVariableName;result_filter='All';typeof resultsFilter!==_0x51c543(0xdf,'M395')&&resultsFilter!==null&&(result_filter=resultsFilter);result_regex=null;typeof resultRegex!=='undefined'&&resultRegex!==null&&(result_regex=resultRegex);typeof highlightElements!==_0x51c543(0x1b9,'gDr!')&&highlightElements===!![]&&(highlight_elements=!![],highlight_grid=!![],highlight_headers=!![],highlight_rowgroup=!![],highlight_rows=!![],highlight_cells=!![],highlight_target_row=!![],highlight_target_cell=!![]);match_type=_0x51c543(0xb5,'nvzw');typeof matchType!==_0x51c543(0x11e,'!OfX')&&matchType!==null&&(match_type=matchType);if(typeof customListSelectors===_0x51c543(0x9c,'5^W('))custom_list_selectors=customListSelectors;order_direction=_0x51c543(0x18e,']Azp');typeof sortOrder!=='undefined'&&sortOrder!==null&&(order_direction=sortOrder[_0x51c543(0xe3,'78!R')]());target_state;if(typeof checkState!==_0x51c543(0x192,'AQLw')){if(checkState==!![])target_state=_0x51c543(0x1ba,'M395');else{if(checkState==![])target_state=_0x51c543(0x13d,'1qFW');else{if(checkState!==null)target_state=checkState;}}}typeof highlightElements!==_0x51c543(0x1b9,'gDr!')&&highlightElements===!![]&&(highlight_elements=!![],highlight_select_item=!![],highlight_groupbox=!![],highlight_selectlist=!![],highlight_selectlist_opener=!![]),verbose&&(console['info'](_0x51c543(0xca,'tXNw'),return_type),console['info'](_0x51c543(0x156,'Yy3$'),return_variable_name),console['info']('result_filter',result_filter),console[_0x51c543(0xe7,']fdc')](_0x51c543(0x93,'!OfX'),result_regex),console[_0x51c543(0x9a,'e7bS')](_0x51c543(0x199,'AQLw'),match_type),console[_0x51c543(0xdc,']Azp')](_0x51c543(0x183,'uMdV'),custom_list_selectors));}parametersProcess();function selectListFind(_0x46c617){const _0x1153bf=_0x53d5ff;let _0x9a1b4a=_0x46c617,_0x3b3d22=_0x9a1b4a[_0x1153bf(0x157,'Yy3$')][_0x1153bf(0xa8,'6eaL')](),_0x41932d=['select','ol','ul',_0x1153bf(0x12b,'AQLw'),_0x1153bf(0x119,'M395')];if(!_0x41932d['includes'](_0x3b3d22)){_0x9a1b4a=_0x46c617[_0x1153bf(0xeb,'sETr')](_0x1153bf(0x9b,'e7bS'))[0x0];if(typeof _0x9a1b4a==='undefined'||_0x9a1b4a===null)_0x9a1b4a=_0x46c617['getElementsByTagName']('ul')[0x0];if(typeof _0x9a1b4a===_0x1153bf(0x10d,'EZxn')||_0x9a1b4a===null)_0x9a1b4a=_0x46c617[_0x1153bf(0xc2,'Yy3$')]('ol')[0x0];if(typeof _0x9a1b4a==='undefined'||_0x9a1b4a===null)custom_list_selectors[_0x1153bf(0xbe,'IrA*')](_0x41487e=>{const _0x4c5abe=_0x1153bf;if(typeof _0x9a1b4a===_0x4c5abe(0x1c8,'Yy3$')||_0x9a1b4a===null){_0x9a1b4a=_0x46c617[_0x4c5abe(0xd8,'6K!x')](_0x41487e[_0x4c5abe(0xf6,'C9Fn')]?.['querySelector'])[0x0];if(_0x9a1b4a===undefined||_0x9a1b4a===null)_0x9a1b4a=_0x46c617['parentNode'][_0x4c5abe(0x15d,'uMdV')](_0x41487e[_0x4c5abe(0x11c,'X^pK')]?.[_0x4c5abe(0xa4,'jyii')])[0x0];typeof _0x9a1b4a!==_0x4c5abe(0x121,'MLKn')&&_0x9a1b4a!==null&&(_0x3b3d22=_0x4c5abe(0xa9,'IrA*'),current_list_selector=_0x41487e[_0x4c5abe(0x135,'u20m')],current_listitem_groupbox_selector=_0x41487e[_0x4c5abe(0x198,'8j[]')],current_listitem_selector=_0x41487e[_0x4c5abe(0x10f,'uMdV')]);}});else _0x3b3d22=typeof _0x9a1b4a==_0x1153bf(0x1c8,'Yy3$')||_0x9a1b4a==null?'':_0x9a1b4a[_0x1153bf(0x14d,'U!m8')][_0x1153bf(0x166,'AQLw')]();}let _0x5a605c=[_0x1153bf(0xea,'78!R'),'ul','ol',_0x1153bf(0xcd,'sETr'),'html'];if(!_0x5a605c[_0x1153bf(0x103,'u20m')](_0x3b3d22)){_0x9a1b4a=_0x46c617;while(!_0x5a605c[_0x1153bf(0x1a0,'e^be')](_0x3b3d22)){_0x9a1b4a=_0x9a1b4a[_0x1153bf(0x1bf,'AQLw')],_0x3b3d22=typeof _0x9a1b4a===_0x1153bf(0xaa,'X^pK')||_0x9a1b4a==null?'':_0x9a1b4a[_0x1153bf(0xee,'M395')][_0x1153bf(0x180,'u20m')](),custom_list_selectors[_0x1153bf(0x102,'efsP')](_0x284c54=>{const _0xe744ae=_0x1153bf;if(_0x3b3d22===_0x284c54['custom_list_selector']?.[_0xe744ae(0x114,'78!R')])switch(_0x284c54[_0xe744ae(0xa1,'8j[]')]?.[_0xe744ae(0xfe,'IrA*')]){case _0xe744ae(0x175,'efsP'):_0x9a1b4a[_0xe744ae(0x18f,']Azp')][_0xe744ae(0x171,'AQLw')](_0x284c54['custom_list_selector']?.[_0xe744ae(0xed,'!OfX')])&&(_0x3b3d22=_0xe744ae(0xc9,'bRa9'),current_list_selector=_0x284c54[_0xe744ae(0x123,'@0Vx')],current_listitem_groupbox_selector=_0x284c54[_0xe744ae(0x160,')2cs')],current_listitem_selector=_0x284c54[_0xe744ae(0x19b,'tXNw')]);break;default:_0x9a1b4a['attributes'][_0x284c54[_0xe744ae(0x123,'@0Vx')]?.[_0xe744ae(0x159,'!FLr')]]?.[_0xe744ae(0x1bb,'efsP')]===_0x284c54[_0xe744ae(0x12c,']fdc')]?.['attributeValue']&&(_0x3b3d22='custom',current_list_selector=_0x284c54['custom_list_selector'],current_listitem_groupbox_selector=_0x284c54?.['custom_listitem_groupbox_selector'],current_listitem_selector=_0x284c54[_0xe744ae(0x145,'gDr!')]);break;}});}}let _0x1d128e=_0x9a1b4a;current_list_selector?.[_0x1153bf(0x1ca,'IrA*')]!==undefined&&(_0x1d128e=_0x9a1b4a[_0x1153bf(0x115,'s0Gy')](current_list_selector?.[_0x1153bf(0x167,'e^be')])[0x0]);let _0x13983e=undefined;if(current_listitem_groupbox_selector!==undefined){let _0x270d3e=_0x9a1b4a;if(current_listitem_groupbox_selector?.[_0x1153bf(0x95,'s0Gy')]!==undefined){if(typeof current_listitem_groupbox_selector?.[_0x1153bf(0xc0,'@0Vx')]===_0x1153bf(0x122,'Qq*K'))_0x270d3e=document[_0x1153bf(0x152,'tmIa')](current_listitem_groupbox_selector?.[_0x1153bf(0x1be,']Azp')])[0x0];else _0x270d3e=current_listitem_groupbox_selector?.[_0x1153bf(0x1b6,'M395')];}_0x13983e=_0x270d3e[_0x1153bf(0x1bd,'e7bS')](current_listitem_groupbox_selector?.['querySelector'])[0x0];if(_0x13983e!==undefined){if(highlight_elements&&highlight_groupbox&&_0x13983e!==null)_0x13983e[_0x1153bf(0xb1,'8j[]')][_0x1153bf(0x116,'7MSO')]=LIST_GROUPBOX_HIGHLIGHT_BORDER;}}if(_0x13983e!==undefined&&current_listitem_groupbox_selector?.[_0x1153bf(0xb3,'nt*x')]=='hidden'){var _0xdd961b=new MutationObserver(function(_0x13edcb){const _0x37af9c=_0x1153bf;_0x13edcb[_0x37af9c(0x17c,'nvzw')](function(_0xe4c4a1){const _0x4718d6=_0x37af9c;_0xe4c4a1[_0x4718d6(0xa6,'Lg*$')]===_0x4718d6(0xa5,'MLKn')&&console[_0x4718d6(0x142,'X^pK')](_0x4718d6(0x16e,'jyii')+_0xe4c4a1[_0x4718d6(0xe5,'MRlE')][_0x4718d6(0xad,'e^be')][_0x4718d6(0x140,'@0Vx')]);});});let _0x48d1fa={'attributes':!![],'childList':!![]};_0xdd961b[_0x1153bf(0xe8,'d[d(')](_0x13983e,_0x48d1fa);}if(highlight_elements&&highlight_selectlist&&_0x9a1b4a!==null)_0x9a1b4a[_0x1153bf(0x178,'M395')][_0x1153bf(0x118,'d[d(')]=LIST_HIGHLIGHT_BORDER;if(highlight_elements&&highlight_selectlist_opener&&_0x9a1b4a!==null)_0x9a1b4a['style'][_0x1153bf(0x112,'EZxn')]=LIST_OPENER_HIGHLIGHT_BORDER;return{'select_list':_0x9a1b4a,'select_list_opener':_0x1d128e,'select_listitem_groupbox':_0x13983e,'select_list_tagname':_0x3b3d22};}function selectListItemsGet(_0x257173,_0x56541d){const _0x2e5229=_0x53d5ff;let _0x4b9efc=_0x257173[_0x2e5229(0xcf,'cgjV')],_0x36389=[],_0x1861ff=null;switch(_0x257173[_0x2e5229(0x18d,'e^be')]){case _0x2e5229(0x154,'8j[]'):_0x1861ff=_0x4b9efc[_0x2e5229(0x1c0,'Lg*$')];break;case'ul':case'ol':_0x1861ff=_0x4b9efc[_0x2e5229(0x1b5,'@0Vx')]('li');break;case'custom':_0x1861ff=_0x4b9efc[_0x2e5229(0x1bd,'e7bS')](current_listitem_selector?.[_0x2e5229(0x1a7,'rDmj')]);break;}console[_0x2e5229(0x19a,'7MSO')](_0x2e5229(0x1c9,'MRlE'),_0x1861ff[_0x2e5229(0x138,'8j[]')]);let _0x371063=null;for(let _0x2ff12e=0x0;_0x2ff12e<_0x1861ff['length'];_0x2ff12e++){switch(select_list_tagname){case _0x2e5229(0xaf,'kN[['):switch(_0x56541d){case _0x2e5229(0x139,')2cs'):_0x371063={'index':_0x2ff12e,'text':_0x1861ff[_0x2ff12e]['text'],'value':_0x1861ff[_0x2ff12e]['value']};break;case'VALUE':_0x371063=_0x1861ff[_0x2ff12e][_0x2e5229(0x1af,'@0Vx')];break;case'TEXT':case _0x2e5229(0x1c5,'5^W('):_0x371063=_0x1861ff[_0x2ff12e]['text'];break;default:_0x371063={'index':_0x2ff12e,'text':_0x1861ff[_0x2ff12e][_0x2e5229(0x10a,'i3BT')]},_0x371063[_0x56541d]=_0x1861ff[_0x2ff12e]['attributes'][_0x56541d]['value'];break;}break;case'ul':case'ol':switch(_0x56541d){case _0x2e5229(0x126,'e7bS'):_0x371063={'index':_0x2ff12e,'text':_0x1861ff[_0x2ff12e][_0x2e5229(0xa2,'zIhe')]};break;case'VALUE':_0x371063=_0x1861ff[_0x2ff12e]['value'];break;case _0x2e5229(0x1a4,'cgjV'):case _0x2e5229(0x164,'zIhe'):_0x371063=_0x1861ff[_0x2ff12e]['textContent'];break;default:_0x371063={'index':_0x2ff12e,'text':_0x1861ff[_0x2ff12e][_0x2e5229(0x17d,'tmIa')]},_0x371063[_0x56541d]=_0x1861ff[_0x2ff12e]['attributes'][_0x56541d]['value'];break;}break;case'custom':switch(_0x56541d){case'ITEM':_0x371063={'index':_0x2ff12e,'innerHTML':_0x1861ff[_0x2ff12e][_0x2e5229(0xfd,'8j[]')]};break;case _0x2e5229(0xf5,'U!m8'):_0x371063=_0x1861ff[_0x2ff12e][_0x2e5229(0x97,'MLKn')];break;case _0x2e5229(0x137,'tXNw'):case'STRING':_0x371063=_0x1861ff[_0x2ff12e][_0x2e5229(0x1c7,'wq@d')];break;default:_0x371063={'index':_0x2ff12e,'text':_0x1861ff[_0x2ff12e][_0x2e5229(0x11f,'78!R')]},_0x371063[_0x56541d]=_0x1861ff[_0x2ff12e][_0x2e5229(0xde,'M395')][_0x56541d][_0x2e5229(0xbf,'!OfX')];break;}break;}if(_0x371063!==null)_0x36389['push'](_0x371063);}return _0x36389;}function _0x47da(){const _0x5ab6bd=['amkUwCkmxsZcQCkIh2BcRW','j8kJlmkVuxNcRMe8W48','yuz5r8kbDq5MW7rOh8kBe8oIW7tcIW','BbdcPGtdVflcU1e','lCoYWQVcNSkHW7JdIJhdNf3cIWpdLCoUW5GM','WPVcPSoA','sJpdPg5MeG','AIP+W5eUWO4','nmkYlmkOsNxcHgm4W44dW4KMW503WRldGhymBq','mSk2p8ktwxBcVG','r8kFlh0w','WO9IuSkkWOrgy1WcDGpdICow','fbH6W5jb','W7eDW7v0s8o3W7i','iKnKfCklsqDJW7uRlmkgbmogW7y','qCoHAmoJotyFWOTFEmkMwupcLs5S','W7imW7jP','W45xrCkmWPHfEGGOsGBdGCobWPLk','CSkeWPVcUguHn35XW7eDW7RcPCkxW6tdRmovW77dNrmQqSkfW5BcMmocxY9CW7HVbCk2','WRldKSk2Ca','WOCBDCoiWP1v','hqf8W4HAWRvO','WPyhhrqcWRe','aKLOW5XFlIy','W4JcHIetpCk1W7CLW5iiWPi','W5lcTCk5Amk3W4vqWP/dKvnvW6irya','WPhcKdqY','m1b9qCkDqqr4W7HUgmkRdCokW6VcK8oXp8kW','AN3cSmkbW4XWhmkR','WPNdMSkhWQzxha','xJpdVe5PaXVdQGa7jqJdNtKDls4jAmo8','fd3cU0xdQtnXW6RdJHNcQCk0zLhcGahdHmoB','W514fSoaWRqCW6S5os0jj3qMWP/dI8kBW59GdHldOWRcM8oquG','W5T2cmoc','ofJdU8kJDwTB','W5/cHGmik8k5W6Sv','w8oXDmoI','kSoMWQlcMCk9','jmkjWPVcIbKVWP4UkSogu8kVe8kZWQq7i8op','pYJdOvFdHq','nuFdVCkUF3C','yrVdV8knvMngWOW','W71bWQRdPw8','qmkljxOkASk5v8kFWOyWea8','W5VcN8kgW6KXWQpcNJDCWRa6','WPbFFCoScmoCjSo9','WPhcPSopWQ0qWQKL','kmoIWRBcMmkBW4tdGsNdNfdcIW','agWxfSo3WRTNCSkcjCooiCox','DtTIW580WOe','uW/dSCkvz1/dSZ5PW6Dx','ffhcJ8ookq7cUq1MW5PWW7FdIW','WO16r8klWP4','u8oHFSoLlWGLWOTtAmkMAulcSs5Li8kdf8klW6y','W714fSoaWRqCW6ugjcCrBqK1WPRdNCkrW4KPbXFdSH7dNSkdbJOIWQS/yCo3nISHWRqLwmk4','sZpdVM53frm','fvdcJ8ooja/cSe1cW55gW6pdRmou','W7CdW6v4xa','esdcUwZdSJ5OW7VcLKG','WRrMpCkQ','eb5SW5G','WO/dPmkXv8kcW6P9W7ZcN0b/','lSoMWQdcImk3W4y','W47cOmkWy8kXW4nCWPBdLevcW4KkC8kslwddGWW','W4ugW503WR14W4NcTmoH','W6C5W78bWObWW6NcICos','W6ZdShTVW4ybuSo7','W6ZcKCoxWQ4Rgmor','W4NcHWKzlmk5W6SdW5C','pGWqculdNWLv','CmkVqYbJW48','WPJcUCojWOeEWQq+','W6hcISonWRTKfmogW6LrWO5zW4BcLW','WQH8kq','wIpdU39QcYNdOWC8iIpdKaGrfqCAASoSWQ5hu8oCW77cUMnGk8kcuctdPa','W5hcIbKFiSkpW7eFW4mE','hdVcQG','uSklm3WCvmkdv8ktWPyWfGNcMSorW7vkW5xcO27dQKrvW7m','neddRSkKFwa','jehcH8kYo8os','letdUfxcPHldPKxdHmoTWQhdKWy','utjrrSkKW78','W5tcQ8k/ASkNW5nMWOK','p8obWPhcMq','omoqWPVcHaq9WPS8ia','W5T4cSodWR4f','iJ/dNCo+','W6ujW6iLxG','WPOlDmopWPTtqh4','W68yW6rVxCokW6rGW4hdQxFcNCoS','aSkRwSkDxcu','rmoBWOhcNdXc','AXdcSHxdNeNcSehdJ8onWPC','ESoRfSkYgeJcVNK8W58EW4eRW59SW5m','WRXZW6JdGvxdVSkQtq','yaBdHse','rCkBm3W','WPxcNJqIdW','vq/dKCkF','vIXVxZpcTNpcKCkcW7tcSmkuCWldHmkchq/cS2q','xL99umoIW6tcU8oYWRKcpfW','q8oGDmo9jq','W6HCWQhdUN7cG8kvW6JcLmo+WPKvtmkicKZcSa','WOtcMIWsbSkoW6K9uclcVIiDlCknh8kij8kHmG','W75uWQhdRgtcSSk8W6hcNmo2WPipEW','k0xcHCk5','tv9XD8oeW6FcSmoLWQGfjW','WPWaFmopWP5os3/cKa','W79aWRBdU3pcLCkCW6hcNmo4WOmoFCoiquNcUIJdTSoUi3CNE8kKsCoTwSk+WOi7W5/cL8oCWQJdOmk7a8kSgmkLWOr7B8kwlSo+WO4fE8kLW6zgWRyofa','mIVdPehdOmogs8kaia','nYhdUvC','rSkRWOG2Cmo7omo8qCkNuCkrW5K+W5dcQG','W7q0W6WxWP1iW4xcLSodlCkrhSkF','W4ZcIb8zjmkKW4SjW5CE','F0nOxmkxsbG','WQhcQmorWOevWQS5W6ZdHmojW6BcLetdQCo4W5mGvmkNwWfqAmk+qeGOW4mlq8okb8oUySo3','W5NcHWKppCk5W7eo','Ah3cSblcHSkFzSkxa8kTWQtdIq','oKhcHmk6oCoFWQ5fW7HPz2tcT8kBfW','E8oQWR3cSGzT','WRDNpmkRW5rhy8kVkW','z8kNqb7dUfZdLCkZsYFcRW','m8k5pmk4xNlcTxa9','WPZdI8kmWQXqwSorWRddKHrdsW','pXmbaL/dJdLeWRRdIcZcTSkuWPq','vmkYWOqNyG','WOTUq8kBWQ5lE0ugvGy','rmkQWP8Tz8opnmo2xq','W5ZcOCk4vmkZW5LKWP8','rZjVtCk2W6GJymkfd8od','vCkxnG','gSooWPFdMZTfWOldUJv5yLlcKW','W7DKEw56W4ldN8ohCXPbW4nT','WQn8W6FdMeu','W6OcW41Yu8o8W7npW4xdUwy','wqaSWOmaEbtdRCoZWRJdLSkl','WPOAASodWPzathZcJq','F8kMrcr8','DcPJW4m2WPldUWhdIgWlWPK','hK1UW5XEjW','WQv8W7NdIe7dRSkkuSosj8oly8ke','WOtcPCouWOSu','iuNdO8k/FW','W6O6W6OrWPXsW7tcM8oplSkh','W5hcQSk7','xSkWWOSR','rmk7WOeHASoC','r8oCWOxcNITE','wIZdQrZdQ8kKW50mW4CLdG','qcLAtSkK','qItcTt7dVZ1UW6FcLL/dPSkdyf3cIGe','EXZcUrhdVLlcVv3dR8ovWOBdUHe','wIpdU39QcYNdOWC8iHxdLWGqlWmCASoR','WRe2nYKpWPNcHCoRDtj8','oc3dTG','W5HSaCovWQG7WQaMkdCrlsG','nLZdU8k4C2DDWPP1Aq','zePSua','WP7dImoiWQrkW7JdGdLEWOyHWOuz','WOuExSkUfSonmCotxITs','mXyxgfxdKW','WPpdUCkkqCkbW692W7RcJW','eGJdQSoAjJjMWPq','AHVcRGtdUu/cSfddJG','W47cSCkLASk3','W68aW6mTwmkO','qdHpr8kIW7K','eHpdSW','sIldSwDG','xsmgimkbWPrIWPOsWOH+','xvn6C8oRW6NcPW','qCk/WOeXBa','WPlcSCoCWOSf','sK5OCCoZW7VcICo4WRKd','uG7dMCkFDLpdRXHS','WPxdU8khr8kc','axdcRmky','vcXRDZxcMNFcNCotWRi','mmoOWQK','rmoxWPZcJYfEWOVdVG','y0D9r8kmvtXJW6vJ','nGWwkvVdNqi','Cc58W4m/','WPpcNIOYbmkFW4e0wZVcQa4q','W7CdW6jXuCo9W6r/','iCkYlmkyvh7cTNa3W4GzW6O9W6uZWORdOhymBq','W7CkW4eLw8kLxYvIW7FcQG','W5JcVCkSy8kXW4nMWP7dOKbxW7OlDW','W4tdUmkjW5XhW7X7W5JcGSodW6VcQxe','w8orWP3cJW','WP5CE8k1bmof','uSkrmhe','F8k/xJn4W4O','q8kBnh0bv8kdt8kdWPuH','iXCwbvtdMqnhWQ8','su96AW','k1hcMSkHimox','iKLOW5XFlIBcR8ouWRddKCo7W688W6BdKKL/wq','br/dQCopisLoWPzxW63cIq','i1BcQ8kDW5X3dCk9WRlcS19xW6xcNmoGWQO/','jCkUEG7dJhBdIG','vtjrz8kGW645','W6ajW6qPrW','W5tcOmoyf8orWRiSW4FcIgnslmoY','rCo6ACo0jGWuWOjE','W405W5nuASoE','B8kVqsj0W5m','rtBdUaFdVmkuW5qvW4yJcCkwjSoUW4jT','W71bWQhdOgtcOCkqW6VcGa','j1RdOmk+DxfrWP51','kmorWPRcMqu3','W607W7GD','vrTcW78uWQe','W69bWQFdU2pcPmkmW7NcNmoO','W7TBWRFdRgZcR8kxW6JcNq','W4zPemooWR4gWRy','qCoqWP/cJJW','kchdUfddL8ovqSku','bH5DW5ffWR5Pz3ddGra','iWWwga','WOhdNSkBWQzgaa','AmkVvtnuW4HVW4KnW4BcQG','W7BdU3fL','jmogWPRcIbGSWPC','WP1Ir8kkWPLxyuetua','arrKW4rwWQ8','l0hcNCkqi8oFWOjmW7PpDuJcQCkQbxaervNdHG','W7aaW6eVt8k0','zZTKW4qZWOtdKqFdIf0pWO0iWOO','W7PuWRtdH2VcQ8kC','je3dO8kVExe','lSoOWQlcIq','W4ZcNb4u','WPtdI8kDWRnkfSoiWQhdMqa','W7ueW6e/sq','BrpdKf8','sttcHJtdMG','ygBcOmkzW5z5jSk0WR/dOgr6W7lcNmo+W7v8W508W6O','WOhdUCksACoYW5PIWO7dNL4iWQG','dWmWn8kZWRhdQ8ouWRKVbenX','W6PCWQxdKNJcQCkvW6JdHmk5WPSiFmkuqx0','WOfMuSkrWOjkzq','WRqMkI81WQxcJSoZDt98W7Ph','uSkMWOWNFq','udJdPM53lIldGIi','mrCqhLpdNb9vWRpdOY7cR8kE','W4BcLmkDW7ehWQJcLta','xCkBlM8huq','nsRdRKhdHmoVC8k4cq','oIVdSMhdL8oetW','tG7dNSkwzv7dPa4','W5ldJw5UuSoFWRqIwq7cOJKn','W7pcImofWRqsbCogW6TaW4euW4NcI8kfW6NcQ8oNWPyqW5aj','s1vLzG','ErRcUctdVKxcTG','frr8W7jqWRD+r2xdMXOX','v8oNemoDb3hdN8kpaK7cNhac','W5VcN8kgW6K','WPqhD8kZga','W4OXW4Gh','WRf9kSkNW5XjzmkSnG','WQH6pCk2','u8oHFSoLlWGLWOTtAmkMx0xcSs9Fm8ksfmkCW7BdGmoKyq','W7pcJmowWRmNemoaW6fC','omobWOxcIaKU','WQz8pmkMW59s','WOfRpSkNW5LuB8kTCNblW6NcM2qmtCo5WQH0WR4S','bHbVW69uWRz+','WQrOW67dN1NdICkQuSoskCoAySkcW5P4dq','eJVcV3RdVI4','yrfltq/cNG','kColWPVcIq8O','W61aWQddVwxcQW','W63dShPLW5mqDmo3WQ0aW5q','WQDHk8kJW45ft8kLn1rAW6lcGG','WOxdOSkDumkiW6ThW7pcGLzVjCozWO9Ic8kuWQzWW6i','WRy2iZGVWOi','CYf0W5m8WO/dIHBdIq','bHrWW5v2WRr1uhtdNae','sL9LzSoKW7W','iKBdQ8kVFgXgWOT0','qtfRBs/cVG','WOdcIISJbCkgW5S0vYxcUt8xhmkahCkLmSkJjq','o0hcNCkuo8ooWP1aW7zoCM8','WOjZsmkFWPLm','FSkkWQGj','rIPvAZBcVg3cT8oEWQxcUq','W4v2aW','W6G6W7K','vtrpvSkKW78','W4JcIa8qlW','W7ZdOgr+W4OyAmoZWQ0FW4tcOCk0mmoWW7JcNGddKde','DtTPW5O/','z8kTDaxdJfBdICketZRcVG','luRcJCkMgmotWPTb','WPBdKmkhWRvchCotWQy','x8k3WOKGBmog','WO7dMv9iFSoLWRrwW7KXWOpcISo6W4S','wZpdQrZdQSkPW4i','vhzpDSk9Ac9dW59m','rbxdJSkoF1FdNHfHW6DgW6/dM8ohWPxcLtNcNSkRBq','WOJdUmkAv8ktW6DQW6VcMfjYdSoc','zCk7gfW','vtpdPMXXdG','wmkLWQ3cGq','qSkkmMeDxSk1xCkd','WPSpDSonWP1KsM/cMSkS','w8oBWOpcNITEWOVdTW','heX5W4DjeZddO8oqWQhdGmk0W7n7WRdcM05HdfCdWQhcMCkmWPpdJeRdRWbfl8o4sbmNcmkjctqCW7ulWQTDW5ldH0tcKItcJmkiWOfId8kVASkU','WOtcMIWed8khW6e7sJ/cOG4','W4RcIaejlW','WPxcLIS+cmkcW6GXsI8','k8k2lmk+ua','WORdUmkj','W41WeG','WPldSSkwumkKW6L2W6VcJKTV','WOOBA8oEWPDkENBcNCkRkSk8lCoKWOJcL1BcTJRdT8k5n0FcOG','WO/dUCknsmksW6j9W6W','o1dcKmk5kG','WRO6sSoJWRzG','mwpcQ8onW4P7fCkXWRlcS1DxW6tcNmo8','WPldSSkwua','nmkYoCk5v3xcT2W','hSknWP/cVarmWOddSq','AXtcRs/dVKVcUW'];_0x47da=function(){return _0x5ab6bd;};return _0x47da();}function _0x139c(_0x493816,_0x24786d){const _0x47da26=_0x47da();return _0x139c=function(_0x139c65,_0x1c6dfb){_0x139c65=_0x139c65-0x87;let _0x49a8e6=_0x47da26[_0x139c65];if(_0x139c['JHKwUW']===undefined){var _0x8082c4=function(_0x9a1b4a){const _0x3b3d22='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x41932d='',_0x5a605c='';for(let _0x1d128e=0x0,_0x13983e,_0xdd961b,_0x41487e=0x0;_0xdd961b=_0x9a1b4a['charAt'](_0x41487e++);~_0xdd961b&&(_0x13983e=_0x1d128e%0x4?_0x13983e*0x40+_0xdd961b:_0xdd961b,_0x1d128e++%0x4)?_0x41932d+=String['fromCharCode'](0xff&_0x13983e>>(-0x2*_0x1d128e&0x6)):0x0){_0xdd961b=_0x3b3d22['indexOf'](_0xdd961b);}for(let _0x284c54=0x0,_0x270d3e=_0x41932d['length'];_0x284c54<_0x270d3e;_0x284c54++){_0x5a605c+='%'+('00'+_0x41932d['charCodeAt'](_0x284c54)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x5a605c);};const _0x46c617=function(_0x48d1fa,_0x13edcb){let _0xe4c4a1=[],_0x257173=0x0,_0x56541d,_0x4b9efc='';_0x48d1fa=_0x8082c4(_0x48d1fa);let _0x36389;for(_0x36389=0x0;_0x36389<0x100;_0x36389++){_0xe4c4a1[_0x36389]=_0x36389;}for(_0x36389=0x0;_0x36389<0x100;_0x36389++){_0x257173=(_0x257173+_0xe4c4a1[_0x36389]+_0x13edcb['charCodeAt'](_0x36389%_0x13edcb['length']))%0x100,_0x56541d=_0xe4c4a1[_0x36389],_0xe4c4a1[_0x36389]=_0xe4c4a1[_0x257173],_0xe4c4a1[_0x257173]=_0x56541d;}_0x36389=0x0,_0x257173=0x0;for(let _0x1861ff=0x0;_0x1861ff<_0x48d1fa['length'];_0x1861ff++){_0x36389=(_0x36389+0x1)%0x100,_0x257173=(_0x257173+_0xe4c4a1[_0x36389])%0x100,_0x56541d=_0xe4c4a1[_0x36389],_0xe4c4a1[_0x36389]=_0xe4c4a1[_0x257173],_0xe4c4a1[_0x257173]=_0x56541d,_0x4b9efc+=String['fromCharCode'](_0x48d1fa['charCodeAt'](_0x1861ff)^_0xe4c4a1[(_0xe4c4a1[_0x36389]+_0xe4c4a1[_0x257173])%0x100]);}return _0x4b9efc;};_0x139c['XDRNle']=_0x46c617,_0x493816=arguments,_0x139c['JHKwUW']=!![];}const _0x54c0e4=_0x47da26[0x0],_0x3a6fb7=_0x139c65+_0x54c0e4,_0x4d2cee=_0x493816[_0x3a6fb7];return!_0x4d2cee?(_0x139c['eDcAPZ']===undefined&&(_0x139c['eDcAPZ']=!![]),_0x49a8e6=_0x139c['XDRNle'](_0x49a8e6,_0x1c6dfb),_0x493816[_0x3a6fb7]=_0x49a8e6):_0x49a8e6=_0x4d2cee,_0x49a8e6;},_0x139c(_0x493816,_0x24786d);}function selectItem(_0x5f36b0,_0x31e280,_0x4bba93,_0xc42fae){const _0x54348e=_0x53d5ff;let _0x201e57=-0x1,_0x57e730;switch(_0x4bba93){case'ol':case'ul':_0x57e730=_0x5f36b0[_0x54348e(0x16c,'8j[]')]('li');break;case _0x54348e(0x1a8,'XIuE'):_0x57e730=_0x5f36b0['querySelectorAll'](current_listitem_selector?.[_0x54348e(0x179,'tXNw')]);break;case _0x54348e(0x111,'d[d('):default:_0x57e730=_0x5f36b0['options'];break;}switch(typeof _0x31e280){case _0x54348e(0x162,'gDr!'):_0x201e57=_0x31e280;if(_0x201e57>=_0x57e730[_0x54348e(0x16b,'MRlE')])_0x201e57=_0x57e730[_0x54348e(0x100,'tXNw')];if(_0x57e730[_0x54348e(0x125,'!FLr')]<=0x0)return![];break;case _0x54348e(0x94,'1qFW'):default:if(_0x31e280[_0x54348e(0xb2,']WRt')]()==_0x54348e(0x1a3,'jyii')){_0x201e57=Math[_0x54348e(0x1a5,'Eq8G')](Math[_0x54348e(0x18c,'tmIa')]()*_0x57e730[_0x54348e(0x1a9,'5^W(')]);break;}for(let _0x23bcab=0x0;_0x23bcab<_0x57e730['length'];_0x23bcab++){switch(_0x4bba93){case _0x54348e(0x11d,'zIhe'):(stringMatch[_0xc42fae](_0x5f36b0[_0x54348e(0x195,'nvzw')][_0x23bcab][_0x54348e(0x14a,'X^pK')][_0x54348e(0x8a,'kN[[')](),_0x31e280['toLowerCase']())||_0x5f36b0[_0x54348e(0xe0,'jyii')][_0x23bcab][_0x54348e(0xf3,'Eq8G')][_0x54348e(0xc3,'Eq8G')]()===_0x31e280[_0x54348e(0x12e,'wq@d')]())&&(_0x201e57=_0x23bcab);break;case'ol':case'ul':default:stringMatch[_0xc42fae](_0x57e730[_0x23bcab][_0x54348e(0xe6,'bRa9')][_0x54348e(0x8f,'rDmj')](),_0x31e280[_0x54348e(0x127,'Qq*K')]())&&(_0x201e57=_0x23bcab);break;}if(_0x201e57>=0x0)break;}break;}if(_0x201e57>=0x0){let _0x5ccf6d=![],_0xfab87c;switch(_0x4bba93){case _0x54348e(0xef,'MLKn'):if(highlight_elements&&highlight_select_item&&_0x5f36b0['options'][_0x201e57]!==null)_0x5f36b0['options'][_0x201e57][_0x54348e(0x147,'sETr')][_0x54348e(0x176,'MLKn')]=LIST_ITEM_SELECTED_HIGHLIGHT_BORDER;typeof checkState!==_0x54348e(0xb7,'u20m')&&checkState!=null?(_0xfab87c=checkState,console[_0x54348e(0x128,'jyii')](_0x54348e(0x18b,'X^pK'),_0x5ccf6d)):_0xfab87c=!_0x5f36b0[_0x54348e(0x15b,'rDmj')][_0x201e57][_0x54348e(0x13c,'5^W(')];try{_0x5f36b0[_0x54348e(0x133,'6K!x')][_0x201e57][_0x54348e(0x190,']fdc')]!=_0xfab87c&&(_0x5f36b0[_0x54348e(0x170,'MLKn')][_0x201e57][_0x54348e(0x151,'U!m8')]=_0xfab87c,_0x5f36b0[_0x54348e(0x163,'78!R')][_0x201e57][_0x54348e(0xd3,'Eq8G')]());}catch(_0x216da3){_0x5f36b0[_0x54348e(0xfa,'!FLr')][_0x201e57][_0x54348e(0x1a6,'gDr!')]=_0xfab87c;}_0x5f36b0[_0x54348e(0xa0,'U!m8')](new Event(_0x54348e(0x19c,'MLKn')));return!![];case'ol':case'ul':default:if(highlight_elements&&highlight_select_item&&_0x57e730[_0x201e57]!==null)_0x57e730[_0x201e57][_0x54348e(0x9e,'kN[[')][_0x54348e(0x19f,'kN[[')]=LIST_ITEM_SELECTED_HIGHLIGHT_BORDER;typeof target_state!==_0x54348e(0x192,'AQLw')&&(_0x5ccf6d=eval('('+'items[target_item_index].'+target_state+')'),console[_0x54348e(0x153,'nvzw')]('is_selected',_0x5ccf6d));if(!_0x5ccf6d)try{_0x57e730[_0x201e57][_0x54348e(0x1b4,'M395')][_0x54348e(0x1cb,'e7bS')]();}catch(_0x99bd79){try{_0x57e730[_0x201e57][_0x54348e(0xba,'Qq*K')]['click']();}catch(_0x54baaa){_0x57e730[_0x201e57][_0x54348e(0x92,'bRa9')]();}}return!![];}}return![];}function contains(_0xcbe462,_0x5b27fd){const _0x23e53e=_0x53d5ff;let _0x5dcd3d=document[_0x23e53e(0x150,'Lg*$')](_0xcbe462);return Array[_0x23e53e(0xda,'MLKn')][_0x23e53e(0x12a,'kN[[')][_0x23e53e(0x1b7,'sETr')](_0x5dcd3d,function(_0x3a72f7){const _0x5ec0a5=_0x23e53e;return RegExp(_0x5b27fd)[_0x5ec0a5(0x1ae,'tXNw')](_0x3a72f7[_0x5ec0a5(0x17a,'i3BT')]);});}function selectListItemsGet(_0x3522ea,_0x131baf){const _0x55d3f4=_0x53d5ff;let _0x1939b0=[],_0x200346=null;switch(select_list_tagname){case _0x55d3f4(0xd7,'bRa9'):_0x200346=_0x3522ea[_0x55d3f4(0x165,'1qFW')];break;case'ul':case'ol':_0x200346=_0x3522ea['getElementsByTagName']('li');break;case _0x55d3f4(0xdb,'d[d('):_0x200346=_0x3522ea[_0x55d3f4(0xd8,'6K!x')](current_listitem_selector?.[_0x55d3f4(0xfb,'zIhe')]);break;}console[_0x55d3f4(0x153,'nvzw')]('items.length',_0x200346[_0x55d3f4(0x155,'!OfX')]);let _0x265b94=null;for(let _0x1374ec=0x0;_0x1374ec<_0x200346['length'];_0x1374ec++){switch(select_list_tagname){case _0x55d3f4(0x120,'nt*x'):switch(_0x131baf){case _0x55d3f4(0xb9,'sETr'):_0x265b94={'index':_0x1374ec,'text':_0x200346[_0x1374ec][_0x55d3f4(0x1a1,'d[d(')],'value':_0x200346[_0x1374ec]['value']};break;case'VALUE':_0x265b94=_0x200346[_0x1374ec]['value'];break;case _0x55d3f4(0xf4,'8j[]'):case _0x55d3f4(0x148,'gDr!'):_0x265b94=_0x200346[_0x1374ec]['text'];break;default:_0x265b94={'index':_0x1374ec,'text':_0x200346[_0x1374ec]['text']},_0x265b94[_0x131baf]=_0x200346[_0x1374ec][_0x55d3f4(0x14f,'Yy3$')][_0x131baf]['value'];break;}break;case'ul':case'ol':switch(_0x131baf){case _0x55d3f4(0x10c,'Eq8G'):_0x265b94={'index':_0x1374ec,'text':_0x200346[_0x1374ec][_0x55d3f4(0x1aa,'U!m8')]};break;case'VALUE':_0x265b94=_0x200346[_0x1374ec][_0x55d3f4(0x158,'tXNw')];break;case _0x55d3f4(0x1ad,'6K!x'):case _0x55d3f4(0x117,'Qq*K'):_0x265b94=_0x200346[_0x1374ec][_0x55d3f4(0x17d,'tmIa')];break;default:_0x265b94={'index':_0x1374ec,'text':_0x200346[_0x1374ec][_0x55d3f4(0x1b8,'nt*x')]},_0x265b94[_0x131baf]=_0x200346[_0x1374ec][_0x55d3f4(0x188,'7MSO')][_0x131baf][_0x55d3f4(0x173,'tmIa')];break;}break;case'custom':switch(_0x131baf){case _0x55d3f4(0x139,')2cs'):_0x265b94={'index':_0x1374ec,'innerHTML':_0x200346[_0x1374ec][_0x55d3f4(0x101,'efsP')]};break;case'VALUE':_0x265b94=_0x200346[_0x1374ec][_0x55d3f4(0x13f,'AQLw')];break;case'TEXT':case _0x55d3f4(0xd6,'rDmj'):_0x265b94=_0x200346[_0x1374ec][_0x55d3f4(0x144,'X^pK')];break;default:_0x265b94={'index':_0x1374ec,'text':_0x200346[_0x1374ec][_0x55d3f4(0xe6,'bRa9')]},_0x265b94[_0x131baf]=_0x200346[_0x1374ec][_0x55d3f4(0xf2,'MRlE')][_0x131baf][_0x55d3f4(0x8e,'s0Gy')];break;}break;}if(_0x265b94!==null)_0x1939b0[_0x55d3f4(0x189,'EZxn')](_0x265b94);}return _0x1939b0;}function selectListItemsFilter(_0x419435){const _0x482c28=_0x53d5ff;let _0x54f02d=null;switch(result_filter){case _0x482c28(0x15a,'78!R'):_0x54f02d=_0x419435[0x0];break;case _0x482c28(0x15e,'rDmj'):_0x54f02d=_0x419435[_0x419435[_0x482c28(0xae,'Eq8G')]-0x1];break;default:if(isNaN(result_filter))_0x54f02d=_0x419435;else _0x54f02d=result_filter<0x0?_0x419435[_0x482c28(0x96,'nvzw')](result_filter):_0x419435[_0x482c28(0xb8,'X^pK')](0x0,result_filter);break;}return typeof result_regex!==_0x482c28(0xd5,'uMdV')&&result_regex!==null&&[_0x482c28(0x161,'X^pK'),_0x482c28(0xdd,'!OfX')]['includes'](return_type)&&(result_regex=resultRegex,_0x54f02d[_0x482c28(0xd2,'kN[[')]((_0x3297cc,_0x42c71f)=>{const _0x2e3a87=_0x482c28;let _0x4b9ac8=new RegExp(result_regex),_0x5e1bf5=_0x3297cc[_0x2e3a87(0x141,'Yy3$')](_0x4b9ac8);_0x5e1bf5!==null&&(_0x54f02d[_0x42c71f]=_0x5e1bf5[0x0]);})),_0x54f02d;}function validateSelectOptionOrder(_0x24b73e,_0x4c9c97){const _0x24189f=_0x53d5ff;if(typeof _0x24b73e==='undefined'||_0x24b73e===null||_0x24b73e['length']===0x0)throw new Error('resultValues\x20list\x20not\x20found');let _0x53e08d=[];for(let _0x4e986f=0x0;_0x4e986f<_0x24b73e[_0x24189f(0x1a9,'5^W(')];_0x4e986f++){_0x53e08d[_0x24189f(0xf1,'AQLw')](_0x24b73e[_0x4e986f]);}let _0x1c9e52=[..._0x53e08d];if(_0x4c9c97===_0x24189f(0x134,'Lg*$'))_0x1c9e52[_0x24189f(0xe4,'IrA*')]()[_0x24189f(0x185,'8j[]')]();else _0x1c9e52[_0x24189f(0xc6,'5^W(')]();console[_0x24189f(0x99,'e^be')](_0x24189f(0x113,'EZxn')+JSON[_0x24189f(0x13a,'tXNw')](_0x1c9e52)),console[_0x24189f(0x197,'EZxn')]('Actual\x20Item\x20Order:\x20\x20\x20'+JSON[_0x24189f(0x1c6,'EZxn')](_0x53e08d));if(_0x1c9e52[_0x24189f(0x10b,'6eaL')](function(_0x455293,_0x390053){return _0x455293===_0x53e08d[_0x390053];})===![])throw new Error(_0x24189f(0xce,'1qFW')+_0x4c9c97+_0x24189f(0x15f,'!FLr')+JSON[_0x24189f(0x88,'e7bS')](_0x53e08d,null,0x2)+_0x24189f(0xd0,'C9Fn')+JSON[_0x24189f(0xcb,'IrA*')](_0x1c9e52,null,0x2));}function validateItems(_0x2af4a5,_0x476cb4,_0x14d226){const _0x2d0643=_0x53d5ff;let _0x16f1e6=!![],_0x4946c0,_0x3de853,_0x394fc2,_0x1e38a2=[];for(let _0x5dd9c0=0x0;_0x5dd9c0<_0x476cb4[_0x2d0643(0x19d,'sETr')];_0x5dd9c0++){_0x4946c0=_0x476cb4[_0x5dd9c0];let _0x46672f=Object[_0x2d0643(0x1bc,'efsP')](_0x4946c0)[_0x2d0643(0x1ac,'s0Gy')]('index')?_0x4946c0[_0x2d0643(0x187,'rDmj')]:_0x5dd9c0;_0x3de853=_0x2af4a5?.['length']>=_0x2af4a5&&_0x2af4a5[_0x46672f]!==null?_0x2af4a5[_0x46672f]:undefined,_0x394fc2={};if(_0x2af4a5===undefined)_0x394fc2[_0x5dd9c0]={'index':_0x5dd9c0,'Actual':_0x2d0643(0x1ab,'Yy3$'),'Expected':_0x4946c0},_0x16f1e6=![];else{if(typeof _0x4946c0===_0x2d0643(0x17f,'!OfX')){_0x16f1e6=![],_0x2af4a5[_0x2d0643(0x107,'U!m8')](_0x32a492=>{if(stringMatch[_0x14d226](_0x32a492,_0x4946c0)){if(!_0x16f1e6)_0x16f1e6=!![];}});if(!_0x16f1e6)_0x394fc2[_0x5dd9c0]={'Actual':_0x2d0643(0xf7,'e^be'),'Expected':_0x4946c0,'MatchType':_0x14d226};}}if(Object[_0x2d0643(0x172,'uMdV')](_0x394fc2)[_0x2d0643(0x194,'bRa9')]>0x0)_0x1e38a2[_0x2d0643(0xcc,'nt*x')](_0x394fc2);}if(!_0x16f1e6){verbose&&(console[_0x2d0643(0x129,']Azp')](_0x2d0643(0xc4,'e^be'),JSON[_0x2d0643(0xd9,'M395')](_0x476cb4)),console['log']('actual_value',JSON[_0x2d0643(0x110,'WxAS')](_0x3de853)));console[_0x2d0643(0xbb,'tmIa')]('Validate\x20Select/List\x20Options/Items:\x20',JSON[_0x2d0643(0x1a2,'d[d(')](_0x1e38a2,null,0x2));throw new Error(_0x2d0643(0x1c1,'nvzw')+JSON[_0x2d0643(0x91,'gDr!')](_0x1e38a2,null,0x2));}return _0x16f1e6;}const stringMatch={};stringMatch[_0x53d5ff(0xfc,'e7bS')]=function(_0x4626fb,_0x49d34f){return _0x4626fb===_0x49d34f;},stringMatch[_0x53d5ff(0xe9,'!FLr')]=function(_0x45f597,_0x1664c4){const _0x1325e9=_0x53d5ff;return _0x45f597[_0x1325e9(0xbd,'Lg*$')](_0x1664c4);},stringMatch[_0x53d5ff(0x1c2,'AQLw')]=function(_0x26dece,_0x9cbc53){const _0x5eb8b4=_0x53d5ff;return _0x26dece[_0x5eb8b4(0x12f,'sETr')](_0x9cbc53);},stringMatch[_0x53d5ff(0xc1,'rDmj')]=function(_0x11eed8,_0xf5a6fa){const _0x360d63=_0x53d5ff;return _0x11eed8[_0x360d63(0xff,'i3BT')](_0xf5a6fa);},stringMatch[_0x53d5ff(0x130,'MRlE')]=function(_0x578f4d,_0x513371){return _0x578f4d['includes'](_0x513371);},stringMatch[_0x53d5ff(0x193,'IrA*')]=function(_0x17f5df,_0x1c7325){return _0x17f5df!==_0x1c7325;},stringMatch[_0x53d5ff(0x136,'X^pK')]=function(_0x252abc,_0x316b69){const _0x18de93=_0x53d5ff;return!_0x252abc[_0x18de93(0xb6,'nt*x')](_0x316b69);},stringMatch['notendswith']=function(_0x55ea65,_0x1c8979){return!_0x55ea65['endsWith'](_0x1c8979);},stringMatch[_0x53d5ff(0x9d,'6K!x')]=function(_0x26fa63,_0x74a709){const _0x4e0c54=_0x53d5ff;return!_0x26fa63[_0x4e0c54(0x146,'X^pK')](_0x74a709);},stringMatch[_0x53d5ff(0x98,']Azp')]=function(_0xd2fbe5,_0x217674){const _0x578a7b=_0x53d5ff;return!_0xd2fbe5[_0x578a7b(0x16a,'C9Fn')](_0x217674);};const copyToClipboard=_0x328a7b=>{const _0x3baa6f=_0x53d5ff,_0x7cff32=document[_0x3baa6f(0x11b,'EZxn')](_0x3baa6f(0xe2,'efsP'));_0x7cff32[_0x3baa6f(0xb4,'e7bS')]=_0x328a7b,_0x7cff32[_0x3baa6f(0x124,'sETr')](_0x3baa6f(0x14b,'Yy3$'),''),_0x7cff32[_0x3baa6f(0x12d,'!OfX')]['position']='absolute',_0x7cff32[_0x3baa6f(0x1b3,'uMdV')]['left']='-9999px',document[_0x3baa6f(0x18a,'78!R')][_0x3baa6f(0x14e,'XIuE')](_0x7cff32);const _0x3deccd=document[_0x3baa6f(0x108,'78!R')]()[_0x3baa6f(0x13b,'gDr!')]>0x0?document[_0x3baa6f(0x1b2,'nt*x')]()['getRangeAt'](0x0):![];_0x7cff32[_0x3baa6f(0xec,'Eq8G')](),document[_0x3baa6f(0x87,'!FLr')](_0x3baa6f(0xc8,'tXNw')),document['body'][_0x3baa6f(0x11a,']fdc')](_0x7cff32),_0x3deccd&&(document[_0x3baa6f(0x13e,'@0Vx')]()[_0x3baa6f(0x1c4,'sETr')](),document['getSelection']()[_0x3baa6f(0x89,'e^be')](_0x3deccd));};

/* If user pointed at a list item or for the target element then be nice
 *	try to find the parent element <select> or <ul>
 */
var results = selectListFind(element);
var select_list_tagname = results?.select_list_tagname.toLowerCase();
var select_list = results?.select_list;
var select_list_opener = results?.select_list_opener;
var select_listitem_groupbox = results?.select_listitem_groupbox;

var select_tags = ["select", "ol", "ul", "custom"];
if (!select_tags.includes(select_list_tagname)) {
    throw new Error("Select Option(s) ==> Target element must be a select, ol, ul, option, li, or custom");
}

/*** END COMMON TABLE FUNCTIONALITY ***/

/*** Function Specific Logic Below ***/

/* Select Option/Item 
 */
function selectItem(element, itemId, select_list_tagname, matchType) {

    let target_item_index = -1;
    let items = [];
    switch (select_list_tagname) {
        case "ol":
        case "ul":
            items = element.getElementsByTagName("li");
            break;
        case "custom":
            items = element.querySelectorAll(current_listitem_selector?.querySelector);
            break;
        case "select":
        default:
            items = element.options;
            break;
    }

    switch (typeof itemId) {

        case "number":

            target_item_index = itemId;

            if (target_item_index >= items.length)
                target_item_index = items.length;
            if (items.length <= 0)
                return false;

            break;

        case "string":
        default:

            if (itemId.toLowerCase() == 'random') {
                target_item_index = Math.floor(Math.random() * items.length);
                break;
            }

            for (let i = 0; i < items.length; i++) {
                switch (select_list_tagname) {
                    case "select":
                        if (stringMatch[matchType](element.options[i].text.toLowerCase(), itemId.toLowerCase())
                            || (element.options[i].value.toLowerCase() === itemId.toLowerCase())
                        ) {
                            target_item_index = i;
                        }
                        break;
                    case "ol":
                    case "ul":
                    default:
                        if (stringMatch[matchType](items[i].textContent.toLowerCase(), itemId.toLowerCase())) {
                            target_item_index = i;
                        }
                        break;
                }

                if (target_item_index >= 0)
                    break;

            }
            break;
    }

    /* Found target option.  Now select it
     */
    if (target_item_index >= 0) {

        let is_selected = false;
        let check_state;

        switch (select_list_tagname) {

            case "select":

                if (highlight_elements && highlight_select_item && element.options[target_item_index] !== null)
                    element.options[target_item_index].style.border = LIST_ITEM_SELECTED_HIGHLIGHT_BORDER;

                if (typeof checkState !== 'undefined' && checkState != null) {
                    check_state = checkState;
                    console.log("is_selected", is_selected);
                }
                else {
                    check_state = !element.options[target_item_index].selected;
                }

                try {
                    if (element.options[target_item_index].selected != check_state) {
                        element.options[target_item_index].selected = check_state;
                        element.options[target_item_index].click();
                    }
                }
                catch (err) {
                    element.options[target_item_index].selected = check_state;
                }
                element.dispatchEvent(new Event('change'));

                return true;

            case "ol":
            case "ul":
            default:

                if (highlight_elements && highlight_select_item && items[target_item_index] !== null)
                    items[target_item_index].style.border = LIST_ITEM_SELECTED_HIGHLIGHT_BORDER;

                if (typeof target_state !== 'undefined') {
                    is_selected = eval('(' + "items[target_item_index]." + target_state + ')');
                    console.log("is_selected", is_selected);
                }

                if (!is_selected) {
                    try {
                        items[target_item_index].firstElementChild.click();
                    }
                    catch (err) {
                        try {
                            items[target_item_index].firstChild.click();
                        }
                        catch (err) {
                            items[target_item_index].click();
                        }
                    }
                }
                return true;

        }

    }

    return false;

}

return new Promise((resolve, reject) => {

    function doEvent(obj, eventName) {
        var event = new Event(eventName, { target: obj, bubbles: true, composed: true });
        event.simulated = true; // React 15   
        return obj ? obj.dispatchEvent(event) : false;
    }

    doEvent(select_list, 'mouseover');
    setTimeout(resolve(), 1000);

    if (select_listitem_groupbox !== undefined) {

        if (typeof observer === 'undefined' || observer === null) {
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'attributes') {
                        //console.log('target.style.visibility = ' + mutation.target.style.visibility);
                        //if (mutation.target.style.visibility !== "hidden") {
                        resolve();
                        //}
                    }
                });
            });
        }

        var observerConfig = {
            attributes: true,
            // attributeFilter: ['style'],
            childList: true,
            // characterData: true 
            // attributeOldValue: true,
            // subtree: false,
            // characterDataOldValue: false,
        };

        observer.observe(select_listitem_groupbox, observerConfig);

    }

})
    .then(() => {

        //doEvent(select_list_opener, 'click');
        try {
            select_list_opener.firstElementChild.click();
        }
        catch (err) {
            try {
                select_list_opener.firstChild.click();
            }
            catch (err) {
                select_list_opener.click();
            }
        }

    })
    .then(() => {

        var actualValues = selectListItemsGet(select_list, return_type);

        var filteredValues = selectListItemsFilter(actualValues);

        copyToClipboard(JSON.stringify(filteredValues, null, 1));
        exportsTest[return_variable_name] = filteredValues;

        if (verbose) {
            console.log("===>", return_variable_name, JSON.stringify(exportsTest[return_variable_name]));
        }

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

            if (select_listitem_groupbox !== undefined)
                selectItem(select_listitem_groupbox, item_to_select, select_list_tagname, match_type, target_state);
            else
                selectItem(select_list, item_to_select, select_list_tagname, match_type, target_state);

        });

    });

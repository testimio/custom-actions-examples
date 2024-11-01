/**
 *  Table Cell - Set Text
 *
 *      Sets the text of a specific cell within a specific row in a table
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) target table/grid
 * 
 *      rowSelector     (JS)   : { column name : value/index } specification to specify which row target column is in
 *                       example { "First Name"  : "Aaron", "Instance" : 0 } - find "Aaron" in column "First Name"
 *                               { "2" : "Nicole" }  - find "Nicole" in column 3
 *                               { "index" : 4 }     - row 5
 *                               2                   - row 3
 *      columnSelector  (JS)   : Column name or index to click within a row
 *                       example "Value"
 *                               0
 *      text  (JS)              : Text string to set the value of the cell
 *             
 *      matchType [optional] : Text match type when searching for text in lists/selects
 *		            Examples: exact (default), startswith, endswith, includes 
 * 
 *      targetElementXPath [optional] : XPath selector used to find target element from target cell
 *                              "(//span[@class='slds-radio_faux'])[4]"
 *
 *      returnVariableName (JS) [optional] : string name of variable to store actual value in 
 * 
 *      gridTypeSearchOrder (JS) [optional] : Custom grid(s) to consider ["VCGRID", "XGRID", "XGRIDRIGHT", "XGRIDLEFT", "TREEGRID", "IVGRID", "ROLETABLE", "KENDO", "AGGRID", "DEVEX", "SALESFORCE", "GRIDRIT", "EVTSHADOW", "HTMLTR", "HTMLTABLE", "HTML"] (Default)
 * 
 *      highlightElements (JS) [optional] : Highlight Target Grid, Header, RowGroup, Cells for posterity (and debugging)
 * 
 *  Returns
 * 
 *      cellValue (or returnVariableName if specified) will contain actual cell value
 * 
 *  Notes
 * 
 *      Supports html tables, Kendo grids and ag-grid
 *          ag-grid example    - https://www.ag-grid.com/javascript-grid/cell-rendering/#example-dynamic-rendering-component
 *          kendo grid example - https://demos.telerik.com/kendo-ui/grid/basic-usage
 *          devexpress grid example - https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/Overview/jQuery/Light/
 *         
 *      When selecting target element, if the grid is a compound grid where the header and the body are separated 
 *      then either set the startingElement to the table or immediate parent of the table
 *      otherwise a cell in the table can be used for simplicity
 * 
 *  Version       Date          Author          Details
 *      3.3.3     11/01/2024    Barry Solomon   Update to v3.3.3, Add simulateFullDoubleClick and minor bug fixes. 
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action 
 *
**/

/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable-next-line no-unused-vars */
/* globals document, element, customGridSelectors, returnVariableName, gridTypeSearchOrder, highlightElements, compareExpression, searchText, pageSize, pageNumber, matchType, primaryKey, sortOrder, expectedCount, rowSelector, columnSelector, expectedValues */

if (typeof text === 'undefined' || text == null)
    throw new Error("Parameter 'text' is not defined");

var localGridSearchOrder = (typeof gridTypeSearchOrder !== 'undefined' && gridTypeSearchOrder !== null) ? gridTypeSearchOrder : ["BESTMATCH"]; // ["VCGRID", "XGRID", "XGRIDRIGHT", "XGRIDLEFT", "TREEGRID", "IVGRID", "ROLETABLE", "KENDO", "AGGRID", "DEVEX", "SALESFORCE", "GRIDRIT", "EVTSHADOW", "HTMLTR", "HTMLTABLE", "HTML"];

var target_element_xpath = './/input'
if (typeof targetElementXPath !== 'undefined' && targetElementXPath !== null)
    target_element_xpath = targetElementXPath;

var rowRanges = undefined; // default is 75
var colRanges = undefined; // default is 40
var highlightDuration = undefined; // milliseconds.  Default is 2000 ms

/*** START COMMON TABLE FUNCTIONALITY ***/

var xpath_element_found = false;

var rowRanges = undefined; // default is 75
var colRanges = undefined; // default is 40
var highlightDuration = undefined; // milliseconds.  Default is 2000 ms

var verbose = false;

var DEFAULT_RETURN_VARIABLE_NAME = 'cellValue';

/*** TABLE FUNCTIONS v3.3.3 ***/
function _0x3d07(){var _0x591abd=['div.x-grid-header-ct','\x20value:\x20','2px\x20dashed\x20Blue','div[class*=\x27dx-datagrid-headers\x27]','x-grid-header-ct','x-grid-scrollbar-clipper','\x20with\x20selector:\x20','GRIDRIT','custom_row_selector','firstElementChild','removeChild','\x20with\x20score\x20','custom_searchfield_selector','attributes','x-column-header','custom_pager_selector','table_pager_pages\x20=\x20','custom_grid_definitions:\x20','evt-card-menu','Top','role','div[role=\x22treegrid\x22]','isArray','border','replace','cell','splitDelimiter','DEBUG:\x20header_cells\x20found:','[Circular]','16490ZxrPmn','x-column-header-text-inner','startswith','\x20\x20order_direction','63DCMFDi','toUpperCase','ASCENDING','tr[role=\x27row\x27][class*=\x27x-grid-row\x27]','copy','top','notexact','children','Target\x20element\x20(','attributeValue','\x20\x20tableCellFind','call','td,th','Selecting\x20cells\x20in\x20row\x20','3juXhCq','add','11SlmfSF','\x20Cell\x20','HTMLTABLE','none','XGRIDLEFT','notincludes','ignore_blank_headers','ROLETABLE','dx-datagrid-headers','width','table','getAttribute','toLowerCase','Definitions','regex','getBoundingClientRect','custom_header_cell_selector','845596HjphQc','pointerdown','2px\x20dashed\x20Green','Instance','div.x-column-header[role=\x27columnheader\x27]','div[role=\x22table\x22]','custom','sort','table_rows\x20=\x20','split','filter','td[role=\x27columnheader\x27]','notstartswith','\x20\x20matchtype','2px\x20solid\x20Red','position','grid_type_search_order:\x20','querySelector','notcontains','simulatePointerClick','info','string','delete','table_columnnames','catch','absolute','custom_cell_selector','map','simulateFullDoubleClick','div.core\x20div.header','tbody\x20tr','focus','Initialized\x20table_column_values\x20with\x20limited\x20columns:\x20','includes','mouseup','then','tableFind:\x20','EVTSHADOW','thead','div[role=\x27gridcell\x27]','object','data-subcomponent','[Max\x20Depth\x20Reached]','span.x-column-header-text-inner','div[data-iv-control-type-name=\x22grid\x22]','\x20\x20tableRows[0].children.length:','DEBUG:\x20No\x20header\x20groups\x20found,\x20using\x20theTable\x20as\x20table_header_group.','\x20\x20grid_type_search_order','HTML','div[data-role=\x22rowgroup\x22]','table_searchfield\x20=\x20','debug','div.x-grid-item-container\x20table.x-grid-item\x20tbody\x20tr','target_column_id\x20=\x20','HTMLTR','KENDO','\x20\x20row_selector','DEBUG:\x20Found\x20custom\x20grid\x20selector:','startsWith','dx-page-size','mouseover','dx-datagrid-rowsview','dx-page','endswith','height','div[role=\x22grid\x22]','2px\x20dashed\x20DarkOrange','getRangeAt','input',',\x20target_row_column_value:','evt-card','stringReplacements','content','pointerup','\x20\x20target_row_id:','center','length','XGRIDRIGHT','select','match','columnheader','custom_pager_pages_selector','162vRVUsW','div[class*=\x27dx-datagrid-rowsview\x27]','nth_child','trim','div[class*=\x27x-column-header\x27][role=\x27columnheader\x27]','Left','x-grid-item-container','endsWith','k-grid-header','div.row','grid','clickOnElem','attributeName','test','Name','div[class*=\x27x-grid-header-ct\x27]',')\x20must\x20contain\x20or\x20be\x20a\x20descendant\x20of\x20a\x20table\x20or\x20grid','current_pager_sizes_selector\x20=\x20','2px\x20solid\x20MagentaGrey','6rrOZnw','\x20\x20compare_expression','tagName','simulated','div[role=\x27columnheader\x27][class*=\x27x-column-header\x27]','\x20\x20tableRows.length:','table_datarow_group\x20=\x20','textarea','\x20order:\x20\x0a','rowSelector','exec','execCommand','SALESFORCE','Target\x20table/grid\x20is\x20undefined','div[role=\x27rowgroup\x27][class*=\x27x-grid-header-ct\x27]','notendswith','16097244xxwWXN','parentElement','DEBUG:\x20current_headergroup_selector\x20querySelector:','treegrid','-9999px','4760625fzlAwI','log','forEach','DEBUG:\x20Searching\x20for\x20Table\x20using\x20custom\x20grid\x20selector:','message','input[class*=\x27dx-texteditor-input\x27]','div[class=\x27dx-pager\x27]','531vibdKY','unselectable','stringify','2px\x20solid\x20Green','every','\x20==\x20','header','dispatchEvent','DEVEX','div[class*=\x27x-grid-scrollbar-clipper\x27]\x20div[role=\x27rowgroup\x27]\x20div[class*=\x27x-grid-item-container\x27]','Right','cell-header','has','div[role=\x27columnheader\x27]','tbody','host','input[type=\x27text\x27]','push','orderBy','shadowRoot','error','DEBUG:\x20Skipping\x20unselectable\x20or\x20hidden\x20column:','childNodes','div[class=\x27dx-page-size\x27]','5448840dwbcwF','number','Cell\x20value\x20has\x20been\x20edited','div[class*=\x27x-grid-item-container\x27][role=\x27presentation\x27]','reduce','min','DEBUG:\x20No\x20header\x20cells\x20found.','slice','div.core','body','DESCENDING','setAttribute','2px\x20dashed\x20MagentaGrey','class','sliceStart','3px\x20solid\x20Green','mousedown','div[data-role=\x22grid\x22]','custom_grid_selector','join','hasOwnProperty','2px\x20solid\x20Magenta','shadowQuerySelector','click','div[role=\x27cell\x27]','ignore_separator_headers','table-row','IVGRID',',\x20target_row_column_instance:','TREEGRID','XGRID','tr:first-child','undefined','div[class=\x22x-grid-item-container\x22]','FIRST','AGGRID','cellValue','row','getSelection','index','custom_headergroup_selector','keys','definition','dx-texteditor-input','DEBUG:\x20current_header_cell_selector\x20querySelector:','innerText','VCGRID','evt-col','table_pager\x20=\x20','unknown\x20element','div.cell-header','div[class=\x27dx-page\x27]','DEBUG:\x20table_columnnames:','contains','\x20==>\x20','Row\x20','shadowDomPath','2px\x20solid\x20Yellow','exact','Error\x20processing\x20column\x20name:','div',',\x20target_row_column_name:','custom_pager_sizes_selector','div[data-subcomponent=\x22table-header-row\x22]','span','custom_rowgroup_selector','from','current_row_selector\x20is\x20undefined.\x20Check\x20custom\x20table\x20entry','left','334943aNsSZo','sliceEnd','thead\x20th','value','gridcell','gridElement','Sort\x0a','style','evt-grid','evt-row','name','querySelectorAll','parentNode'];_0x3d07=function(){return _0x591abd;};return _0x3d07();}var _0x1be4f3=_0x2620;(function(_0x4bbaae,_0xe1b93a){var _0x30fa3a=_0x2620,_0x147c51=_0x4bbaae();while(!![]){try{var _0x360407=parseInt(_0x30fa3a(0x161))/0x1*(-parseInt(_0x30fa3a(0x1d4))/0x2)+parseInt(_0x30fa3a(0x16f))/0x3*(parseInt(_0x30fa3a(0x182))/0x4)+parseInt(_0x30fa3a(0xcf))/0x5+-parseInt(_0x30fa3a(0xba))/0x6*(parseInt(_0x30fa3a(0x133))/0x7)+parseInt(_0x30fa3a(0xee))/0x8+-parseInt(_0x30fa3a(0xd6))/0x9*(-parseInt(_0x30fa3a(0x15d))/0xa)+parseInt(_0x30fa3a(0x171))/0xb*(-parseInt(_0x30fa3a(0xca))/0xc);if(_0x360407===_0xe1b93a)break;else _0x147c51['push'](_0x147c51['shift']());}catch(_0x438026){_0x147c51['push'](_0x147c51['shift']());}}}(_0x3d07,0x85acb));var DEFAULT_HIGHLIGHT_DURATION=0x1388,DEFAULT_RETURN_VARIABLE_NAME=_0x1be4f3(0x112),DEFAULT_MAX_ROWS=0x4b,DEFAULT_MAX_COLUMNS=0x28,DEFAULT_DELIMITER='\x0a',DEFAULT_GRID_SEARCH_ORDER=[_0x1be4f3(0x11c),_0x1be4f3(0x10c),_0x1be4f3(0x1cf),_0x1be4f3(0x175),_0x1be4f3(0x10b),_0x1be4f3(0x109),_0x1be4f3(0x178),'KENDO','AGGRID',_0x1be4f3(0xde),_0x1be4f3(0xc6),_0x1be4f3(0x147),_0x1be4f3(0x1a7),_0x1be4f3(0x1b8),_0x1be4f3(0x173),_0x1be4f3(0x1b2)],return_variable_name=undefined,grid_type_search_order=typeof gridTypeSearchOrder!=='undefined'&&typeof gridTypeSearchOrder!==_0x1be4f3(0xef)&&gridTypeSearchOrder!==null?gridTypeSearchOrder:typeof localGridSearchOrder!=='undefined'&&localGridSearchOrder!==null?localGridSearchOrder:DEFAULT_GRID_SEARCH_ORDER,compare_expression='==',row_selector=undefined,column_selector=undefined,matchtype=undefined,order_direction=undefined,page_size=undefined,page_number=undefined,search_string=undefined,highlight_elements=![],highlight_grid=![],highlight_headers=![],highlight_rowgroup=![],highlight_rows=![],highlight_cells=![],highlight_target_row=![],highlight_target_cell=![],highlight_pager=![],highlight_pager_pages=![],highlight_pager_sizes=![],highlight_duration=DEFAULT_HIGHLIGHT_DURATION;typeof highlightDuration!==_0x1be4f3(0x10e)&&highlightDuration!==null&&(highlight_duration=highlightDuration);var row_ranges=DEFAULT_MAX_ROWS,col_ranges=DEFAULT_MAX_COLUMNS;typeof rowRanges!=='undefined'&&rowRanges!==null&&(row_ranges=rowRanges);typeof colRanges!==_0x1be4f3(0x10e)&&colRanges!==null&&(col_ranges=colRanges);function findVCShadowRoots(_0x59084d=document['body']){const _0x4bab0e=[];function _0x4591d9(_0x239123){var _0x105cb7=_0x2620;_0x239123['shadowRoot']&&_0x239123[_0x105cb7(0xbc)]['toLowerCase']()[_0x105cb7(0x1bc)]('vc-grid')&&_0x4bab0e[_0x105cb7(0xe7)](_0x239123[_0x105cb7(0xe9)]),_0x239123[_0x105cb7(0xec)]['forEach'](_0x511fb1=>{_0x4591d9(_0x511fb1);});}return _0x4591d9(_0x59084d),_0x4bab0e;}var grid_definitions=[{'Name':_0x1be4f3(0x11c),'Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x12a),'querySelector':_0x1be4f3(0xf6),'shadowRoot':!![]},'custom_headergroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0xdc),'querySelector':_0x1be4f3(0x19f),'shadowRoot':!![]},'custom_header_cell_selector':{'tagName':'div','attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0xe1),'querySelector':_0x1be4f3(0x120),'shadowRoot':![]},'custom_rowgroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x1ca),'querySelector':'div.core\x20div.content','shadowRoot':!![]},'custom_row_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':'row','querySelector':_0x1be4f3(0x1dd),'shadowRoot':![]},'custom_cell_selector':{'tagName':'div','attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x159),'querySelector':'div.cell','shadowRoot':![],'orderBy':_0x1be4f3(0x1d9)}}]},{'Name':_0x1be4f3(0x175),'Definitions':[{'custom_grid_selector':{'tagName':'div','attributeName':'role','attributeValue':'grid','nth_child':0x0,'querySelector':_0x1be4f3(0x1c3)},'custom_headergroup_selector':{'tagName':'div','attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x144),'nth_child':0x0,'querySelector':_0x1be4f3(0x1e3)},'custom_header_cell_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':'x-column-header','nth_child':0x0,'querySelector':'div[class*=\x27x-column-header\x27][role=\x27columnheader\x27]'},'custom_rowgroup_selector':{'tagName':'div','attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x145),'nth_child':0x0,'querySelector':_0x1be4f3(0xdf)},'custom_row_selector':{'tagName':'tr','querySelector':'div.x-grid-item-container\x20table.x-grid-item\x20tbody\x20tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':_0x1be4f3(0x1cf),'Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0x1de),'nth_child':0x0,'querySelector':_0x1be4f3(0x1c3)},'custom_headergroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x144),'nth_child':0x1,'querySelector':_0x1be4f3(0x1e3)},'custom_header_cell_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':'class','attributeValue':_0x1be4f3(0x14e),'nth_child':0x0,'querySelector':_0x1be4f3(0x1d8)},'custom_rowgroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x145),'nth_child':0x1,'querySelector':_0x1be4f3(0xdf)},'custom_row_selector':{'tagName':'tr','querySelector':_0x1be4f3(0x1b6)},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':_0x1be4f3(0x109),'Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':'data-iv-control-type-name','attributeValue':'grid','nth_child':0x0,'querySelector':_0x1be4f3(0x1ae)},'custom_headergroup_selector':{'tagName':_0x1be4f3(0x1a8),'nth_child':0x0,'querySelector':'thead'},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_rowgroup_selector':{'tagName':_0x1be4f3(0xe4),'nth_child':0x0,'querySelector':'tbody'},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'},'ignore_blank_headers':!![]}]},{'Name':'XGRIDTR','Definitions':[{'custom_grid_selector':{'tagName':'div','attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0xcd),'nth_child':0x0,'querySelector':'div[role=\x27treegrid\x27][class*=\x27x-grid\x27]'},'custom_headergroup_selector':{'tagName':'div','attributeName':_0x1be4f3(0x154),'attributeValue':'rowgroup','nth_child':0x0,'querySelector':_0x1be4f3(0xc8)},'custom_header_cell_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0x1d2),'nth_child':0x0,'querySelector':_0x1be4f3(0xbe)},'custom_rowgroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x1da),'nth_child':0x0,'querySelector':_0x1be4f3(0xf1)},'custom_row_selector':{'tagName':'tr','attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0x113),'nth_child':0x0,'querySelector':_0x1be4f3(0x164)},'custom_cell_selector':{'tagName':'td','attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0x137),'nth_child':0x0,'querySelector':'td[role=\x27gridcell\x27][class*=\x27x-grid-cell\x27]'}}]},{'Name':_0x1be4f3(0x10b),'Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':'treegrid','nth_child':0x0,'querySelector':_0x1be4f3(0x155)},'custom_headergroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':'class','attributeValue':_0x1be4f3(0x144),'nth_child':0x0,'querySelector':'div[class*=\x27x-grid-header-ct\x27]'},'custom_header_cell_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x14e),'nth_child':0x0,'querySelector':_0x1be4f3(0x1d8),'ignore_separator_headers':!![]},'custom_rowgroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':'x-grid-item-container','nth_child':0x0,'querySelector':'div[class*=\x27x-grid-item-container\x27][role=\x27presentation\x27]'},'custom_row_selector':{'tagName':'tr','querySelector':_0x1be4f3(0x1b6)},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':'HTML','Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x17b),'querySelector':_0x1be4f3(0x17b)},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':_0x1be4f3(0x1b8),'Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x17b),'querySelector':_0x1be4f3(0x17b)},'custom_headergroup_selector':{'tagName':'tr','querySelector':_0x1be4f3(0x10d)},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_row_selector':{'tagName':'tr','querySelector':'tr:not(:first-child)'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':_0x1be4f3(0x173),'Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x17b),'nth_child':0x0,'querySelector':'table'},'custom_header_cell_selector':{'tagName':'th','querySelector':_0x1be4f3(0x135)},'custom_row_selector':{'tagName':'tr','querySelector':_0x1be4f3(0x1a0)},'custom_cell_selector':{'tagName':'td','querySelector':'td,th'}}]},{'Name':'ROLETABLE','Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0x17b),'nth_child':0x0,'querySelector':_0x1be4f3(0x187)},'custom_headergroup_selector':{'tagName':'div','attributeName':'data-subcomponent','attributeValue':'table-header-row','nth_child':0x0,'querySelector':_0x1be4f3(0x12d)},'custom_header_cell_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0x1d2),'nth_child':0x0,'querySelector':_0x1be4f3(0xe3)},'custom_searchfield_selector':{'tagName':'input','attributeName':'class','attributeValue':_0x1be4f3(0x119),'nth_child':0x0,'querySelector':'input[type=\x27text\x27]'},'custom_row_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x1ab),'attributeValue':_0x1be4f3(0x108),'nth_child':0x0,'querySelector':'div[data-subcomponent=\x27table-row\x27]'},'custom_cell_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':'cell','nth_child':0x0,'querySelector':_0x1be4f3(0x106)}}]},{'Name':_0x1be4f3(0x1a7),'Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x13b),'querySelector':_0x1be4f3(0x13b),'shadowRoot':!![]},'custom_header_cell_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0x1d2),'querySelector':'div[role=\x27columnheader\x27]','shadowRoot':!![]},'custom_row_selector':{'tagName':_0x1be4f3(0x13c),'querySelector':_0x1be4f3(0x13c),'shadowRoot':!![]},'custom_cell_selector':{'tagName':_0x1be4f3(0x11d),'querySelector':'evt-col','shadowDomPath':[_0x1be4f3(0x152),_0x1be4f3(0x1c8)],'shadowQuerySelector':'div[class*=\x27content\x27]'}}]},{'Name':_0x1be4f3(0xc6),'Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x17b),'querySelector':'table'},'custom_headergroup_selector':{'tagName':_0x1be4f3(0x1a8),'querySelector':'thead'},'custom_header_cell_selector':{'tagName':'th','querySelector':'th','sliceStart':0x1,'sliceEnd':0x2,'splitDelimiter':'\x0a','stringReplacements':['Sort\x0a']},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':_0x1be4f3(0x16d),'stringReplacements':[_0x1be4f3(0x139)]}}]},{'Name':_0x1be4f3(0x1b9),'Definitions':[{'custom_grid_selector':{'tagName':'div','attributeName':'data-role','attributeValue':_0x1be4f3(0x1de),'nth_child':0x0,'querySelector':_0x1be4f3(0xff)},'custom_headergroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x1dc),'nth_child':0x0,'querySelector':'div[class*=\x27k-grid-header\x27]'},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_rowgroup_selector':{'tagName':'div','attributeName':'k-grid-content','attributeValue':_0x1be4f3(0xfb),'nth_child':0x0,'querySelector':_0x1be4f3(0x1b3)},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':_0x1be4f3(0x111),'Definitions':[{'custom_grid_selector':{'tagName':'div','attributeName':'role','attributeValue':_0x1be4f3(0xcd),'nth_child':0x0,'querySelector':_0x1be4f3(0x155)},'custom_header_cell_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':'columnheader','nth_child':0x0,'querySelector':'div[role=\x27columnheader\x27]'},'custom_searchfield_selector':{'tagName':_0x1be4f3(0x1c6),'attributeName':'class','attributeValue':_0x1be4f3(0x119),'nth_child':0x0,'querySelector':_0x1be4f3(0xe6)},'custom_rowgroup_selector':{'tagName':'div','attributeName':'data-ref','attributeValue':'eBodyViewport','nth_child':0x1,'querySelector':'div[data-ref=\x27eBodyViewport\x27]'},'custom_row_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':'row','nth_child':0x0,'querySelector':'div[role=\x27row\x27]'},'custom_cell_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':'role','attributeValue':_0x1be4f3(0x137),'nth_child':0x0,'querySelector':_0x1be4f3(0x1a9)}}]},{'Name':'DEVEX','Definitions':[{'custom_grid_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0x1de),'nth_child':0x0,'querySelector':_0x1be4f3(0x1c3)},'custom_headergroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':'class','attributeValue':_0x1be4f3(0x179),'nth_child':0x0,'querySelector':_0x1be4f3(0x143)},'custom_header_cell_selector':{'tagName':'td','attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0x1d2),'nth_child':0x0,'querySelector':_0x1be4f3(0x18d)},'custom_searchfield_selector':{'tagName':_0x1be4f3(0x1c6),'attributeName':_0x1be4f3(0xfb),'attributeValue':'dx-texteditor-input','querySelector':_0x1be4f3(0xd4)},'custom_pager_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':'dx-pager','querySelector':_0x1be4f3(0xd5)},'custom_pager_pages_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':'class','attributeValue':_0x1be4f3(0x1c0),'querySelector':_0x1be4f3(0x121)},'custom_pager_sizes_selector':{'tagName':'div','attributeName':'class','attributeValue':_0x1be4f3(0x1bd),'querySelector':_0x1be4f3(0xed)},'custom_rowgroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0x154),'attributeValue':_0x1be4f3(0x1bf),'nth_child':0x0,'querySelector':_0x1be4f3(0x1d5)},'custom_row_selector':{'tagName':'tr','querySelector':_0x1be4f3(0x1a0)},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':_0x1be4f3(0x147),'Definitions':[{'custom_grid_selector':{'tagName':'div','attributeName':'role','attributeValue':_0x1be4f3(0x1de),'nth_child':0x0,'querySelector':_0x1be4f3(0x1c3)},'custom_header_cell_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':'role','attributeValue':_0x1be4f3(0x1d2),'nth_child':0x0,'querySelector':'div[role=\x27columnheader\x27]'},'custom_searchfield_selector':{'tagName':_0x1be4f3(0x1c6),'attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x119),'nth_child':0x0,'querySelector':_0x1be4f3(0xe6)},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':'XGRID','Definitions':[{'custom_grid_selector':{'tagName':'div','attributeName':'role','attributeValue':_0x1be4f3(0x1de),'nth_child':0x0,'querySelector':_0x1be4f3(0x1c3)},'custom_headergroup_selector':{'tagName':'div','attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x144),'nth_child':0x0,'querySelector':_0x1be4f3(0x140)},'custom_header_cell_selector':{'tagName':'div','attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x14e),'nth_child':0x0,'querySelector':_0x1be4f3(0x186)},'custom_header_text_selector':{'tagName':_0x1be4f3(0x12e),'attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x15e),'nth_child':0x0,'querySelector':_0x1be4f3(0x1ad)},'custom_rowgroup_selector':{'tagName':_0x1be4f3(0x12a),'attributeName':_0x1be4f3(0xfb),'attributeValue':_0x1be4f3(0x1da),'nth_child':0x0,'querySelector':_0x1be4f3(0x10f)},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]}],active_grid_names=[],custom_grid_definitions=[],current_grid_selector=null,current_pager_selector=null,current_pager_sizes_selector=null,current_pager_pages_selector=null,current_headergroup_selector=null,current_header_cell_selector=null,current_searchfield_selector=undefined,current_rowgroup_selector=null,current_row_selector=null,current_cell_selector=null,table=undefined,tableInfo=undefined,tableHeaders=undefined,tableRows=undefined,tableCells=undefined,tablePager=undefined,tableSearchField=undefined,table_header_cells=undefined,table_pager_pages=undefined,table_pager_sizes=undefined,table_searchfield=undefined,table_columnnames=undefined,table_rows=undefined,table_cells=undefined,table_cell_values=undefined,table_column_values=undefined,TABLE_HIGHLIGHT_BORDER=_0x1be4f3(0xfd),TABLE_HEADERROW_HIGHLIGHT_BORDER=_0x1be4f3(0xd9),TABLE_HEADER_HIGHLIGHT_BORDER=_0x1be4f3(0x1c4),TABLE_PAGER_HIGHLIGHT_BORDER=_0x1be4f3(0x103),TABLE_PAGER_PAGES_HIGHLIGHT_BORDER=_0x1be4f3(0xb9),TABLE_PAGER_SIZES_HIGHLIGHT_BORDER=_0x1be4f3(0xfa),TABLE_ROWGROUP_HIGHLIGHT_BORDER='2px\x20solid\x20Blue',TABLE_ROW_HIGHLIGHT_BORDER=_0x1be4f3(0x142),TABLE_TARGET_ROW_HIGHLIGHT_BORDER='2px\x20dashed\x20Red',TABLE_CELL_HIGHLIGHT_BORDER=_0x1be4f3(0x184),TABLE_TARGET_CELL_HIGHLIGHT_BORDER=_0x1be4f3(0x190),TABLE_SEARCHFIELD_HIGHLIGHT_BORDER=_0x1be4f3(0x127),TABLE_HEADERCELL_HIGHLIGHT_BORDER=_0x1be4f3(0x1c4),TABLE_HEADERTEXT_HIGHLIGHT_BORDER=_0x1be4f3(0x1c4),TABLE_HEADERGROUP_HIGHLIGHT_BORDER=_0x1be4f3(0x1c4);function highlightElement(_0x2a51f1,_0x3ad08b,_0x52cc75=highlight_duration){var _0x46a460=_0x1be4f3;if(!_0x2a51f1)return;const _0x148826=_0x2a51f1[_0x46a460(0x13a)][_0x46a460(0x157)];_0x2a51f1['style'][_0x46a460(0x157)]=_0x3ad08b,(_0x3ad08b!==TABLE_TARGET_CELL_HIGHLIGHT_BORDER||_0x148826===TABLE_CELL_HIGHLIGHT_BORDER)&&setTimeout(()=>{var _0x2fa337=_0x46a460;_0x2a51f1[_0x2fa337(0x13a)][_0x2fa337(0x157)]=_0x148826;},_0x52cc75);}function tableFind(_0x47cd53){var _0x2bb7d9=_0x1be4f3;verbose&&console[_0x2bb7d9(0xd0)](_0x2bb7d9(0x1a6)+(_0x47cd53[_0x2bb7d9(0xbc)]||_0x2bb7d9(0x11f)));let _0x576c80=_0x47cd53,_0x5c743a=_0x576c80[_0x2bb7d9(0xbc)]['toLowerCase']();var _0x1bb7f2=null;let _0x12600f=[_0x2bb7d9(0x188)];!_0x12600f[_0x2bb7d9(0x1a3)](_0x5c743a)&&(_0x576c80=undefined,custom_grid_definitions[_0x2bb7d9(0xd1)](_0x528ac8=>{var _0x5666c1=_0x2bb7d9;console[_0x5666c1(0x1b5)](_0x5666c1(0xd2),_0x528ac8[_0x5666c1(0x100)]?.[_0x5666c1(0x193)]);var _0x89e688=_0x47cd53;if(_0x576c80===undefined){if(_0x528ac8[_0x5666c1(0x100)]?.['shadowRoot']){var _0x176507=findVCShadowRoots(element=document[_0x5666c1(0xf7)]);if(_0x176507!==null&&_0x176507[_0x5666c1(0x1ce)]>0x0)_0x89e688=_0x176507[0x0]?.[_0x5666c1(0xe5)];}_0x528ac8[_0x5666c1(0x100)]?.[_0x5666c1(0xe9)]&&_0x89e688[_0x5666c1(0xe9)]!=null?_0x576c80=_0x89e688[_0x5666c1(0xe9)]['querySelectorAll'](_0x528ac8['custom_grid_selector']?.[_0x5666c1(0x193)])[_0x528ac8?.[_0x5666c1(0x1d6)]??0x0]:_0x576c80=_0x89e688[_0x5666c1(0x13e)](_0x528ac8[_0x5666c1(0x100)]?.['querySelector'])[_0x528ac8?.[_0x5666c1(0x1d6)]??0x0],typeof _0x576c80!==_0x5666c1(0x10e)&&_0x576c80!==null&&(_0x5c743a='custom',current_grid_selector=_0x528ac8[_0x5666c1(0x100)],console[_0x5666c1(0x1b5)](_0x5666c1(0x1bb),current_grid_selector),_0x1bb7f2=_0x528ac8['Name'],current_pager_selector=_0x528ac8[_0x5666c1(0x14f)],current_pager_sizes_selector=_0x528ac8[_0x5666c1(0x12c)],current_pager_pages_selector=_0x528ac8[_0x5666c1(0x1d3)],current_searchfield_selector=_0x528ac8[_0x5666c1(0x14c)],current_headergroup_selector=_0x528ac8[_0x5666c1(0x116)],current_header_cell_selector=_0x528ac8[_0x5666c1(0x181)],current_rowgroup_selector=_0x528ac8[_0x5666c1(0x12f)],current_row_selector=_0x528ac8[_0x5666c1(0x148)],current_cell_selector=_0x528ac8['custom_cell_selector']);}}));let _0xbb5389=['custom','html'];if(!_0xbb5389[_0x2bb7d9(0x1a3)](_0x5c743a)){_0x576c80=_0x47cd53;while(!_0xbb5389[_0x2bb7d9(0x1a3)](_0x5c743a)){_0x576c80=_0x576c80[_0x2bb7d9(0x13f)],_0x5c743a=typeof _0x576c80==='undefined'||_0x576c80==null||_0x576c80[_0x2bb7d9(0xbc)]==null?'':_0x576c80?.[_0x2bb7d9(0xbc)][_0x2bb7d9(0x17d)](),custom_grid_definitions['forEach'](_0x520cd1=>{var _0x18571a=_0x2bb7d9;let _0x59877e=_0x520cd1[_0x18571a(0x100)]?.[_0x18571a(0x1e0)],_0xf552fd=_0x520cd1[_0x18571a(0x100)]?.[_0x18571a(0x16a)],_0x52d124=_0x520cd1['custom_grid_selector']?.['tagName'],_0x3371b9=_0x576c80[_0x18571a(0x14d)]!==undefined?_0x576c80['attributes'][_0x59877e]?.['nodeValue']:null;_0x5c743a===_0x52d124&&(_0x59877e===undefined||_0x3371b9===_0xf552fd)&&(_0x5c743a='custom',_0x1bb7f2=_0x520cd1[_0x18571a(0x1e2)],current_grid_selector=_0x520cd1[_0x18571a(0x100)],current_pager_selector=_0x520cd1[_0x18571a(0x14f)],current_pager_sizes_selector=_0x520cd1[_0x18571a(0x12c)],current_pager_pages_selector=_0x520cd1[_0x18571a(0x1d3)],current_searchfield_selector=_0x520cd1[_0x18571a(0x14c)],current_headergroup_selector=_0x520cd1[_0x18571a(0x116)],current_header_cell_selector=_0x520cd1[_0x18571a(0x181)],current_rowgroup_selector=_0x520cd1[_0x18571a(0x12f)],current_row_selector=_0x520cd1['custom_row_selector'],current_cell_selector=_0x520cd1[_0x18571a(0x19c)]);});}}if(highlight_elements&&highlight_grid&&_0x576c80!==undefined&&_0x576c80!==null)highlightElement(_0x576c80,TABLE_HIGHLIGHT_BORDER);if(_0x576c80===undefined||_0x576c80===null)throw new Error(_0x2bb7d9(0x169)+element['tagName']+_0x2bb7d9(0x124)+_0x5c743a+_0x2bb7d9(0x1e4));return{'table':_0x576c80,'gridType':_0x1bb7f2,'gridDefinition':current_grid_selector};}function findBestMatchingGrid(_0x426994){var _0x40937b=_0x1be4f3;verbose&&console[_0x40937b(0xd0)](_0x40937b(0x1a6)+(_0x426994[_0x40937b(0xbc)]||'unknown\x20element'));let _0x387e21=null,_0x5e4af9=-0x1;function _0x3aabe0(_0x4b09f0){var _0x232f59=_0x40937b;let _0x34e583=[];for(let _0x141697 of grid_definitions){for(let _0x3b2db2 of _0x141697[_0x232f59(0x17e)]){var _0xdf9a3e=_0x4b09f0;if(_0x3b2db2[_0x232f59(0x100)]?.[_0x232f59(0xe9)]){var _0x4a4226=findVCShadowRoots(_0xdf9a3e=document[_0x232f59(0xf7)]);if(_0x4a4226!==null&&_0x4a4226[_0x232f59(0x1ce)]>0x0)_0xdf9a3e=_0x4a4226[0x0]?.[_0x232f59(0xe5)];}let _0x1de258=_0xdf9a3e[_0x232f59(0x193)](_0x3b2db2[_0x232f59(0x100)][_0x232f59(0x193)]);if(_0x3b2db2[_0x232f59(0x100)]['shadowRoot']&&_0xdf9a3e['shadowRoot']!=null)_0x1de258=_0xdf9a3e[_0x232f59(0xe9)][_0x232f59(0x193)](_0x3b2db2['custom_grid_selector']['querySelector']);else _0x1de258=_0xdf9a3e['querySelector'](_0x3b2db2[_0x232f59(0x100)][_0x232f59(0x193)]);_0x1de258&&_0x34e583['push']({'name':_0x141697[_0x232f59(0x1e2)],'gridElement':_0x1de258,'definition':_0x3b2db2});}}return _0x34e583;}function _0x5b1d66(_0x8031c3){var _0x5e0a5e=_0x40937b;let _0x11303e=0x0,{gridElement:_0x2684e3,definition:_0x27fb61}=_0x8031c3;if(_0x2684e3){_0x11303e+=0x1;let _0x24f0c7=null;if(_0x27fb61[_0x5e0a5e(0x181)]?.[_0x5e0a5e(0xe9)]&&_0x2684e3['shadowRoot']!=null)_0x24f0c7=_0x2684e3[_0x5e0a5e(0xe9)][_0x5e0a5e(0x13e)](_0x27fb61[_0x5e0a5e(0x181)]?.[_0x5e0a5e(0x193)]||'');else _0x24f0c7=_0x2684e3[_0x5e0a5e(0x13e)](_0x27fb61[_0x5e0a5e(0x181)]?.['querySelector']||'');_0x24f0c7[_0x5e0a5e(0x1ce)]>0x0&&(_0x11303e+=0x2);let _0x533563=null;if(_0x27fb61[_0x5e0a5e(0x148)]?.[_0x5e0a5e(0xe9)]&&_0x2684e3[_0x5e0a5e(0xe9)]!=null)_0x533563=_0x2684e3['shadowRoot'][_0x5e0a5e(0x13e)](_0x27fb61[_0x5e0a5e(0x148)]?.['querySelector']||'');else _0x533563=_0x2684e3['querySelectorAll'](_0x27fb61[_0x5e0a5e(0x148)]?.['querySelector']||'');_0x533563[_0x5e0a5e(0x1ce)]>0x0&&(_0x11303e+=0x3);let _0x3c274a=null;if(_0x27fb61['custom_cell_selector']?.['shadowRoot']&&_0x2684e3[_0x5e0a5e(0xe9)]!=null)_0x3c274a=_0x2684e3[_0x5e0a5e(0xe9)][_0x5e0a5e(0x13e)](_0x27fb61[_0x5e0a5e(0x19c)]?.['querySelector']||'');else _0x3c274a=_0x2684e3['querySelectorAll'](_0x27fb61[_0x5e0a5e(0x19c)]?.[_0x5e0a5e(0x193)]||'');_0x3c274a[_0x5e0a5e(0x1ce)]>0x0&&(_0x11303e+=0x4);}return _0x11303e;}function _0x7c0e4e(_0x50d035){var _0x39fb02=_0x40937b;let _0x49936a=_0x3aabe0(_0x50d035);if(_0x49936a['length']===0x0){let _0x2cc253=_0x50d035;while(_0x2cc253&&_0x2cc253!==document){_0x49936a=_0x3aabe0(_0x2cc253);if(_0x49936a[_0x39fb02(0x1ce)]>0x0)break;_0x2cc253=_0x2cc253[_0x39fb02(0xcb)];}}return _0x49936a;}function _0x5afd99(_0x46f6d5){var _0x2aada3=_0x40937b;return _0x46f6d5['forEach'](_0x5dae1d=>{let _0x337c23=_0x5b1d66(_0x5dae1d);_0x337c23>_0x5e4af9&&(_0x387e21=_0x5dae1d,_0x5e4af9=_0x337c23);}),!_0x387e21?(console['log']('No\x20matching\x20grid\x20found.'),null):(console[_0x2aada3(0xd0)]('Best\x20match\x20found:\x20'+_0x387e21[_0x2aada3(0x13d)]+_0x2aada3(0x14b)+_0x5e4af9),_0xcff133(_0x387e21[_0x2aada3(0x118)]),_0x387e21[_0x2aada3(0x138)]);}function _0xcff133(_0x25947c){var _0x235e8a=_0x40937b;current_grid_selector=_0x25947c[_0x235e8a(0x100)],current_pager_selector=_0x25947c['custom_pager_selector'],current_pager_sizes_selector=_0x25947c[_0x235e8a(0x12c)],current_pager_pages_selector=_0x25947c[_0x235e8a(0x1d3)],current_searchfield_selector=_0x25947c['custom_searchfield_selector'],current_headergroup_selector=_0x25947c[_0x235e8a(0x116)],current_header_cell_selector=_0x25947c[_0x235e8a(0x181)],current_rowgroup_selector=_0x25947c[_0x235e8a(0x12f)],current_row_selector=_0x25947c[_0x235e8a(0x148)],current_cell_selector=_0x25947c[_0x235e8a(0x19c)];}let _0x41b96c=_0x7c0e4e(_0x426994),_0x136f3f=_0x5afd99(_0x41b96c);if(_0x136f3f===undefined||_0x136f3f===null)throw new Error(_0x40937b(0x169)+_0x426994[_0x40937b(0xbc)]+_0x40937b(0x1e4));return{'table':_0x136f3f,'gridType':_0x387e21[_0x40937b(0x13d)],'gridDefinition':_0x387e21[_0x40937b(0x118)]};}function tableHeadersGet(_0x4a2e7f){var _0x5b76cf=_0x1be4f3;let _0x1e6d59=null,_0x120518=[],_0x465c6a=[],_0x500fa2=[];if(!current_header_cell_selector)throw new Error('tableHeadersGet::\x20current_header_cell_selector\x20is\x20undefined.\x20Check\x20custom\x20table\x20entry');_0x1e6d59=_0x4a2e7f;if(current_headergroup_selector){console[_0x5b76cf(0x1b5)](_0x5b76cf(0xcc),current_headergroup_selector[_0x5b76cf(0x193)]);var _0xa27297=null;current_headergroup_selector?.[_0x5b76cf(0xe9)]&&current_headergroup_selector['shadowRoot']!=null?_0xa27297=_0x4a2e7f[_0x5b76cf(0xe9)][_0x5b76cf(0x13e)](current_headergroup_selector[_0x5b76cf(0x193)]):_0xa27297=_0x4a2e7f[_0x5b76cf(0x13e)](current_headergroup_selector['querySelector']),console['debug']('DEBUG:\x20header_groups\x20found:',_0xa27297[_0x5b76cf(0x1ce)]),_0xa27297['length']>0x0?(_0x1e6d59=_0xa27297[current_headergroup_selector[_0x5b76cf(0x1d6)]??0x0],console[_0x5b76cf(0x1b5)]('DEBUG:\x20Selected\x20table_header_group:',_0x1e6d59),highlight_elements&&highlight_headers&&_0x1e6d59&&highlightElement(_0x1e6d59,TABLE_HEADERROW_HIGHLIGHT_BORDER)):console[_0x5b76cf(0x1b5)](_0x5b76cf(0x1b0));}if(current_header_cell_selector&&_0x1e6d59){console['debug'](_0x5b76cf(0x11a),current_header_cell_selector[_0x5b76cf(0x193)]);const _0x230b84=_0x1e6d59[_0x5b76cf(0x13e)](current_header_cell_selector[_0x5b76cf(0x193)]);console[_0x5b76cf(0x1b5)](_0x5b76cf(0x15b),_0x230b84[_0x5b76cf(0x1ce)]);if(_0x230b84[_0x5b76cf(0x1ce)]>0x0){var _0x41a87c=-0x1;_0x230b84['forEach'](_0x18d6cf=>{var _0x405a4c=_0x5b76cf;_0x41a87c++;if(_0x18d6cf[_0x405a4c(0x17c)](_0x405a4c(0xd7))==='on'||_0x18d6cf[_0x405a4c(0x13a)]['display']===_0x405a4c(0x174)){console[_0x405a4c(0x1b5)](_0x405a4c(0xeb),_0x18d6cf);return;}highlight_elements&&highlight_headers&&_0x18d6cf&&highlightElement(_0x18d6cf,TABLE_HEADER_HIGHLIGHT_BORDER);let _0x47040f=_0x18d6cf[_0x405a4c(0x11b)][_0x405a4c(0x1d7)]();if(_0x47040f[_0x405a4c(0x1a3)](_0x405a4c(0xf0))){console['debug']('DEBUG:\x20Skipping\x20column\x20with\x20\x27Cell\x20value\x20has\x20been\x20edited\x27:',_0x47040f);return;}try{let _0x5a209b=current_header_cell_selector[_0x405a4c(0x15a)]??DEFAULT_DELIMITER,_0x56ac92=current_header_cell_selector[_0x405a4c(0xfc)]??0x0,_0x278be3=current_header_cell_selector[_0x405a4c(0x134)]??0x1,_0x5a1ece=_0x47040f[_0x405a4c(0x18b)](_0x5a209b)[_0x405a4c(0x1ce)];if(_0x56ac92>_0x5a1ece)_0x56ac92=-0x1;if(_0x278be3>_0x5a1ece)_0x278be3=_0x5a1ece;let _0xc69ac9=_0x47040f[_0x405a4c(0x18b)](_0x5a209b)[_0x405a4c(0xf5)](_0x56ac92,_0x278be3);_0xc69ac9[_0x405a4c(0x1ce)]>=0x1&&(_0x47040f=_0xc69ac9[_0x405a4c(0x101)](_0x5a209b)[_0x405a4c(0x1d7)]()),current_header_cell_selector[_0x405a4c(0x1c9)]&&current_header_cell_selector[_0x405a4c(0x1c9)][_0x405a4c(0xd1)](_0x3adcee=>{var _0x13fe11=_0x405a4c;_0x47040f=_0x47040f['replace'](_0x3adcee,'')[_0x13fe11(0x1d7)]();});}catch(_0x21e073){console[_0x405a4c(0xea)](_0x405a4c(0x129),_0x21e073[_0x405a4c(0xd3)]);}!(current_header_cell_selector[_0x405a4c(0x107)]&&_0x41a87c>0x0&&is_separator_cell)&&!(current_header_cell_selector[_0x405a4c(0x177)]&&_0x41a87c>0x0&&_0x47040f==='')&&(_0x500fa2[_0x405a4c(0xe7)](_0x47040f),_0x465c6a[_0x405a4c(0xe7)](_0x18d6cf),_0x120518[_0x405a4c(0xe7)]({'index':_0x120518['length'],'text':_0x47040f,'element':_0x18d6cf}));});}else console[_0x5b76cf(0x1b5)](_0x5b76cf(0xf4));}else console[_0x5b76cf(0x1b5)]('DEBUG:\x20table_header_group\x20or\x20current_header_cell_selector\x20is\x20undefined.');return console[_0x5b76cf(0x1b5)]('DEBUG:\x20table_headers:',_0x120518),console['debug']('DEBUG:\x20table_header_cells:',_0x465c6a),console[_0x5b76cf(0x1b5)](_0x5b76cf(0x122),_0x500fa2),{'table_header_group':_0x1e6d59,'table_headers':_0x120518,'table_header_cells':_0x465c6a,'table_columnnames':_0x500fa2};}function tablePagerGet(_0x3ff51c){var _0x45ff66=_0x1be4f3;let _0x1b82b8=undefined,_0x3292b6=null,_0xc8d884=null;if(current_pager_selector!==undefined&&current_pager_selector!==null){_0x1b82b8=_0x3ff51c[_0x45ff66(0x13e)](current_pager_selector['querySelector'])[current_pager_selector[_0x45ff66(0x1d6)]??0x0];verbose&&console[_0x45ff66(0xd0)](_0x45ff66(0x11e),_0x1b82b8);if(highlight_elements&&highlight_pager&&_0x1b82b8!==undefined)highlightElement(_0x1b82b8,TABLE_PAGER_HIGHLIGHT_BORDER);}if(current_pager_sizes_selector!==undefined&&current_pager_sizes_selector!==null){_0x3292b6=_0x3ff51c[_0x45ff66(0x13e)](current_pager_sizes_selector['querySelector']);verbose&&console[_0x45ff66(0xd0)](_0x45ff66(0xb8),current_pager_sizes_selector);if(highlight_elements&&highlight_pager_sizes&&_0x3292b6!==undefined)_0x3292b6[_0x45ff66(0xd1)](_0x44221c=>{highlightElement(_0x44221c,TABLE_PAGER_SIZES_HIGHLIGHT_BORDER);});}if(current_pager_pages_selector!==undefined&&current_pager_pages_selector!==null){_0xc8d884=_0x3ff51c[_0x45ff66(0x13e)](current_pager_pages_selector[_0x45ff66(0x193)]);verbose&&console[_0x45ff66(0xd0)](_0x45ff66(0x150),_0xc8d884);if(highlight_elements&&highlight_pager_pages&&_0xc8d884!==undefined)_0xc8d884[_0x45ff66(0xd1)](_0xb6b158=>{highlightElement(_0xb6b158,TABLE_PAGER_PAGES_HIGHLIGHT_BORDER);});}return{'table_pager':_0x1b82b8,'table_pager_sizes':_0x3292b6,'table_pager_pages':_0xc8d884};}function tableSearchFieldGet(_0x21fd1d){var _0xf822e6=_0x1be4f3;let _0x25f575=undefined;if(current_searchfield_selector!==undefined&&current_searchfield_selector!==null){_0x25f575=_0x21fd1d[_0xf822e6(0x13e)](current_searchfield_selector[_0xf822e6(0x193)])[current_searchfield_selector[_0xf822e6(0x1d6)]??0x0];verbose&&console[_0xf822e6(0xd0)](_0xf822e6(0x1b4),_0x25f575);if(highlight_elements&&highlight_pager&&_0x25f575!==undefined)highlightElement(_0x25f575,TABLE_SEARCHFIELD_HIGHLIGHT_BORDER);}return{'table_searchfield':_0x25f575,'table_pager_sizes':table_pager_sizes,'table_pager_pages':table_pager_pages};}function tableRowsGet(_0x49a55d){var _0x1f9d0f=_0x1be4f3;let _0x341e0f=_0x49a55d,_0x270900=null,_0x14e171=0x0;if(typeof current_row_selector===_0x1f9d0f(0x10e)||current_row_selector===null)throw new Error(_0x1f9d0f(0x131));typeof current_rowgroup_selector!==_0x1f9d0f(0x10e)&&current_rowgroup_selector!==null&&(current_rowgroup_selector?.[_0x1f9d0f(0xe9)]&&_0x49a55d['shadowRoot']!=null?_0x341e0f=_0x49a55d[_0x1f9d0f(0xe9)][_0x1f9d0f(0x13e)](current_rowgroup_selector[_0x1f9d0f(0x193)])[current_rowgroup_selector['nth_child']??0x0]:_0x341e0f=_0x49a55d[_0x1f9d0f(0x13e)](current_rowgroup_selector['querySelector'])[current_rowgroup_selector[_0x1f9d0f(0x1d6)]??0x0],verbose&&console[_0x1f9d0f(0xd0)](_0x1f9d0f(0xc0),_0x341e0f),highlight_elements&&highlight_rowgroup&&typeof _0x341e0f!=='undefined'&&highlightElement(_0x341e0f,TABLE_ROWGROUP_HIGHLIGHT_BORDER),typeof _0x341e0f===_0x1f9d0f(0x10e)&&(_0x341e0f=_0x49a55d));current_row_selector?.[_0x1f9d0f(0xe9)]&&_0x341e0f[_0x1f9d0f(0xe9)]!=null?_0x270900=_0x341e0f['shadowRoot']['querySelectorAll'](current_row_selector['querySelector']):_0x270900=_0x341e0f[_0x1f9d0f(0x13e)](current_row_selector[_0x1f9d0f(0x193)]);let _0x473648=Array[_0x1f9d0f(0x130)](_0x270900),_0x2cd1d7=parseRanges(row_ranges,_0x473648[_0x1f9d0f(0x1ce)])||Array[_0x1f9d0f(0x130)]({'length':_0x473648[_0x1f9d0f(0x1ce)]},(_0x5556bf,_0x39b0bb)=>_0x39b0bb);return _0x2cd1d7=_0x2cd1d7[_0x1f9d0f(0x18c)](_0xe3f847=>_0xe3f847>=0x0&&_0xe3f847<_0x473648[_0x1f9d0f(0x1ce)]),_0x2cd1d7=_0x2cd1d7['slice'](0x0,DEFAULT_MAX_ROWS),_0x270900=_0x2cd1d7[_0x1f9d0f(0x19d)](_0x1a701f=>_0x473648[_0x1a701f]),_0x14e171=_0x270900[_0x1f9d0f(0x1ce)],verbose&&(console[_0x1f9d0f(0xd0)](_0x1f9d0f(0x18a),safeLogObject(_0x270900)),console[_0x1f9d0f(0xd0)]('table_row_count\x20=\x20',_0x14e171)),{'table_datarow_group':_0x341e0f,'table_rows':_0x270900,'table_row_count':_0x14e171};}function tableCellsGet(_0x3e1d73,_0x4febf3){var _0x4d328d=_0x1be4f3;let _0x550699=[],_0x54aafb=[],_0x3b27ad=_0x3e1d73['table_rows'],_0x5f2bf9=_0x4febf3?.['table_columnnames']||[],_0x407e1a=parseRanges(col_ranges,_0x5f2bf9[_0x4d328d(0x1ce)]);_0x4febf3[_0x4d328d(0x199)]=_0x407e1a[_0x4d328d(0x19d)](_0x4b93f1=>_0x5f2bf9[_0x4b93f1]);let _0x2c5baa=_0x4febf3['table_columnnames'][_0x4d328d(0xf2)]((_0x55d489,_0x58676a)=>{return _0x55d489[_0x58676a]=[],_0x55d489;},{});if(verbose)console[_0x4d328d(0x1b5)](_0x4d328d(0x1a2)+JSON['stringify'](_0x2c5baa));for(let _0x22662a=0x0;_0x22662a<_0x3b27ad[_0x4d328d(0x1ce)];_0x22662a++){let _0x295422=null,_0x3d52b3;highlight_elements&&highlight_rows&&_0x3b27ad[_0x22662a]&&highlightElement(_0x3b27ad[_0x22662a],TABLE_ROW_HIGHLIGHT_BORDER);if(verbose)console[_0x4d328d(0x1b5)](_0x4d328d(0x16e)+_0x22662a+_0x4d328d(0x146)+current_cell_selector[_0x4d328d(0x193)]);var _0x5c6936=null;current_cell_selector?.[_0x4d328d(0xe9)]&&_0x3b27ad[_0x22662a]?.['shadowRoot']!=null?_0x5c6936=_0x3b27ad[_0x22662a]?.[_0x4d328d(0xe9)][_0x4d328d(0x13e)](current_cell_selector['querySelector']):_0x5c6936=_0x3b27ad[_0x22662a]?.[_0x4d328d(0x13e)](current_cell_selector[_0x4d328d(0x193)]);if(!_0x5c6936||_0x5c6936[_0x4d328d(0x1ce)]===0x0)continue;let _0x389f5b=Array[_0x4d328d(0x130)](_0x5c6936);_0x5c6936=_0x407e1a['map'](_0x4710fc=>_0x389f5b[_0x4710fc]);if(_0x5c6936?.['length']>0x0){_0x3d52b3={};let _0x2bff39=0x0;_0x3d52b3[_0x4d328d(0x115)]=_0x22662a;let _0x324d07=Array[_0x4d328d(0x130)](_0x5c6936);const _0x4ea067=(_0x208ac0,_0x33f3ce)=>parseFloat(_0x208ac0[_0x4d328d(0x13a)][_0x33f3ce])||0x0;switch(current_cell_selector?.[_0x4d328d(0xe8)]){case'Left':case _0x4d328d(0x153):_0x324d07['sort']((_0x4edf09,_0xf21e77)=>_0x4ea067(_0x4edf09,current_cell_selector[_0x4d328d(0xe8)][_0x4d328d(0x17d)]())-_0x4ea067(_0xf21e77,current_cell_selector[_0x4d328d(0xe8)]['toLowerCase']()));break;case _0x4d328d(0xe0):case'Bottom':_0x324d07[_0x4d328d(0x189)]((_0x2f88c5,_0x413b88)=>_0x4ea067(_0x413b88,current_cell_selector[_0x4d328d(0xe8)][_0x4d328d(0x17d)]())-_0x4ea067(_0x2f88c5,current_cell_selector[_0x4d328d(0xe8)][_0x4d328d(0x17d)]()));break;default:break;}_0x324d07['forEach']((_0x2cdffc,_0x41471f)=>{var _0x35c58b=_0x4d328d;let _0x5827f9=_0x4febf3[_0x35c58b(0x199)][_0x2bff39++];var _0x5f0004=_0x2cdffc;if(typeof current_cell_selector?.[_0x35c58b(0x126)]==='object'){var _0x28850b=undefined;current_cell_selector['shadowDomPath'][_0x35c58b(0xd1)](_0x3fa8b9=>{var _0x209748=_0x35c58b;_0x28850b===undefined?_0x28850b=_0x2cdffc[_0x209748(0x13e)](_0x3fa8b9)[0x0]:_0x28850b=_0x28850b[_0x209748(0xe9)][_0x209748(0xe5)][_0x209748(0x13e)](_0x3fa8b9)[0x0];}),_0x28850b!==undefined&&(_0x5f0004=_0x28850b['querySelectorAll'](current_cell_selector[_0x35c58b(0x104)])[0x0]);}let _0x1e592d=_0x5f0004?_0x5f0004[_0x35c58b(0x11b)]:'';if(verbose)console[_0x35c58b(0x1b5)](_0x35c58b(0x125)+_0x22662a+_0x35c58b(0x172)+_0x41471f+_0x35c58b(0x141)+_0x1e592d);current_cell_selector[_0x35c58b(0x1c9)]!==undefined&&current_cell_selector[_0x35c58b(0x1c9)][_0x35c58b(0xd1)](_0x29a1c1=>{var _0x3d3065=_0x35c58b;_0x1e592d=_0x1e592d[_0x3d3065(0x158)](_0x29a1c1,'');}),_0x3d52b3[_0x5827f9]=_0x1e592d,_0x2c5baa[_0x5827f9]['push'](_0x1e592d),highlight_elements&&highlight_cells&&_0x5f0004&&highlightElement(_0x5f0004,TABLE_CELL_HIGHLIGHT_BORDER);}),_0x295422=_0x3d52b3;}if(_0x5c6936?.['length']>0x0)_0x550699[_0x4d328d(0xe7)](_0x5c6936);_0x295422!==null&&_0x54aafb[_0x4d328d(0xe7)](_0x295422);}return{'table_cells':_0x550699,'table_cell_values':_0x54aafb,'table_column_values':_0x2c5baa};}function tableRowFind(_0x33723b,_0x2428db,_0x4330d0,_0x56fd0d){var _0xf23064=_0x1be4f3;let _0x3036ea=-0x1,_0x1f46b6,_0x406522,_0x36998f,_0x4ea212=0x0;switch(typeof _0x4330d0){case'number':_0x3036ea=_0x4330d0;break;case'string':switch(_0x4330d0['toUpperCase']()){case'LAST':_0x3036ea=_0x33723b[_0xf23064(0x1ce)]-0x1;break;case'FIRST':_0x3036ea=0x0;break;}break;case _0xf23064(0x1aa):default:_0x1f46b6=Object[_0xf23064(0x117)](_0x4330d0)[0x0],_0x406522=_0x4330d0[_0x1f46b6],_0x4ea212=Object[_0xf23064(0x117)](_0x4330d0)['includes'](_0xf23064(0x185))?_0x4330d0[_0xf23064(0x185)]:0x0;if(verbose)console[_0xf23064(0xd0)](_0xf23064(0xc3),_0x4330d0,_0xf23064(0x12b),_0x1f46b6,_0xf23064(0x1c7),_0x406522,_0xf23064(0x10a),_0x4ea212);verbose&&(console[_0xf23064(0xd0)]('\x20\x20tableColumnNames.length:',_0x2428db['length']),console[_0xf23064(0xd0)](_0xf23064(0xbf),_0x33723b['length']));if(_0x1f46b6!==_0xf23064(0x115)&&_0x2428db[_0xf23064(0x1ce)]>0x0){let _0x50a2b4=-0x1;[][_0xf23064(0xd1)][_0xf23064(0x16c)](_0x2428db,function(_0xa55223){_0x50a2b4=++_0x50a2b4;if(_0xa55223===_0x1f46b6)_0x36998f=_0x50a2b4;});}if(_0x36998f==undefined&&!isNaN(_0x1f46b6))_0x36998f=Number(_0x1f46b6);verbose&&(console[_0xf23064(0xd0)]('\x20\x20target_row_column_id:',_0x36998f),console[_0xf23064(0xd0)](_0xf23064(0x1af),_0x33723b[0x0]['children'][_0xf23064(0x1ce)]));if(_0x1f46b6['toLowerCase']()===_0xf23064(0x115)){_0x3036ea=_0x406522;if(_0x3036ea<0x0)_0x3036ea=0x0;if(_0x3036ea>=_0x33723b[_0xf23064(0x1ce)])_0x3036ea=_0x33723b[_0xf23064(0x1ce)]-0x1;}else{if(_0x33723b['length']>0x0&&(_0x36998f>=0x0&&_0x36998f<_0x33723b[0x0]['children'][_0xf23064(0x1ce)])){let _0x7cfb3c=-0x1;if(verbose)console['log']('\x20\x20tableRows.length\x20>\x200');[][_0xf23064(0xd1)][_0xf23064(0x16c)](_0x33723b,function(_0x593d63){var _0x38101b=_0xf23064;_0x7cfb3c=++_0x7cfb3c;if(verbose)console[_0x38101b(0xd0)]('?\x20checking\x20equality\x20',_0x593d63['children'][_0x36998f]?.['innerText'][_0x38101b(0x1d7)]()+_0x38101b(0xdb)+_0x406522);if(_0x3036ea==-0x1&&stringMatch[_0x56fd0d](_0x593d63[_0x38101b(0x168)][_0x36998f]?.[_0x38101b(0x11b)][_0x38101b(0x1d7)](),_0x406522)&&_0x4ea212-->=0x0){_0x3036ea=_0x7cfb3c;if(verbose)console['log']('\x20\x20\x20\x20==>\x20target_row_id\x20=\x20',_0x3036ea);}});}}break;}if(verbose)console[_0xf23064(0xd0)](_0xf23064(0x1cc),_0x3036ea);if(_0x3036ea==-0x1)throw new Error('Error\x20finding\x20target\x20row\x20['+JSON['stringify'](_0x4330d0)+']');if(highlight_elements&&highlight_target_row&&_0x33723b[_0x3036ea]!==undefined&&_0x33723b[_0x3036ea]!==null)highlightElement(_0x33723b[_0x3036ea],TABLE_TARGET_ROW_HIGHLIGHT_BORDER);return _0x33723b[_0x3036ea];}function tableCellFind(_0xeb9d32,_0x221d1b,_0x380227){var _0x6d2cc0=_0x1be4f3;if(verbose)console['log'](_0x6d2cc0(0x16b),_0xeb9d32,_0x221d1b);let _0x4c55dc=null,_0x6f39ba=-0x1;switch(typeof _0x221d1b){case'number':_0x6f39ba=_0x221d1b<0x0?0x0:_0x221d1b>=_0xeb9d32[_0x6d2cc0(0x1ce)]?_0xeb9d32[_0x6d2cc0(0x1ce)]-0x1:_0x221d1b;break;case'string':default:switch(_0x221d1b[_0x6d2cc0(0x162)]()){case'LAST':_0x6f39ba=_0xeb9d32[_0x6d2cc0(0x168)][_0x6d2cc0(0x1ce)]-0x1;break;case _0x6d2cc0(0x110):_0x6f39ba=0x0;break;default:if(table_columnnames!==null&&table_columnnames[_0x6d2cc0(0x1ce)]>0x0){let _0x46d44f=-0x1;[][_0x6d2cc0(0xd1)][_0x6d2cc0(0x16c)](table_columnnames,function(_0x48ec62){_0x46d44f=++_0x46d44f,stringMatch[_0x380227](_0x48ec62['trim'](),_0x221d1b)&&(_0x6f39ba=_0x46d44f);});}}}console[_0x6d2cc0(0xd0)](_0x6d2cc0(0x1b7),_0x6f39ba);if(_0x6f39ba>-0x1)_0x4c55dc=_0xeb9d32[_0x6d2cc0(0x168)][_0x6f39ba];if(highlight_elements&&highlight_target_cell&&_0x4c55dc!==undefined&&_0x4c55dc!==null)highlightElement(_0x4c55dc,TABLE_TARGET_CELL_HIGHLIGHT_BORDER);return _0x4c55dc;}function tableCellClick({targetSelector:_0x323ddf,clickMethod:clickMethod=_0x1be4f3(0x195),timeoutDuration:timeoutDuration=0x7d0}){return new Promise((_0x1dea21,_0x82baa)=>{var _0x4bb54f=_0x2620;function _0x299c59(_0x2abe34){var _0x311968=_0x2620;try{const _0x5a2def=[_0x311968(0x1be),_0x311968(0xfe),_0x311968(0x1a4),'click'];_0x5a2def[_0x311968(0xd1)](_0x459361=>{var _0x789119=_0x311968;const _0xd4d696=new MouseEvent(_0x459361,{'bubbles':!![],'composed':!![],'cancelable':!![],'view':window});_0x2abe34[_0x789119(0xdd)](_0xd4d696);});}catch(_0x196282){_0x82baa(_0x196282);}}function _0x4998a1(_0x424b4b){var _0x328ad4=_0x2620;try{const _0x38ca58=[_0x328ad4(0x1be),_0x328ad4(0xfe),_0x328ad4(0x1a4),_0x328ad4(0x105),'mousedown',_0x328ad4(0x1a4),_0x328ad4(0x105)];_0x38ca58[_0x328ad4(0xd1)](_0x586817=>{const _0xc9a186=new MouseEvent(_0x586817,{'bubbles':!![],'composed':!![],'cancelable':!![],'view':window});_0x424b4b['dispatchEvent'](_0xc9a186);});}catch(_0x418cdd){_0x82baa(_0x418cdd);}}function _0x4f8044(_0x505028){var _0x43af6d=_0x2620;if(!_0x505028)return;const _0x824c9a=new MouseEvent(_0x43af6d(0x105),{'bubbles':!![],'cancelable':!![]});_0x505028[_0x43af6d(0xdd)](_0x824c9a),_0x505028[_0x43af6d(0xdd)](_0x824c9a);}function _0x25053a(_0x238feb,_0x4b4e7c,_0x2c7fe8){var _0x3a1169=_0x2620;return new Promise((_0x48bda6,_0x1183bd)=>{var _0x731178=_0x2620;const _0x2d4465=_0x238feb[_0x731178(0x180)](),_0x5e2964=new PointerEvent(_0x731178(0x183),{'bubbles':!![],'cancelable':!![],'clientX':_0x2d4465['left']+_0x2d4465['width']/0x2,'clientY':_0x2d4465[_0x731178(0x166)]+_0x2d4465[_0x731178(0x1c2)]/0x2});_0x238feb[_0x731178(0xdd)](_0x5e2964),setTimeout(()=>{var _0x46fac3=_0x731178;const _0x3ee642=new PointerEvent(_0x46fac3(0x1cb),{'bubbles':!![],'cancelable':!![],'clientX':_0x2d4465[_0x46fac3(0x132)]+_0x2d4465['width']/0x2,'clientY':_0x2d4465['top']+_0x2d4465['height']/0x2});_0x238feb[_0x46fac3(0xdd)](_0x3ee642),_0x48bda6(_0x238feb);},0x3e8);})[_0x3a1169(0x1a5)](_0x362264=>{var _0x22cda1=_0x3a1169;_0x362264[_0x22cda1(0x1a1)]();try{_0x362264[_0x22cda1(0x149)][_0x22cda1(0x105)]();}catch(_0x39e1e5){try{_0x362264['firstChild'][_0x22cda1(0x105)]();}catch(_0x163d34){_0x362264['click']();}}return new Promise((_0x306273,_0x878d84)=>{var _0x401f94=_0x22cda1;const _0x3ad8a5=_0x362264[_0x401f94(0x180)](),_0x5cdc14=new PointerEvent('pointerdown',{'bubbles':!![],'cancelable':!![],'clientX':_0x3ad8a5[_0x401f94(0x132)]+_0x3ad8a5[_0x401f94(0x17a)]/0x2,'clientY':_0x3ad8a5[_0x401f94(0x166)]+_0x3ad8a5[_0x401f94(0x1c2)]/0x2});_0x362264[_0x401f94(0xdd)](_0x5cdc14),setTimeout(()=>{var _0x142e73=_0x401f94;const _0x4f2868=new PointerEvent(_0x142e73(0x1cb),{'bubbles':!![],'cancelable':!![],'clientX':_0x3ad8a5['left']+_0x3ad8a5[_0x142e73(0x17a)]/0x2,'clientY':_0x3ad8a5[_0x142e73(0x166)]+_0x3ad8a5[_0x142e73(0x1c2)]/0x2});_0x362264[_0x142e73(0xdd)](_0x4f2868),_0x306273(_0x362264);},0x3e8);});})[_0x3a1169(0x1a5)](_0x3ce25e=>{_0x4b4e7c(_0x3ce25e);})[_0x3a1169(0x19a)](_0x462dc7=>{_0x2c7fe8(_0x462dc7);});}function _0x2ec3c8(_0x4780a4,_0x44fe5b=null,_0x3aaed5=null){var _0x5f1835=_0x2620;let _0x48a867=_0x4780a4[_0x5f1835(0x180)](),_0x42bed7=_0x48a867[_0x5f1835(0x132)],_0x416172=_0x48a867[_0x5f1835(0x166)];if(typeof _0x44fe5b==_0x5f1835(0xef))_0x42bed7+=_0x44fe5b;else{if(_0x44fe5b==_0x5f1835(0x1cd)){_0x42bed7+=_0x48a867['width']/0x2;if(_0x3aaed5==null)_0x416172+=_0x48a867[_0x5f1835(0x1c2)]/0x2;}}if(typeof _0x3aaed5==_0x5f1835(0xef))_0x416172+=_0x3aaed5;let _0x54f3eb=new MouseEvent(_0x5f1835(0x105),{'bubbles':!![],'clientX':_0x42bed7,'clientY':_0x416172});_0x4780a4[_0x5f1835(0xdd)](_0x54f3eb);}let _0x37b91a=typeof _0x323ddf===_0x4bb54f(0x197)?document[_0x4bb54f(0x193)](_0x323ddf):_0x323ddf;if(!_0x37b91a){_0x82baa(new Error('No\x20valid\x20target\x20element\x20found'));return;}switch(clickMethod){case _0x4bb54f(0x195):_0x25053a(_0x37b91a);break;case _0x4bb54f(0x19e):_0x4998a1(_0x37b91a);break;case _0x4bb54f(0x1df):_0x2ec3c8(_0x37b91a);break;default:_0x299c59(_0x37b91a);break;}setTimeout(()=>{_0x1dea21(_0x37b91a);},timeoutDuration);});}function validateItemOrder(_0x77b020,_0xe4a97a,_0x245285){var _0x204682=_0x1be4f3;let _0x274353=0x0,_0x42c683=Object[_0x204682(0x117)](_0x77b020),_0x5cc86f=[];_0x42c683[_0x204682(0xd1)](_0x122665=>{if(_0x122665===_0xe4a97a||_0x274353++===_0xe4a97a)_0x5cc86f=_0x77b020[_0x122665];});let _0x3c0d89;if(_0x245285[_0x204682(0x162)]()===_0x204682(0xf8))_0x3c0d89=_0x5cc86f['slice'](0x1)[_0x204682(0xda)]((_0x3c8d73,_0xe57bb9)=>!isNaN(_0x3c8d73)?Number(_0x5cc86f[_0xe57bb9])>=Number(_0x3c8d73):_0x5cc86f[_0xe57bb9]>=_0x3c8d73);else _0x3c0d89=_0x5cc86f[_0x204682(0xf5)](0x1)['every']((_0x598043,_0x1120c8)=>!isNaN(_0x598043)?Number(_0x5cc86f[_0x1120c8])<=Number(_0x598043):_0x5cc86f[_0x1120c8]<=_0x598043);if(!_0x3c0d89)throw new Error('Options\x20are\x20NOT\x20in\x20'+_0x245285+_0x204682(0xc2)+JSON[_0x204682(0xd8)](_0x5cc86f,null,0x2));}function columnSum(_0x11b057,_0xa49721){var _0x272225=_0x1be4f3;let _0x423609=0x0,_0x316b06=0x0,_0x2460fc=Object[_0x272225(0x117)](_0x11b057),_0x1e0fd6=[];return _0x2460fc[_0x272225(0xd1)](_0x26c24f=>{if(_0x26c24f===_0xa49721||_0x423609++===_0xa49721)_0x1e0fd6=_0x11b057[_0x26c24f];}),_0x316b06=_0x1e0fd6[_0x272225(0xf2)]((_0x5d63db,_0x1e92ca)=>{var _0x2c5cdc=_0x272225,_0x2b4e9b=/\D*(\d+|\d.*?\d)(?:\D+(\d{2}))?\D*$/,_0x319a2a=_0x2b4e9b[_0x2c5cdc(0xc4)](_0x1e92ca);if(_0x319a2a===null)return _0x5d63db;var _0x597c87=parseFloat(_0x319a2a[0x1][_0x2c5cdc(0x158)](/\D/,'')+'.'+(_0x319a2a[0x2]?_0x319a2a[0x2]:'00'));if(!isNaN(_0x597c87))return Number(_0x597c87)+_0x5d63db;},0x0),_0x316b06;}function doEvent(_0x310170,_0x240603){var _0x4b7ad7=_0x1be4f3;let _0xa1e3f2=new Event(_0x240603,{'target':_0x310170,'bubbles':!![],'composed':!![]});return _0xa1e3f2[_0x4b7ad7(0xbd)]=!![],_0x310170?_0x310170[_0x4b7ad7(0xdd)](_0xa1e3f2):![];}function _0x2620(_0x1583c7,_0x15fb66){var _0x3d0797=_0x3d07();return _0x2620=function(_0x26204d,_0x23a656){_0x26204d=_0x26204d-0xb8;var _0x3affa4=_0x3d0797[_0x26204d];return _0x3affa4;},_0x2620(_0x1583c7,_0x15fb66);}const stringMatch={};stringMatch['exact']=function(_0x2bd1f3,_0x7ca840){return _0x2bd1f3===_0x7ca840;},stringMatch[_0x1be4f3(0x15f)]=function(_0x2a69d1,_0x2305c6){var _0x571ef2=_0x1be4f3;return _0x2a69d1[_0x571ef2(0x1bc)](_0x2305c6);},stringMatch[_0x1be4f3(0x1c1)]=function(_0x2986e3,_0x29b11c){var _0x45ff94=_0x1be4f3;return _0x2986e3[_0x45ff94(0x1db)](_0x29b11c);},stringMatch[_0x1be4f3(0x1a3)]=function(_0x1191fd,_0x3da139){return _0x1191fd['includes'](_0x3da139);},stringMatch[_0x1be4f3(0x123)]=function(_0x3af165,_0x34b240){return _0x3af165['includes'](_0x34b240);},stringMatch[_0x1be4f3(0x167)]=function(_0x11d620,_0x351f9d){return _0x11d620!==_0x351f9d;},stringMatch[_0x1be4f3(0x18e)]=function(_0x1edf65,_0x55a0d6){var _0x4879e5=_0x1be4f3;return!_0x1edf65[_0x4879e5(0x1bc)](_0x55a0d6);},stringMatch[_0x1be4f3(0xc9)]=function(_0x3ee914,_0x141c67){var _0x149b92=_0x1be4f3;return!_0x3ee914[_0x149b92(0x1db)](_0x141c67);},stringMatch[_0x1be4f3(0x176)]=function(_0x41cea8,_0x2b3b8a){var _0x510e32=_0x1be4f3;return!_0x41cea8[_0x510e32(0x1a3)](_0x2b3b8a);},stringMatch[_0x1be4f3(0x194)]=function(_0x1ed7cf,_0x202b22){var _0x58a930=_0x1be4f3;return!_0x1ed7cf[_0x58a930(0x1a3)](_0x202b22);},stringMatch[_0x1be4f3(0x17f)]=function(_0x300779,_0x4e92fb){var _0x5b42e8=_0x1be4f3;const _0x4e8c10=_0x4e92fb[_0x5b42e8(0x1d1)](/\/(.+?)\/([a-z]*)$/);if(_0x4e8c10){const _0x3a0996=_0x4e8c10[0x1],_0x2f1282=_0x4e8c10[0x2],_0x5e4f6d=new RegExp(_0x3a0996,_0x2f1282);return _0x5e4f6d[_0x5b42e8(0x1e1)](_0x300779);}else{const _0x51a629=new RegExp(_0x4e92fb);return _0x51a629[_0x5b42e8(0x1e1)](_0x300779);}};const copyToClipboard=_0x31b7d9=>{var _0x3c933b=_0x1be4f3;const _0x3bb32b=document['createElement'](_0x3c933b(0xc1));_0x3bb32b[_0x3c933b(0x136)]=_0x31b7d9,_0x3bb32b[_0x3c933b(0xf9)]('readonly',''),_0x3bb32b[_0x3c933b(0x13a)][_0x3c933b(0x191)]=_0x3c933b(0x19b),_0x3bb32b[_0x3c933b(0x13a)][_0x3c933b(0x132)]=_0x3c933b(0xce),document[_0x3c933b(0xf7)]['appendChild'](_0x3bb32b);const _0x5304cc=document[_0x3c933b(0x114)]()['rangeCount']>0x0?document['getSelection']()[_0x3c933b(0x1c5)](0x0):![];_0x3bb32b[_0x3c933b(0x1d0)](),document[_0x3c933b(0xc5)](_0x3c933b(0x165)),document[_0x3c933b(0xf7)][_0x3c933b(0x14a)](_0x3bb32b),_0x5304cc&&(document[_0x3c933b(0x114)]()['removeAllRanges'](),document[_0x3c933b(0x114)]()['addRange'](_0x5304cc));};function safeLogObject(_0x263b00,_0x2bb24a=0x0,_0x23962e=0x3){var _0x34aff4=_0x1be4f3;if(_0x2bb24a>_0x23962e)return _0x34aff4(0x1ac);if(typeof _0x263b00!==_0x34aff4(0x1aa)||_0x263b00===null)return _0x263b00;const _0x53ca30=new WeakSet();function _0x4aee34(_0x20e766,_0x4d4578){var _0x43e59a=_0x34aff4;if(_0x4d4578>_0x23962e||_0x20e766===null||typeof _0x20e766!==_0x43e59a(0x1aa))return _0x20e766;if(_0x53ca30[_0x43e59a(0xe2)](_0x20e766))return _0x43e59a(0x15c);_0x53ca30[_0x43e59a(0x170)](_0x20e766);const _0x65ef1=Array[_0x43e59a(0x156)](_0x20e766)?[]:{};for(const _0xd28e42 in _0x20e766){Object['prototype'][_0x43e59a(0x102)][_0x43e59a(0x16c)](_0x20e766,_0xd28e42)&&(_0x65ef1[_0xd28e42]=_0x4aee34(_0x20e766[_0xd28e42],_0x4d4578+0x1));}return _0x53ca30[_0x43e59a(0x198)](_0x20e766),_0x65ef1;}return _0x4aee34(_0x263b00,_0x2bb24a);}function parametersProcess(){var _0x4dede9=_0x1be4f3;if(typeof element===_0x4dede9(0x10e)||element===null)throw new Error(_0x4dede9(0xc7));return_variable_name=DEFAULT_RETURN_VARIABLE_NAME;if(typeof returnVariableName!=='undefined'&&returnVariableName!==null)return_variable_name=returnVariableName;typeof highlightElements!=='undefined'&&highlightElements===!![]&&(highlight_elements=!![],highlight_grid=!![],highlight_pager=!![],highlight_pager_sizes=!![],highlight_pager_pages=!![],highlight_headers=!![],highlight_rowgroup=!![],highlight_rows=!![],highlight_cells=!![],highlight_target_row=!![],highlight_target_cell=!![]);if(typeof gridTypeSearchOrder===_0x4dede9(0x197))grid_type_search_order=[gridTypeSearchOrder['toUpperCase']()];if(typeof gridTypeSearchOrder===_0x4dede9(0x1aa)&&Array['isArray'](gridTypeSearchOrder))grid_type_search_order=gridTypeSearchOrder;if(typeof customGridSelectors==='object'&&customGridSelectors!==null)custom_grid_definitions=customGridSelectors;else grid_type_search_order['forEach'](_0x373f8b=>{var _0x581945=_0x4dede9;grid_definitions[_0x581945(0xd1)](_0x53a53d=>{var _0x5b3d0b=_0x581945;_0x373f8b===_0x53a53d['Name']&&(_0x53a53d['Definitions'][_0x5b3d0b(0xd1)](_0x26e694=>{custom_grid_definitions['push'](_0x26e694);}),active_grid_names['push'](_0x53a53d[_0x5b3d0b(0x1e2)]));});});verbose&&(console[_0x4dede9(0xd0)](_0x4dede9(0x192)+JSON[_0x4dede9(0xd8)](grid_type_search_order)),console[_0x4dede9(0xd0)](_0x4dede9(0x151)+JSON[_0x4dede9(0xd8)](custom_grid_definitions)));matchtype=_0x4dede9(0x128);if(typeof matchType!==_0x4dede9(0x10e)&&matchType!==null)matchtype=matchType;row_selector={'index':0x0};typeof rowSelector!==_0x4dede9(0x10e)&&rowSelector!==null&&(row_selector=typeof rowSelector==='number'?{'index':rowSelector}:rowSelector);column_selector=0x0;typeof columnSelector!==_0x4dede9(0x10e)&&columnSelector!==null&&(column_selector=columnSelector);typeof pageSize!=='undefined'&&pageSize!==null&&(page_size=pageSize);typeof pageNumber!==_0x4dede9(0x10e)&&pageNumber!==null&&(page_number=pageNumber);typeof searchString!==_0x4dede9(0x10e)&&searchString!==null&&(search_string=searchString);compare_expression='==';if(typeof compareExpression!==_0x4dede9(0x10e)&&compareExpression!==null){compare_expression=compareExpression;if(compare_expression=='=')compare_expression='=';}order_direction=_0x4dede9(0x163),typeof sortOrder!=='undefined'&&sortOrder!==null&&(order_direction=sortOrder[_0x4dede9(0x162)]()),verbose&&(console['info']('Search\x20Configuration'),console[_0x4dede9(0x196)](_0x4dede9(0x1b1),grid_type_search_order),console[_0x4dede9(0x196)](_0x4dede9(0x1ba),row_selector),console[_0x4dede9(0x196)]('\x20\x20column_selector',column_selector),console[_0x4dede9(0x196)](_0x4dede9(0x18f),matchtype),console['info'](_0x4dede9(0xbb),compare_expression),console[_0x4dede9(0x196)](_0x4dede9(0x160),order_direction),console[_0x4dede9(0x196)]('\x20\x20return_variable_name',return_variable_name));}function parseRanges(_0x36f583,_0x1b7dc7){var _0x457b16=_0x1be4f3;if(typeof _0x36f583==='number')return Array[_0x457b16(0x130)]({'length':Math[_0x457b16(0xf3)](_0x36f583,_0x1b7dc7)},(_0x7a08a0,_0x48c5b9)=>_0x48c5b9);if(typeof _0x36f583!=='string'||!_0x36f583['trim']())return Array[_0x457b16(0x130)]({'length':_0x1b7dc7},(_0x3de86d,_0x109931)=>_0x109931);let _0x54616f=_0x36f583['split'](','),_0xb73aa3=[];return _0x54616f[_0x457b16(0xd1)](_0x4178b1=>{var _0x15b6c=_0x457b16;let [_0x3ca53c,_0x3af2e5]=_0x4178b1['split']('-')[_0x15b6c(0x19d)](Number);if(isNaN(_0x3ca53c))return;isNaN(_0x3af2e5)&&(_0x3af2e5=_0x3ca53c);for(let _0x25ee96=_0x3ca53c;_0x25ee96<=_0x3af2e5;_0x25ee96++){_0x25ee96<=_0x1b7dc7&&_0xb73aa3[_0x15b6c(0xe7)](_0x25ee96-0x1);}}),_0xb73aa3[_0x457b16(0xf5)](0x0,_0x1b7dc7);}

/* Validate parameters
 */
parametersProcess();

/* Find the target table based on starting element and custom_grid_definitions
 */
if (grid_type_search_order == "BESTMATCH")
    tableInfo = findBestMatchingGrid(element);
else
    tableInfo = tableFind(element);

/* Process the table infomation for use by the specifics ofthis function 
 */
table = tableInfo?.table;
if (table == null || current_header_cell_selector == null)
    throw new Error("table not found");

console.log("===> table", safeLogObject(table));
console.log("===> gridType", tableInfo?.gridType);
console.log("===> gridDefinition", tableInfo?.gridDefinition);

tableHeaders = tableHeadersGet(table);
tablePager = tablePagerGet(table);
tableSearchField = tableSearchFieldGet(table);

tableRows = tableRowsGet(table, tableHeaders);
console.log("===> tableRows", safeLogObject(tableRows));

tableCells = tableCellsGet(tableRows, tableHeaders);
console.log("===> tableCells", safeLogObject(tableCells));

if (verbose) {
    console.log("===> tablePager", safeLogObject(tablePager));
    console.log("===> tableSearchField", safeLogObject(tableSearchField));
    console.log("===> tableHeaders", safeLogObject(tableHeaders));
}

table_header_cells = tableHeaders?.table_header_cells;
table_pager_pages = tablePager?.table_pager_pages;
table_pager_sizes = tablePager?.table_pager_sizes;
table_searchfield = tableSearchField?.table_searchfield;
table_columnnames = tableHeaders?.table_columnnames;
table_rows = tableRows?.table_rows;
table_cells = tableCells?.table_cells;
table_cell_values = tableCells?.table_cell_values;
table_column_values = tableCells?.table_column_values;

if (verbose) {
    console.log("===> table_header_cells", table_header_cells);
    console.log("===> table_pager_pages", table_pager_pages);
    console.log("===> table_pager_sizes", table_pager_sizes);
    console.log("===> table_searchfield", table_searchfield);
    console.log("===> table_columnnames", table_columnnames);
    console.log("===> table_rows", table_rows);
    console.log("===> table_cells", table_cells);
    console.log("===> table_cell_values", table_cell_values);
    console.log("===> table_column_values", table_column_values);
}

exportsTest["tableColumnNames"] = table_columnnames;
exportsTest["tableCellValues"] = table_cell_values;

/*** END COMMON TABLE FUNCTIONALITY ***/

/*** Function Specific Logic Below ***/

let target_table_row = tableRowFind(table_rows, table_columnnames, row_selector, matchtype);
let target_table_cell = undefined;

if (typeof target_table_row !== 'undefined' && target_table_row !== null)
    target_table_cell = tableCellFind(target_table_row, column_selector, matchtype);

if (verbose)
    console.log("target_table_cell = ", target_table_cell);

if (typeof target_table_cell !== 'undefined' && target_table_cell !== null) {

    if (verbose)
        console.log("Click on cell with innerText = ", target_table_cell.innerText);

    copyToClipboard(target_table_cell.innerText);
    exportsTest[return_variable_name] = target_table_cell.innerText;

    if (highlight_elements && highlight_target_cell && target_table_cell != undefined)
        target_table_cell.style.border = TABLE_TARGET_CELL_HIGHLIGHT_BORDER;


    console.log("Target Cell", target_table_cell);

    let target_element = (target_table_cell.children.length == 0) ? target_table_cell : target_table_cell.children[0]

    if (typeof targetElementXPath !== "undefined" && targetElementXPath !== null) {

        let matchingElements = document.evaluate(targetElementXPath, target_table_cell, null, XPathResult.ANY_TYPE, null);
        let matching_elements = [];
        try {
            let matchingElement = matchingElements.iterateNext();
            while (matchingElement) {
                if (verbose) console.log("matchingElement", matchingElement);
                matching_elements.push(matchingElement);
                matchingElement = matchingElements.iterateNext();
            }
        }
        catch { }

        console.log("matching_elements", matching_elements);

        let matching_element = matching_elements[0];
        console.log("XPATH Matched Element", matching_element);

        if (matching_element !== undefined && matching_element !== null) {
            if (highlight_elements && highlight_target_cell)
                highlightElement(matching_element, TABLE_TARGET_CELL_HIGHLIGHT_BORDER);
            xpath_element_found = true;
            target_element = matching_element;
        }
    }

    console.log("Target Element", target_element);

/* Simulate a table cell click event either by simulating a mouse event or a pointer event
 */
function tableCellClick({
    targetSelector, // Can be an element or selector
    clickMethod = 'simulatePointerClick', // Default event method
    timeoutDuration = 2000, // Default timeout
}) {
    return new Promise((resolve, reject) => {

        // Simulate full user interaction with multiple events
        function simulateFullClick(obj) {
            try {
                const events = ['mouseover', 'mousedown', 'mouseup', 'click'];

                events.forEach(eventType => {
                    const event = new MouseEvent(eventType, {
                        bubbles: true,
                        composed: true,
                        cancelable: true,
                        view: window
                    });
                    obj.dispatchEvent(event);
                });
            } catch (err) {
                reject(err);
            }
        }

        function simulateFullDoubleClick(obj) {
            try {
                const events = ['mouseover', 'mousedown', 'mouseup', 'click', 'mousedown', 'mouseup', 'click'];

                events.forEach(eventType => {
                    const event = new MouseEvent(eventType, {
                        bubbles: true,
                        composed: true,
                        cancelable: true,
                        view: window
                    });
                    obj.dispatchEvent(event);
                });
            } catch (err) {
                reject(err);
            }
        }

        function simulateDoubleClick(element) {
            if (!element) return;

            // Create a click event
            const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });

            // Dispatch the click event twice to simulate a double click
            element.dispatchEvent(clickEvent);
            element.dispatchEvent(clickEvent);
        }

        function simulatePointerClick(element, resolve, reject) {

            return new Promise((resolve, reject) => {

                const rect = element.getBoundingClientRect();
                const pointerEvent = new PointerEvent('pointerdown', {
                    bubbles: true,
                    cancelable: true,
                    clientX: rect.left + rect.width / 2, // Center of the element
                    clientY: rect.top + rect.height / 2
                });

                element.dispatchEvent(pointerEvent);

                setTimeout(() => {
                    const pointerUpEvent = new PointerEvent('pointerup', {
                        bubbles: true,
                        cancelable: true,
                        clientX: rect.left + rect.width / 2, // Center of the element
                        clientY: rect.top + rect.height / 2
                    });

                    element.dispatchEvent(pointerUpEvent);

                    resolve(element);  // Pass the found element to the next .then()

                }, 1000); // Add a slight delay to simulate real user action

            })
                .then(element => {

                    element.focus();

                    try {
                        element.firstElementChild.click();
                    }
                    catch (err) {
                        try {
                            element.firstChild.click();
                        }
                        catch (err) {
                            element.click();
                        }
                    }

                    return new Promise((resolve, reject) => {

                        const rect = element.getBoundingClientRect();
                        const pointerEvent = new PointerEvent('pointerdown', {
                            bubbles: true,
                            cancelable: true,
                            clientX: rect.left + rect.width / 2, // Center of the element
                            clientY: rect.top + rect.height / 2
                        });

                        element.dispatchEvent(pointerEvent);

                        setTimeout(() => {
                            const pointerUpEvent = new PointerEvent('pointerup', {
                                bubbles: true,
                                cancelable: true,
                                clientX: rect.left + rect.width / 2, // Center of the element
                                clientY: rect.top + rect.height / 2
                            });

                            element.dispatchEvent(pointerUpEvent);

                            resolve(element);  // Pass the found element to the next .then()

                        }, 1000); // Add a slight delay to simulate real user action
                    });

                })
                .then(element => {
                    resolve(element);
                })
                .catch(err => {
                    reject(err);
                })

        }

        function clickOnElem(elem, offsetX = null, offsetY = null) { // offsetX and offsetY are optional, offsetY) {
            let rect = elem.getBoundingClientRect(),
                posX = rect.left, posY = rect.top; // get elems coordinates
            // calculate position of click
            if (typeof offsetX == 'number') posX += offsetX;
            else if (offsetX == 'center') {
                posX += rect.width / 2;
                if (offsetY == null) posY += rect.height / 2;
            }
            if (typeof offsetY == 'number') posY += offsetY;
            // create event-object with calculated position
            let evt = new MouseEvent('click', { bubbles: true, clientX: posX, clientY: posY });
            elem.dispatchEvent(evt); // trigger the event on elem
        }

        // Determine if the targetSelector is an element or needs querying
        let targetElement = typeof targetSelector === 'string'
            ? document.querySelector(targetSelector)
            : targetSelector;

        if (!targetElement) {
            reject(new Error('No valid target element found'));
            return;
        }

        switch (clickMethod) {
            case 'simulatePointerClick':
                simulatePointerClick(targetElement);
                break;
            case 'simulateFullDoubleClick':
                simulateFullDoubleClick(targetElement);
                break;
            case 'clickOnElem':
                clickOnElem(targetElement);
                break;
            default:
                // Simulate the full user interaction (mouseover, mousedown, click)
                simulateFullClick(targetElement);
                break;
        }

        // Timeout logic
        setTimeout(() => {
            resolve(targetElement); // Return the target element after timeout
        }, timeoutDuration);

    });
}

    return new Promise((resolve, reject) => {

        return tableCellClick({
            targetSelector: target_element, // Configurable target element
            clickMethod: 'simulateFullDoubleClick', 
            timeoutDuration: 1000, // Configurable timeout duration
        })
            .then(targetElement => {
                resolve(targetElement);  // Pass the found element to the next .then()
            })
            .catch(err => {
                reject(err);
            })

    })
        .then(() => {

            // Set value and text of target element
            target_element.value = text;
            target_element.textContent = text; // Use textContent for setting inner text
            doEvent(target_element, 'input');
            doEvent(target_element, 'change');

            // Attempt to set value and text of child elements
            try {
                if (target_element.firstElementChild) {
                    target_element.firstElementChild.value = text;
                    target_element.firstElementChild.textContent = text; // Use textContent
                    doEvent(target_element.firstElementChild, 'input');
                    doEvent(target_element.firstElementChild, 'change');
                }
            } catch (err) {
                console.error("Error setting firstElementChild:", err);
            }

            try {
                if (target_element.firstChild) {
                    target_element.firstChild.value = text;
                    target_element.firstChild.textContent = text; // Use textContent
                    doEvent(target_element.firstChild, 'input');
                    doEvent(target_element.firstChild, 'change');
                }
            } catch (err) {
                console.error("Error setting firstChild:", err);
            }

        })

}
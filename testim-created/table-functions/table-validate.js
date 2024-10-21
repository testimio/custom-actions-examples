/**
 *  Table - Validate
 *
 *      Validate table content
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) target table/grid
 * 
 *      expectedValues (JS) : expected cell values in the following format:
 * 
 *                              [
 *                                {"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                               ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                               ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                              ]
 * 
 *                            or for more advanced options
 * 
 *                              {
 *                                  "options": {
 *                                      "PK": null,
 *                                      "matchType": "exact"
 *                                  },
 *                                  "expectedValues": [
 *                                                      {"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                                                     ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                                                     ,{"<column name>":"<column value>", "<column name>":"<column value>", ...}
 *                                                    ]
 *                              }
 * 
 *      primaryKey (JS) [optional]
 *                   If you set PK then validation of that entry will be row specific by PK
 * 
 *      rowRanges [optional] : Defines the range of rows to process.
 *                          Example:  '2-4'       Rows 2, 3, 4
 *                                    '1,3,5'     Rows 1, 3, 5
 *                                    '2-4,6'     Rows 2, 3, 4, 6
 *                                    3           Rows 1-3
 *                                    <unset>     All rows
 *      colRanges [optional] : Defines the range of columns to process.
 *                          Example:  '1-3'       Columns 1, 2, 3
 *                                    '2,4-5'     Columns 2, 4, 5
 *                                    '1-2,4'     Columns 1, 2, 4
 *                                    3           Columns 1-3
 *                                    <unset>     All columns
 * 
 *      matchType [optional] : Text match type when searching for text in lists/selects
 *		            Examples: "exact" (default), "startswith", "endswith", "includes", "regex"
 *
 *      gridTypeSearchOrder (JS) [optional] : Custom grid(s) to consider ["VCGRID", "XGRID", "XGRIDRIGHT", "XGRIDLEFT", "TREEGRID", "IVGRID", "ROLETABLE", "KENDO", "AGGRID", "DEVEX", "SALESFORCE", "GRIDRIT", "EVTSHADOW", "HTMLTR", "HTMLTABLE", "HTML"] (Default)
 * 
 *      returnVariableName (JS) : string name of variable to store actual values in that can be used for setting expetedValues
 * 
 *      highlightElements (JS) [optional] : Highlight Target Grid, Header, RowGroup, Cells for posterity (and debugging)
 * 
 * Returns
 * 
 *      actualItems (or returnVariableName if specified) will contain actual cell values
 * 
 *  Notes
 * 
 *      When run without expectedValues being set the step will pass and simply return the actual values
 *          The data will be in the clipboard and the variable actualItems (or returnVariableName if specified)
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
 *      3.3.1     10/21/2024    Barry Solomon   Add VCGRID Support with Shadow DOM
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

/*** START COMMON TABLE FUNCTIONALITY ***/

var localGridSearchOrder = (typeof gridTypeSearchOrder !== 'undefined' && gridTypeSearchOrder !== null) ? gridTypeSearchOrder : ["BESTMATCH"]; // ["VCGRID", "XGRID", "XGRIDRIGHT", "XGRIDLEFT", "TREEGRID", "IVGRID", "ROLETABLE", "KENDO", "AGGRID", "DEVEX", "SALESFORCE", "GRIDRIT", "EVTSHADOW", "HTMLTR", "HTMLTABLE", "HTML"];

var target_element_xpath = null;
if (typeof targetElementXPath !== 'undefined' && targetElementXPath !== null)
    target_element_xpath = targetElementXPath;

// var rowRanges = undefined; // default is 50
// var colRanges = undefined; // default is 20
// var highlightDuration = undefined; // milliseconds.  Default is 2000 ms

var verbose = true;

var DEFAULT_RETURN_VARIABLE_NAME = 'actualItems';

/*** TABLE FUNCTIONS v3.3.1 ***/
var c=N;(function(Q,V){var d=N,e=Q();while(!![]){try{var w=parseInt(d(0x144))/0x1*(parseInt(d(0x1ca))/0x2)+-parseInt(d(0x176))/0x3*(-parseInt(d(0x19e))/0x4)+parseInt(d(0x1ac))/0x5+-parseInt(d(0x1a3))/0x6+-parseInt(d(0x1e0))/0x7+-parseInt(d(0xfe))/0x8*(parseInt(d(0x1e1))/0x9)+parseInt(d(0x134))/0xa;if(w===V)break;else e['push'](e['shift']());}catch(a){e['push'](e['shift']());}}}(x,0x351f1));var DEFAULT_HIGHLIGHT_DURATION=0x1388,DEFAULT_RETURN_VARIABLE_NAME=c(0x1c4),DEFAULT_MAX_ROWS=0x32,DEFAULT_MAX_COLUMNS=0x14,DEFAULT_DELIMITER='\x0a',DEFAULT_GRID_SEARCH_ORDER=['VCGRID',c(0x138),c(0xf0),c(0x12c),c(0x18a),c(0xf4),c(0x1e5),'KENDO',c(0x15b),c(0x1ad),c(0x114),c(0x185),'EVTSHADOW','HTMLTR',c(0x16b),c(0xef)],return_variable_name=undefined,grid_type_search_order=typeof gridTypeSearchOrder!==c(0x172)&&gridTypeSearchOrder!==null?gridTypeSearchOrder:typeof localGridSearchOrder!=='undefined'&&localGridSearchOrder!==null?localGridSearchOrder:DEFAULT_GRID_SEARCH_ORDER,compare_expression='==',row_selector=undefined,column_selector=undefined,matchtype=undefined,order_direction=undefined,page_size=undefined,page_number=undefined,search_string=undefined,highlight_elements=![],highlight_grid=![],highlight_headers=![],highlight_rowgroup=![],highlight_rows=![],highlight_cells=![],highlight_target_row=![],highlight_target_cell=![],highlight_pager=![],highlight_pager_pages=![],highlight_pager_sizes=![],highlight_duration=DEFAULT_HIGHLIGHT_DURATION;typeof highlightDuration!==c(0x172)&&highlightDuration!==null&&(highlight_duration=highlightDuration);var row_ranges=DEFAULT_MAX_ROWS,col_ranges=DEFAULT_MAX_COLUMNS;typeof rowRanges!==c(0x172)&&rowRanges!==null&&(row_ranges=rowRanges);typeof colRanges!==c(0x172)&&colRanges!==null&&(col_ranges=colRanges);function findVCShadowRoots(Q=document[c(0x146)]){const V=[];function e(w){var H=N;w[H(0x1a4)]&&w[H(0xfc)][H(0xe7)]()[H(0x12e)]('vc-grid')&&V[H(0x1b2)](w[H(0x1a4)]),w[H(0x16a)][H(0xfa)](a=>{e(a);});}return e(Q),V;}var grid_definitions=[{'Name':c(0x165),'Definitions':[{'custom_grid_selector':{'tagName':c(0x151),'querySelector':c(0x132),'shadowRoot':!![]},'custom_headergroup_selector':{'tagName':c(0x151),'attributeName':'class','attributeValue':'header','querySelector':'div.core\x20div.header','shadowRoot':!![]},'custom_header_cell_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0xec),'querySelector':'div.cell-header','shadowRoot':![]},'custom_rowgroup_selector':{'tagName':c(0x151),'attributeName':'class','attributeValue':c(0xf6),'querySelector':c(0x1f3),'shadowRoot':!![]},'custom_row_selector':{'tagName':'div','attributeName':'class','attributeValue':c(0x14c),'querySelector':'div.row','shadowRoot':![]},'custom_cell_selector':{'tagName':c(0x151),'attributeName':'class','attributeValue':'cell','querySelector':c(0x195),'shadowRoot':![]}}]},{'Name':c(0x12c),'Definitions':[{'custom_grid_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':'grid','nth_child':0x0,'querySelector':'div[role=\x22grid\x22]'},'custom_headergroup_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x1c5),'nth_child':0x0,'querySelector':'div[class*=\x27x-grid-header-ct\x27]'},'custom_header_cell_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x119),'nth_child':0x0,'querySelector':c(0x113)},'custom_rowgroup_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x193),'nth_child':0x0,'querySelector':c(0x118)},'custom_row_selector':{'tagName':'tr','querySelector':c(0x1df)},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':c(0xf0),'Definitions':[{'custom_grid_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':'grid','nth_child':0x0,'querySelector':'div[role=\x22grid\x22]'},'custom_headergroup_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x1c5),'nth_child':0x1,'querySelector':c(0x120)},'custom_header_cell_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x119),'nth_child':0x0,'querySelector':'div[class*=\x27x-column-header\x27][role=\x27columnheader\x27]'},'custom_rowgroup_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':'x-grid-scrollbar-clipper','nth_child':0x1,'querySelector':c(0x118)},'custom_row_selector':{'tagName':'tr','querySelector':c(0x1df)},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':c(0xf4),'Definitions':[{'custom_grid_selector':{'tagName':c(0x151),'attributeName':'data-iv-control-type-name','attributeValue':c(0x157),'nth_child':0x0,'querySelector':'div[data-iv-control-type-name=\x22grid\x22]'},'custom_headergroup_selector':{'tagName':c(0x15f),'nth_child':0x0,'querySelector':'thead'},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_rowgroup_selector':{'tagName':c(0x104),'nth_child':0x0,'querySelector':c(0x104)},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'},'ignore_blank_headers':!![]}]},{'Name':c(0x115),'Definitions':[{'custom_grid_selector':{'tagName':c(0x151),'attributeName':'role','attributeValue':c(0x18f),'nth_child':0x0,'querySelector':c(0x1cf)},'custom_headergroup_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':c(0x11c),'nth_child':0x0,'querySelector':'div[role=\x27rowgroup\x27][class*=\x27x-grid-header-ct\x27]'},'custom_header_cell_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':c(0x12a),'nth_child':0x0,'querySelector':c(0xe8)},'custom_rowgroup_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':'x-grid-item-container','nth_child':0x0,'querySelector':'div[class*=\x27x-grid-item-container\x27][role=\x27presentation\x27]'},'custom_row_selector':{'tagName':'tr','attributeName':c(0xf9),'attributeValue':'row','nth_child':0x0,'querySelector':c(0x1ef)},'custom_cell_selector':{'tagName':'td','attributeName':c(0xf9),'attributeValue':'gridcell','nth_child':0x0,'querySelector':'td[role=\x27gridcell\x27][class*=\x27x-grid-cell\x27]'}}]},{'Name':c(0x18a),'Definitions':[{'custom_grid_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':'treegrid','nth_child':0x0,'querySelector':c(0x1d9)},'custom_headergroup_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x1c5),'nth_child':0x0,'querySelector':'div[class*=\x27x-grid-header-ct\x27]'},'custom_header_cell_selector':{'tagName':c(0x151),'attributeName':'class','attributeValue':c(0x119),'nth_child':0x0,'querySelector':c(0x113),'ignore_separator_headers':!![]},'custom_rowgroup_selector':{'tagName':'div','attributeName':c(0x16f),'attributeValue':c(0x136),'nth_child':0x0,'querySelector':c(0x1fb)},'custom_row_selector':{'tagName':'tr','querySelector':c(0x1df)},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':c(0xef),'Definitions':[{'custom_grid_selector':{'tagName':c(0x17a),'querySelector':c(0x17a)},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':c(0x1bd),'Definitions':[{'custom_grid_selector':{'tagName':c(0x17a),'querySelector':'table'},'custom_headergroup_selector':{'tagName':'tr','querySelector':c(0x107)},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_row_selector':{'tagName':'tr','querySelector':'tr:not(:first-child)'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':c(0x16b),'Definitions':[{'custom_grid_selector':{'tagName':'table','nth_child':0x0,'querySelector':c(0x17a)},'custom_header_cell_selector':{'tagName':'th','querySelector':c(0x17e)},'custom_row_selector':{'tagName':'tr','querySelector':'tbody\x20tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td,th'}}]},{'Name':'ROLETABLE','Definitions':[{'custom_grid_selector':{'tagName':'div','attributeName':'role','attributeValue':c(0x17a),'nth_child':0x0,'querySelector':c(0x1a6)},'custom_headergroup_selector':{'tagName':c(0x151),'attributeName':c(0x12f),'attributeValue':c(0x175),'nth_child':0x0,'querySelector':'div[data-subcomponent=\x22table-header-row\x22]'},'custom_header_cell_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':c(0x12a),'nth_child':0x0,'querySelector':c(0x1ae)},'custom_searchfield_selector':{'tagName':c(0x153),'attributeName':c(0x16f),'attributeValue':c(0x1a5),'nth_child':0x0,'querySelector':'input[type=\x27text\x27]'},'custom_row_selector':{'tagName':c(0x151),'attributeName':c(0x12f),'attributeValue':c(0x1ed),'nth_child':0x0,'querySelector':c(0xea)},'custom_cell_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':c(0x19a),'nth_child':0x0,'querySelector':c(0x140)}}]},{'Name':'EVTSHADOW','Definitions':[{'custom_grid_selector':{'tagName':c(0x183),'querySelector':'evt-grid','shadowRoot':!![]},'custom_header_cell_selector':{'tagName':'div','attributeName':c(0xf9),'attributeValue':'columnheader','querySelector':c(0x1ae),'shadowRoot':!![]},'custom_row_selector':{'tagName':c(0xff),'querySelector':c(0xff),'shadowRoot':!![]},'custom_cell_selector':{'tagName':c(0x14d),'querySelector':c(0x14d),'shadowDomPath':[c(0x1cb),'evt-card'],'shadowQuerySelector':c(0x1d2)}}]},{'Name':'SALESFORCE','Definitions':[{'custom_grid_selector':{'tagName':c(0x17a),'querySelector':c(0x17a)},'custom_headergroup_selector':{'tagName':c(0x15f),'querySelector':c(0x15f)},'custom_header_cell_selector':{'tagName':'th','querySelector':'th','sliceStart':0x1,'sliceEnd':0x2,'splitDelimiter':'\x0a','stringReplacements':[c(0x168)]},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':c(0x19d),'stringReplacements':['Sort\x0a']}}]},{'Name':c(0x158),'Definitions':[{'custom_grid_selector':{'tagName':c(0x151),'attributeName':c(0xf1),'attributeValue':c(0x157),'nth_child':0x0,'querySelector':c(0x1b0)},'custom_headergroup_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x186),'nth_child':0x0,'querySelector':'div[class*=\x27k-grid-header\x27]'},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_rowgroup_selector':{'tagName':'div','attributeName':c(0x194),'attributeValue':'class','nth_child':0x0,'querySelector':c(0xfd)},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':c(0x15b),'Definitions':[{'custom_grid_selector':{'tagName':c(0x151),'attributeName':'role','attributeValue':c(0x18f),'nth_child':0x0,'querySelector':c(0x1d9)},'custom_header_cell_selector':{'tagName':'div','attributeName':c(0xf9),'attributeValue':c(0x12a),'nth_child':0x0,'querySelector':'div[role=\x27columnheader\x27]'},'custom_searchfield_selector':{'tagName':c(0x153),'attributeName':c(0x16f),'attributeValue':c(0x1a5),'nth_child':0x0,'querySelector':'input[type=\x27text\x27]'},'custom_rowgroup_selector':{'tagName':'div','attributeName':c(0x1f6),'attributeValue':c(0x1fa),'nth_child':0x1,'querySelector':c(0x19c)},'custom_row_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':'row','nth_child':0x0,'querySelector':c(0x1f1)},'custom_cell_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':'gridcell','nth_child':0x0,'querySelector':c(0x155)}}]},{'Name':'DEVEX','Definitions':[{'custom_grid_selector':{'tagName':'div','attributeName':'role','attributeValue':c(0x157),'nth_child':0x0,'querySelector':'div[role=\x22grid\x22]'},'custom_headergroup_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x14f),'nth_child':0x0,'querySelector':'div[class*=\x27dx-datagrid-headers\x27]'},'custom_header_cell_selector':{'tagName':'td','attributeName':c(0xf9),'attributeValue':c(0x12a),'nth_child':0x0,'querySelector':'td[role=\x27columnheader\x27]'},'custom_searchfield_selector':{'tagName':c(0x153),'attributeName':c(0x16f),'attributeValue':c(0x1a5),'querySelector':'input[class*=\x27dx-texteditor-input\x27]'},'custom_pager_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x103),'querySelector':c(0x15a)},'custom_pager_pages_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':'dx-page','querySelector':c(0x10f)},'custom_pager_sizes_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x18d),'querySelector':c(0x179)},'custom_rowgroup_selector':{'tagName':c(0x151),'attributeName':'role','attributeValue':c(0x1d4),'nth_child':0x0,'querySelector':'div[class*=\x27dx-datagrid-rowsview\x27]'},'custom_row_selector':{'tagName':'tr','querySelector':c(0x1fd)},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':c(0x185),'Definitions':[{'custom_grid_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':'grid','nth_child':0x0,'querySelector':c(0x100)},'custom_header_cell_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':c(0x12a),'nth_child':0x0,'querySelector':c(0x1ae)},'custom_searchfield_selector':{'tagName':c(0x153),'attributeName':'class','attributeValue':c(0x1a5),'nth_child':0x0,'querySelector':c(0x1f0)},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':c(0x138),'Definitions':[{'custom_grid_selector':{'tagName':c(0x151),'attributeName':c(0xf9),'attributeValue':c(0x157),'nth_child':0x0,'querySelector':'div[role=\x22grid\x22]'},'custom_headergroup_selector':{'tagName':'div','attributeName':c(0x16f),'attributeValue':c(0x1c5),'nth_child':0x0,'querySelector':c(0x1e7)},'custom_header_cell_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x119),'nth_child':0x0,'querySelector':c(0x12d)},'custom_header_text_selector':{'tagName':c(0x122),'attributeName':'class','attributeValue':c(0x1b5),'nth_child':0x0,'querySelector':c(0x133)},'custom_rowgroup_selector':{'tagName':c(0x151),'attributeName':c(0x16f),'attributeValue':c(0x136),'nth_child':0x0,'querySelector':c(0x14e)},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]}];let active_grid_names=[],custom_grid_definitions=[];var current_grid_selector=null,current_pager_selector=null,current_pager_sizes_selector=null,current_pager_pages_selector=null,current_headergroup_selector=null,current_header_cell_selector=null,current_searchfield_selector=undefined,current_rowgroup_selector=null,current_row_selector=null,current_cell_selector=null,table=undefined,tableInfo=undefined,tableHeaders=undefined,tableRows=undefined,tableCells=undefined,tablePager=undefined,tableSearchField=undefined,table_header_cells=undefined,table_pager_pages=undefined,table_pager_sizes=undefined,table_searchfield=undefined,table_columnnames=undefined,table_rows=undefined,table_cells=undefined,table_cell_values=undefined,table_column_values=undefined,TABLE_HIGHLIGHT_BORDER=c(0x1c3),TABLE_HEADERROW_HIGHLIGHT_BORDER=c(0x198),TABLE_HEADER_HIGHLIGHT_BORDER='2px\x20dashed\x20DarkOrange',TABLE_PAGER_HIGHLIGHT_BORDER=c(0x181),TABLE_PAGER_PAGES_HIGHLIGHT_BORDER=c(0x148),TABLE_PAGER_SIZES_HIGHLIGHT_BORDER=c(0x167),TABLE_ROWGROUP_HIGHLIGHT_BORDER='2px\x20solid\x20Blue',TABLE_ROW_HIGHLIGHT_BORDER=c(0x143),TABLE_TARGET_ROW_HIGHLIGHT_BORDER='2px\x20dashed\x20Red',TABLE_CELL_HIGHLIGHT_BORDER=c(0x173),TABLE_TARGET_CELL_HIGHLIGHT_BORDER='2px\x20solid\x20Red',TABLE_SEARCHFIELD_HIGHLIGHT_BORDER=c(0x1c1),TABLE_HEADERCELL_HIGHLIGHT_BORDER=c(0x1ec),TABLE_HEADERTEXT_HIGHLIGHT_BORDER=c(0x1ec),TABLE_HEADERGROUP_HIGHLIGHT_BORDER=c(0x1ec);function highlightElement(Q,V,e=highlight_duration){var n=c;if(!Q)return;const w=Q['style'][n(0x159)];Q[n(0x1b7)]['border']=V,(V!==TABLE_TARGET_CELL_HIGHLIGHT_BORDER||w===TABLE_CELL_HIGHLIGHT_BORDER)&&setTimeout(()=>{var C=n;Q[C(0x1b7)][C(0x159)]=w;},e);}function x(){var xs=['DEBUG:\x20current_header_cell_selector\x20querySelector:',')\x20must\x20contain\x20or\x20be\x20a\x20descendant\x20of\x20a\x20table\x20or\x20grid','mouseup','position','div[role=\x27cell\x27]','innerText','firstElementChild','2px\x20dashed\x20Blue','18316pjJnpR','?\x20checking\x20equality\x20','body','isArray','2px\x20solid\x20MagentaGrey','table_rows','DEBUG:\x20table_headers:','[Max\x20Depth\x20Reached]','row','evt-col','div[class=\x22x-grid-item-container\x22]','dx-datagrid-headers','host','div','createElement','input','Best\x20match\x20found:\x20','div[role=\x27gridcell\x27]','regex','grid','KENDO','border','div[class=\x27dx-pager\x27]','AGGRID','Target\x20element\x20(','left','-9999px','thead','match','\x20\x20column_selector','table_pager\x20=\x20','DEBUG:\x20Skipping\x20column\x20with\x20\x27Cell\x20value\x20has\x20been\x20edited\x27:','log','VCGRID','map','2px\x20dashed\x20MagentaGrey','Sort\x0a','table_searchfield\x20=\x20','childNodes','HTMLTABLE','Error\x20finding\x20target\x20row\x20[','exec','sliceEnd','class','shadowDomPath','removeAllRanges','undefined','2px\x20dashed\x20Green','nodeValue','table-header-row','11073iwalcQ','tableHeadersGet::\x20current_header_cell_selector\x20is\x20undefined.\x20Check\x20custom\x20table\x20entry','\x20\x20order_direction','div[class=\x27dx-page-size\x27]','table','ignore_blank_headers','querySelectorAll','index','thead\x20th','Row\x20','\x20\x20tableColumnNames.length:','2px\x20solid\x20Magenta','current_pager_sizes_selector\x20=\x20','evt-grid','custom_pager_selector','GRIDRIT','k-grid-header','keys','custom_headergroup_selector','trim','TREEGRID','DEBUG:\x20header_groups\x20found:','custom_header_cell_selector','dx-page-size','removeChild','treegrid','children','Search\x20Configuration','display','x-grid-scrollbar-clipper','k-grid-content','div.cell','top','none','2px\x20solid\x20Green','unselectable','cell','width','div[data-ref=\x27eBodyViewport\x27]','td,th','4LkXVcU','reduce','notexact','table_rows\x20=\x20','notstartswith','766542kwgLpw','shadowRoot','dx-texteditor-input','div[role=\x22table\x22]','split','getAttribute','includes','attributeName','call','2110150VhVIox','DEVEX','div[role=\x27columnheader\x27]','toUpperCase','div[data-role=\x22grid\x22]','Initialized\x20table_column_values\x20with\x20limited\x20columns:\x20','push','every','table_columnnames','x-column-header-text-inner','rowSelector','style','DEBUG:\x20table_columnnames:',',\x20target_row_column_value:','getRangeAt','custom_cell_selector','Options\x20are\x20NOT\x20in\x20','HTMLTR','message','mousedown','custom_searchfield_selector','2px\x20solid\x20Yellow','DEBUG:\x20No\x20header\x20cells\x20found.','3px\x20solid\x20Green','cellValue','x-grid-header-ct','absolute','Name','custom_row_selector','\x20\x20tableRows.length\x20>\x200','20iqWGAo','evt-card-menu','Instance','has','LAST','div[role=\x27treegrid\x27][class*=\x27x-grid\x27]','string','sliceStart','div[class*=\x27content\x27]','click','dx-datagrid-rowsview','rangeCount','readonly','DESCENDING','then','div[role=\x22treegrid\x22]','attributeValue','\x20\x20compare_expression','dispatchEvent','No\x20matching\x20grid\x20found.','[Circular]','div.x-grid-item-container\x20table.x-grid-item\x20tbody\x20tr','1149001iPohOY','1494yDdkQR','pointerdown','object','\x20with\x20selector:\x20','ROLETABLE','copy','div.x-grid-header-ct','endswith','name','html','shadowQuerySelector','2px\x20dashed\x20DarkOrange','table-row','from','tr[role=\x27row\x27][class*=\x27x-grid-row\x27]','input[type=\x27text\x27]','div[role=\x27row\x27]','join','div.core\x20div.content','error','\x20\x20target_row_id:','data-ref','mouseover','target_column_id\x20=\x20','custom','eBodyViewport','div[class*=\x27x-grid-item-container\x27][role=\x27presentation\x27]','height','tbody\x20tr','replace','info','addRange','DEBUG:\x20header_cells\x20found:','stringify','attributes','firstChild','toLowerCase','div[role=\x27columnheader\x27][class*=\x27x-column-header\x27]','catch','div[data-subcomponent=\x27table-row\x27]','pointerup','cell-header','getBoundingClientRect','number','HTML','XGRIDRIGHT','data-role',',\x20target_row_column_name:','textarea','IVGRID','value','content','DEBUG:\x20Selected\x20table_header_group:','simulatePointerClick','role','forEach','table_datarow_group\x20=\x20','tagName','div[data-role=\x22rowgroup\x22]','13208BsEuXA','evt-row','div[role=\x22grid\x22]','startswith','table_pager_pages\x20=\x20','dx-pager','tbody','\x20\x20grid_type_search_order','focus','tr:first-child','querySelector','length','exact','add','stringReplacements','debug','nth_child','div[class=\x27dx-page\x27]','FIRST','slice','Selecting\x20cells\x20in\x20row\x20','div[class*=\x27x-column-header\x27][role=\x27columnheader\x27]','SALESFORCE','XGRIDTR','setAttribute','table_row_count\x20=\x20','div[class*=\x27x-grid-scrollbar-clipper\x27]\x20div[role=\x27rowgroup\x27]\x20div[class*=\x27x-grid-item-container\x27]','x-column-header','getSelection','custom_grid_selector','rowgroup','custom_pager_sizes_selector','min','DEBUG:\x20Searching\x20for\x20Table\x20using\x20custom\x20grid\x20selector:','div[class*=\x27x-grid-header-ct\x27]','test','span','hasOwnProperty','definition','gridElement','custom_rowgroup_selector','DEBUG:\x20Skipping\x20unselectable\x20or\x20hidden\x20column:','unknown\x20element','tableFind:\x20','columnheader','endsWith','XGRIDLEFT','div.x-column-header[role=\x27columnheader\x27]','startsWith','data-subcomponent','custom_pager_pages_selector','DEBUG:\x20No\x20header\x20groups\x20found,\x20using\x20theTable\x20as\x20table_header_group.','div.core','span.x-column-header-text-inner','1746700hmmPkP','clickOnElem','x-grid-item-container','\x20with\x20score\x20','XGRID','\x20Cell\x20','ignore_separator_headers','\x20\x20target_row_column_id:'];x=function(){return xs;};return x();}function tableFind(Q){var O=c;verbose&&console[O(0x164)](O(0x129)+(Q[O(0xfc)]||O(0x128)));let V=Q,e=V[O(0xfc)]['toLowerCase']();var w=null;let a=[O(0x1f9)];!a[O(0x1a9)](e)&&(V=undefined,custom_grid_definitions['forEach'](F=>{var W=O;console[W(0x10d)](W(0x11f),F[W(0x11b)]?.['querySelector']);var Z=Q;if(V===undefined){if(F[W(0x11b)]?.['shadowRoot']){var z=findVCShadowRoots(element=document['body']);Z=z[0x0][W(0x150)];}F[W(0x11b)]?.[W(0x1a4)]?V=Z[W(0x1a4)][W(0x17c)](F[W(0x11b)]?.[W(0x108)])[F?.[W(0x10e)]??0x0]:V=Z[W(0x17c)](F['custom_grid_selector']?.['querySelector'])[F?.['nth_child']??0x0],typeof V!==W(0x172)&&V!==null&&(e=W(0x1f9),current_grid_selector=F[W(0x11b)],console[W(0x10d)]('DEBUG:\x20Found\x20custom\x20grid\x20selector:',current_grid_selector),w=F[W(0x1c7)],current_pager_selector=F[W(0x184)],current_pager_sizes_selector=F[W(0x11d)],current_pager_pages_selector=F[W(0x130)],current_searchfield_selector=F[W(0x1c0)],current_headergroup_selector=F[W(0x188)],current_header_cell_selector=F[W(0x18c)],current_rowgroup_selector=F['custom_rowgroup_selector'],current_row_selector=F[W(0x1c8)],current_cell_selector=F[W(0x1bb)]);}}));let S=[O(0x1f9),O(0x1ea)];if(!S[O(0x1a9)](e)){V=Q;while(!S[O(0x1a9)](e)){V=V['parentNode'],e=typeof V===O(0x172)||V==null||V[O(0xfc)]==null?'':V?.[O(0xfc)][O(0xe7)](),custom_grid_definitions[O(0xfa)](F=>{var E=O;let Z=F[E(0x11b)]?.[E(0x1aa)],z=F['custom_grid_selector']?.[E(0x1da)],i=F[E(0x11b)]?.['tagName'],A=V['attributes']!==undefined?V[E(0xe5)][Z]?.[E(0x174)]:null;e===i&&(Z===undefined||A===z)&&(e=E(0x1f9),w=F['Name'],current_grid_selector=F[E(0x11b)],current_pager_selector=F[E(0x184)],current_pager_sizes_selector=F[E(0x11d)],current_pager_pages_selector=F['custom_pager_pages_selector'],current_searchfield_selector=F[E(0x1c0)],current_headergroup_selector=F[E(0x188)],current_header_cell_selector=F[E(0x18c)],current_rowgroup_selector=F[E(0x126)],current_row_selector=F[E(0x1c8)],current_cell_selector=F[E(0x1bb)]);});}}if(highlight_elements&&highlight_grid&&V!==undefined&&V!==null)highlightElement(V,TABLE_HIGHLIGHT_BORDER);if(V===undefined||V===null)throw new Error(O(0x15c)+element['tagName']+'\x20==>\x20'+e+O(0x13d));return{'table':V,'gridType':w,'gridDefinition':current_grid_selector};}function findBestMatchingGrid(Q){var J=c;verbose&&console[J(0x164)](J(0x129)+(Q[J(0xfc)]||'unknown\x20element'));let V=null,e=-0x1;function w(A){var D=J;let K=[];for(let L of grid_definitions){for(let q of L['Definitions']){var k=A;if(q[D(0x11b)]?.[D(0x1a4)]){var m=findVCShadowRoots(k=document[D(0x146)]);k=m[0x0][D(0x150)];}let T=k[D(0x108)](q[D(0x11b)][D(0x108)]);if(q[D(0x11b)][D(0x1a4)])T=k['shadowRoot']['querySelector'](q['custom_grid_selector']['querySelector']);else T=k[D(0x108)](q[D(0x11b)][D(0x108)]);T&&K[D(0x1b2)]({'name':L['Name'],'gridElement':T,'definition':q});}}return K;}function a(A){var f=J;let K=0x0,{gridElement:k,definition:m}=A;if(k){let L=k['querySelectorAll'](m[f(0x18c)]?.[f(0x108)]||'');L['length']>0x0&&(K+=0x3);let q=k['querySelectorAll'](m['custom_row_selector']?.['querySelector']||'');q[f(0x109)]>0x0&&(K+=0x2);let T=k[f(0x17c)](m[f(0x1bb)]?.[f(0x108)]||'');T['length']>0x0&&(K+=0x1);}return K;}function S(A){var R=J;let K=w(A);if(K[R(0x109)]===0x0){let k=A;while(k&&k!==document){K=w(k);if(K[R(0x109)]>0x0)break;k=k['parentElement'];}}return K;}function F(A){var l=J;return A[l(0xfa)](K=>{let k=a(K);k>e&&(V=K,e=k);}),!V?(console['log'](l(0x1dd)),null):(console[l(0x164)](l(0x154)+V['name']+l(0x137)+e),Z(V[l(0x124)]),V[l(0x125)]);}function Z(A){var g=J;current_grid_selector=A[g(0x11b)],current_pager_selector=A[g(0x184)],current_pager_sizes_selector=A[g(0x11d)],current_pager_pages_selector=A[g(0x130)],current_searchfield_selector=A[g(0x1c0)],current_headergroup_selector=A['custom_headergroup_selector'],current_header_cell_selector=A[g(0x18c)],current_rowgroup_selector=A[g(0x126)],current_row_selector=A['custom_row_selector'],current_cell_selector=A['custom_cell_selector'];}let z=S(Q),i=F(z);if(i===undefined||i===null)throw new Error(J(0x15c)+Q[J(0xfc)]+')\x20must\x20contain\x20or\x20be\x20a\x20descendant\x20of\x20a\x20table\x20or\x20grid');return{'table':i,'gridType':V[J(0x1e9)],'gridDefinition':V['definition']};}function tableHeadersGet(Q){var Y=c;let V=null,e=[],w=[],a=[];if(!current_header_cell_selector)throw new Error(Y(0x177));V=Q;if(current_headergroup_selector){console[Y(0x10d)]('DEBUG:\x20current_headergroup_selector\x20querySelector:',current_headergroup_selector[Y(0x108)]);var S=null;current_headergroup_selector?.['shadowRoot']?S=Q['shadowRoot']['querySelectorAll'](current_headergroup_selector[Y(0x108)]):S=Q['querySelectorAll'](current_headergroup_selector[Y(0x108)]),console[Y(0x10d)](Y(0x18b),S['length']),S[Y(0x109)]>0x0?(V=S[current_headergroup_selector['nth_child']??0x0],console['debug'](Y(0xf7),V),highlight_elements&&highlight_headers&&V&&highlightElement(V,TABLE_HEADERROW_HIGHLIGHT_BORDER)):console['debug'](Y(0x131));}if(current_header_cell_selector&&V){console['debug'](Y(0x13c),current_header_cell_selector[Y(0x108)]);const Z=V[Y(0x17c)](current_header_cell_selector[Y(0x108)]);console[Y(0x10d)](Y(0x201),Z[Y(0x109)]);if(Z['length']>0x0){var F=-0x1;Z[Y(0xfa)](z=>{var G=Y;F++;if(z[G(0x1a8)](G(0x199))==='on'||z[G(0x1b7)][G(0x192)]===G(0x197)){console[G(0x10d)](G(0x127),z);return;}highlight_elements&&highlight_headers&&z&&highlightElement(z,TABLE_HEADER_HIGHLIGHT_BORDER);let i=z['innerText'][G(0x189)]();if(i[G(0x1a9)]('Cell\x20value\x20has\x20been\x20edited')){console[G(0x10d)](G(0x163),i);return;}try{let A=current_header_cell_selector['splitDelimiter']??DEFAULT_DELIMITER,K=current_header_cell_selector[G(0x1d1)]??0x0,k=current_header_cell_selector[G(0x16e)]??0x1,m=i['split'](A)[G(0x109)];if(K>m)K=-0x1;if(k>m)k=m;let L=i['split'](A)[G(0x111)](K,k);L['length']>=0x1&&(i=L[G(0x1f2)](A)[G(0x189)]()),current_header_cell_selector[G(0x10c)]&&current_header_cell_selector['stringReplacements'][G(0xfa)](q=>{var t=G;i=i[t(0x1fe)](q,'')[t(0x189)]();});}catch(q){console[G(0x1f4)]('Error\x20processing\x20column\x20name:',q[G(0x1be)]);}!(current_header_cell_selector[G(0x13a)]&&F>0x0&&is_separator_cell)&&!(current_header_cell_selector[G(0x17b)]&&F>0x0&&i==='')&&(a['push'](i),w[G(0x1b2)](z),e['push']({'index':e[G(0x109)],'text':i,'element':z}));});}else console['debug'](Y(0x1c2));}else console[Y(0x10d)]('DEBUG:\x20table_header_group\x20or\x20current_header_cell_selector\x20is\x20undefined.');return console['debug'](Y(0x14a),e),console[Y(0x10d)]('DEBUG:\x20table_header_cells:',w),console[Y(0x10d)](Y(0x1b8),a),{'table_header_group':V,'table_headers':e,'table_header_cells':w,'table_columnnames':a};}function tablePagerGet(Q){var P=c;let V=undefined,e=null,w=null;if(current_pager_selector!==undefined&&current_pager_selector!==null){V=Q[P(0x17c)](current_pager_selector['querySelector'])[current_pager_selector[P(0x10e)]??0x0];verbose&&console[P(0x164)](P(0x162),V);if(highlight_elements&&highlight_pager&&V!==undefined)highlightElement(V,TABLE_PAGER_HIGHLIGHT_BORDER);}if(current_pager_sizes_selector!==undefined&&current_pager_sizes_selector!==null){e=Q[P(0x17c)](current_pager_sizes_selector[P(0x108)]);verbose&&console['log'](P(0x182),current_pager_sizes_selector);if(highlight_elements&&highlight_pager_sizes&&e!==undefined)e[P(0xfa)](a=>{highlightElement(a,TABLE_PAGER_SIZES_HIGHLIGHT_BORDER);});}if(current_pager_pages_selector!==undefined&&current_pager_pages_selector!==null){w=Q['querySelectorAll'](current_pager_pages_selector[P(0x108)]);verbose&&console[P(0x164)](P(0x102),w);if(highlight_elements&&highlight_pager_pages&&w!==undefined)w['forEach'](a=>{highlightElement(a,TABLE_PAGER_PAGES_HIGHLIGHT_BORDER);});}return{'table_pager':V,'table_pager_sizes':e,'table_pager_pages':w};}function tableSearchFieldGet(Q){var X=c;let V=undefined;if(current_searchfield_selector!==undefined&&current_searchfield_selector!==null){V=Q[X(0x17c)](current_searchfield_selector['querySelector'])[current_searchfield_selector['nth_child']??0x0];verbose&&console['log'](X(0x169),V);if(highlight_elements&&highlight_pager&&V!==undefined)highlightElement(V,TABLE_SEARCHFIELD_HIGHLIGHT_BORDER);}return{'table_searchfield':V,'table_pager_sizes':table_pager_sizes,'table_pager_pages':table_pager_pages};}function tableRowsGet(Q){var U=c;let V=Q,e=null,w=0x0;if(typeof current_row_selector===U(0x172)||current_row_selector===null)throw new Error('current_row_selector\x20is\x20undefined.\x20Check\x20custom\x20table\x20entry');typeof current_rowgroup_selector!=='undefined'&&current_rowgroup_selector!==null&&(current_rowgroup_selector?.[U(0x1a4)]?V=Q['shadowRoot'][U(0x17c)](current_rowgroup_selector[U(0x108)])[current_rowgroup_selector[U(0x10e)]??0x0]:V=Q[U(0x17c)](current_rowgroup_selector[U(0x108)])[current_rowgroup_selector[U(0x10e)]??0x0],verbose&&console[U(0x164)](U(0xfb),V),highlight_elements&&highlight_rowgroup&&typeof V!==U(0x172)&&highlightElement(V,TABLE_ROWGROUP_HIGHLIGHT_BORDER),typeof V===U(0x172)&&(V=Q));current_row_selector?.[U(0x1a4)]?e=V[U(0x1a4)][U(0x17c)](current_row_selector['querySelector']):e=V[U(0x17c)](current_row_selector[U(0x108)]);let a=Array[U(0x1ee)](e),S=parseRanges(row_ranges,a[U(0x109)])||Array['from']({'length':a['length']},(F,Z)=>Z);return S=S['filter'](F=>F>=0x0&&F<a[U(0x109)]),S=S[U(0x111)](0x0,DEFAULT_MAX_ROWS),e=S[U(0x166)](F=>a[F]),w=e['length'],verbose&&(console[U(0x164)](U(0x1a1),safeLogObject(e)),console[U(0x164)](U(0x117),w)),{'table_datarow_group':V,'table_rows':e,'table_row_count':w};}function tableCellsGet(Q,V){var p=c;let e=[],w=[],a=Q[p(0x149)],S=V?.[p(0x1b4)]||[],F=parseRanges(col_ranges,S[p(0x109)]);V[p(0x1b4)]=F[p(0x166)](A=>S[A]);let Z=V[p(0x1b4)][p(0x19f)]((A,K)=>{return A[K]=[],A;},{});if(verbose)console[p(0x10d)](p(0x1b1)+JSON[p(0xe4)](Z));for(let A=0x0;A<a[p(0x109)];A++){let K=null,k;highlight_elements&&highlight_rows&&a[A]&&highlightElement(a[A],TABLE_ROW_HIGHLIGHT_BORDER);if(verbose)console['debug'](p(0x112)+A+p(0x1e4)+current_cell_selector['querySelector']);var z=null;current_cell_selector?.[p(0x1a4)]?z=a[A]?.['shadowRoot']['querySelectorAll'](current_cell_selector[p(0x108)]):z=a[A]?.[p(0x17c)](current_cell_selector['querySelector']);if(!z||z[p(0x109)]===0x0)continue;let m=Array[p(0x1ee)](z);z=F['map'](L=>m[L]);if(z?.[p(0x109)]>0x0){k={};let L=0x0;k[p(0x17d)]=A,z['forEach']((q,T)=>{var B=p;let r=V[B(0x1b4)][L++];var s=q;if(typeof current_cell_selector?.[B(0x170)]==='object'){var v=undefined;current_cell_selector[B(0x170)]['forEach'](j=>{var b=B;v===undefined?v=q[b(0x17c)](j)[0x0]:v=v[b(0x1a4)][b(0x150)][b(0x17c)](j)[0x0];}),v!==undefined&&(s=v[B(0x17c)](current_cell_selector[B(0x1eb)])[0x0]);}let h=s?s[B(0x141)]:'';if(verbose)console[B(0x10d)](B(0x17f)+A+B(0x139)+T+'\x20value:\x20'+h);current_cell_selector[B(0x10c)]!==undefined&&current_cell_selector['stringReplacements']['forEach'](j=>{var M=B;h=h[M(0x1fe)](j,'');}),k[r]=h,Z[r][B(0x1b2)](h),highlight_elements&&highlight_cells&&s&&highlightElement(s,TABLE_CELL_HIGHLIGHT_BORDER);}),K=k;}if(z?.[p(0x109)]>0x0)e['push'](z);K!==null&&w['push'](K);}return{'table_cells':e,'table_cell_values':w,'table_column_values':Z};}function N(Q,V){var e=x();return N=function(w,a){w=w-0xe4;var S=e[w];return S;},N(Q,V);}function tableRowFind(Q,V,e,w){var I=c;let a=-0x1,S,F,Z,z=0x0;switch(typeof e){case I(0xee):a=e;break;case'string':switch(e[I(0x1af)]()){case I(0x1ce):a=Q[I(0x109)]-0x1;break;case I(0x110):a=0x0;break;}break;case I(0x1e3):default:S=Object[I(0x187)](e)[0x0],F=e[S],z=Object['keys'](e)['includes'](I(0x1cc))?e[I(0x1cc)]:0x0;if(verbose)console[I(0x164)](I(0x1b6),e,I(0xf2),S,I(0x1b9),F,',\x20target_row_column_instance:',z);verbose&&(console[I(0x164)](I(0x180),V[I(0x109)]),console[I(0x164)]('\x20\x20tableRows.length:',Q[I(0x109)]));if(S!==I(0x17d)&&V[I(0x109)]>0x0){let i=-0x1;[]['forEach'][I(0x1ab)](V,function(A){i=++i;if(A===S)Z=i;});}if(Z==undefined&&!isNaN(S))Z=Number(S);verbose&&(console[I(0x164)](I(0x13b),Z),console[I(0x164)]('\x20\x20tableRows[0].children.length:',Q[0x0][I(0x190)][I(0x109)]));if(S[I(0xe7)]()===I(0x17d)){a=F;if(a<0x0)a=0x0;if(a>=Q['length'])a=Q[I(0x109)]-0x1;}else{if(Q[I(0x109)]>0x0&&(Z>=0x0&&Z<Q[0x0][I(0x190)]['length'])){let A=-0x1;if(verbose)console[I(0x164)](I(0x1c9));[]['forEach'][I(0x1ab)](Q,function(K){var u=I;A=++A;if(verbose)console[u(0x164)](u(0x145),K['children'][Z]?.[u(0x141)][u(0x189)]()+'\x20==\x20'+F);if(a==-0x1&&stringMatch[w](K[u(0x190)][Z]?.[u(0x141)][u(0x189)](),F)&&z-->=0x0){a=A;if(verbose)console['log']('\x20\x20\x20\x20==>\x20target_row_id\x20=\x20',a);}});}}break;}if(verbose)console['log'](I(0x1f5),a);if(a==-0x1)throw new Error(I(0x16c)+JSON[I(0xe4)](e)+']');if(highlight_elements&&highlight_target_row&&Q[a]!==undefined&&Q[a]!==null)highlightElement(Q[a],TABLE_TARGET_ROW_HIGHLIGHT_BORDER);return Q[a];}function tableCellFind(Q,V,e){var y=c;if(verbose)console[y(0x164)]('\x20\x20tableCellFind',Q,V);let w=null,a=-0x1;switch(typeof V){case'number':a=V<0x0?0x0:V>=Q[y(0x109)]?Q[y(0x109)]-0x1:V;break;case'string':default:switch(V['toUpperCase']()){case'LAST':a=Q[y(0x190)][y(0x109)]-0x1;break;case y(0x110):a=0x0;break;default:if(table_columnnames!==null&&table_columnnames[y(0x109)]>0x0){let S=-0x1;[][y(0xfa)]['call'](table_columnnames,function(F){S=++S,stringMatch[e](F['trim'](),V)&&(a=S);});}}}console[y(0x164)](y(0x1f8),a);if(a>-0x1)w=Q[y(0x190)][a];if(highlight_elements&&highlight_target_cell&&w!==undefined&&w!==null)highlightElement(w,TABLE_TARGET_CELL_HIGHLIGHT_BORDER);return w;}function tableCellClick({targetSelector:Q,clickMethod:clickMethod=c(0xf8),timeoutDuration:timeoutDuration=0x7d0}){return new Promise((V,e)=>{var x8=N;function w(Z){var o=N;try{const z=[o(0x1f7),o(0x1bf),o(0x13e),o(0x1d3)];z[o(0xfa)](i=>{var x0=o;const A=new MouseEvent(i,{'bubbles':!![],'composed':!![],'cancelable':!![],'view':window});Z[x0(0x1dc)](A);});}catch(i){e(i);}}function a(Z,z,i){var x3=N;return new Promise((A,K)=>{var x1=N;const k=Z[x1(0xed)](),m=new PointerEvent(x1(0x1e2),{'bubbles':!![],'cancelable':!![],'clientX':k['left']+k[x1(0x19b)]/0x2,'clientY':k['top']+k['height']/0x2});Z[x1(0x1dc)](m),setTimeout(()=>{var x2=x1;const L=new PointerEvent(x2(0xeb),{'bubbles':!![],'cancelable':!![],'clientX':k['left']+k[x2(0x19b)]/0x2,'clientY':k[x2(0x196)]+k[x2(0x1fc)]/0x2});Z[x2(0x1dc)](L),A(Z);},0x3e8);})[x3(0x1d8)](A=>{var x4=x3;A[x4(0x106)]();try{A[x4(0x142)]['click']();}catch(K){try{A[x4(0xe6)][x4(0x1d3)]();}catch(k){A[x4(0x1d3)]();}}return new Promise((m,L)=>{var x5=x4;const q=A[x5(0xed)](),T=new PointerEvent(x5(0x1e2),{'bubbles':!![],'cancelable':!![],'clientX':q['left']+q['width']/0x2,'clientY':q[x5(0x196)]+q[x5(0x1fc)]/0x2});A[x5(0x1dc)](T),setTimeout(()=>{var x6=x5;const r=new PointerEvent(x6(0xeb),{'bubbles':!![],'cancelable':!![],'clientX':q['left']+q['width']/0x2,'clientY':q[x6(0x196)]+q[x6(0x1fc)]/0x2});A[x6(0x1dc)](r),m(A);},0x3e8);});})[x3(0x1d8)](A=>{z(A);})[x3(0xe9)](A=>{i(A);});}function S(Z,z=null,i=null){var x7=N;let A=Z[x7(0xed)](),K=A[x7(0x15d)],k=A[x7(0x196)];if(typeof z=='number')K+=z;else{if(z=='center'){K+=A[x7(0x19b)]/0x2;if(i==null)k+=A[x7(0x1fc)]/0x2;}}if(typeof i==x7(0xee))k+=i;let m=new MouseEvent('click',{'bubbles':!![],'clientX':K,'clientY':k});Z['dispatchEvent'](m);}let F=typeof Q===x8(0x1d0)?document[x8(0x108)](Q):Q;if(!F){e(new Error('No\x20valid\x20target\x20element\x20found'));return;}switch(clickMethod){case x8(0xf8):a(F);break;case x8(0x135):S(F);break;default:w(F);break;}setTimeout(()=>{V(F);},timeoutDuration);});}function validateItemOrder(Q,V,e){var x9=c;let w=0x0,a=Object[x9(0x187)](Q),S=[];a[x9(0xfa)](Z=>{if(Z===V||w++===V)S=Q[Z];});let F;if(e[x9(0x1af)]()===x9(0x1d7))F=S[x9(0x111)](0x1)[x9(0x1b3)]((Z,z)=>!isNaN(Z)?Number(S[z])>=Number(Z):S[z]>=Z);else F=S[x9(0x111)](0x1)['every']((Z,z)=>!isNaN(Z)?Number(S[z])<=Number(Z):S[z]<=Z);if(!F)throw new Error(x9(0x1bc)+e+'\x20order:\x20\x0a'+JSON[x9(0xe4)](S,null,0x2));}function columnSum(Q,V){var xx=c;let e=0x0,w=0x0,a=Object[xx(0x187)](Q),S=[];return a['forEach'](F=>{if(F===V||e++===V)S=Q[F];}),w=S[xx(0x19f)]((F,Z)=>{var xN=xx,z=/\D*(\d+|\d.*?\d)(?:\D+(\d{2}))?\D*$/,i=z[xN(0x16d)](Z);if(i===null)return F;var A=parseFloat(i[0x1][xN(0x1fe)](/\D/,'')+'.'+(i[0x2]?i[0x2]:'00'));if(!isNaN(A))return Number(A)+F;},0x0),w;}const stringMatch={};stringMatch['exact']=function(Q,V){return Q===V;},stringMatch[c(0x101)]=function(Q,V){var xQ=c;return Q[xQ(0x12e)](V);},stringMatch[c(0x1e8)]=function(Q,V){var xV=c;return Q[xV(0x12b)](V);},stringMatch[c(0x1a9)]=function(Q,V){var xe=c;return Q[xe(0x1a9)](V);},stringMatch['contains']=function(Q,V){var xw=c;return Q[xw(0x1a9)](V);},stringMatch[c(0x1a0)]=function(Q,V){return Q!==V;},stringMatch[c(0x1a2)]=function(Q,V){var xa=c;return!Q[xa(0x12e)](V);},stringMatch['notendswith']=function(Q,V){var xS=c;return!Q[xS(0x12b)](V);},stringMatch['notincludes']=function(Q,V){var xF=c;return!Q[xF(0x1a9)](V);},stringMatch['notcontains']=function(Q,V){var xZ=c;return!Q[xZ(0x1a9)](V);},stringMatch[c(0x156)]=function(Q,V){var xz=c;const e=V[xz(0x160)](/\/(.+?)\/([a-z]*)$/);if(e){const w=e[0x1],a=e[0x2],S=new RegExp(w,a);return S[xz(0x121)](Q);}else{const F=new RegExp(V);return F[xz(0x121)](Q);}};const copyToClipboard=Q=>{var xi=c;const V=document[xi(0x152)](xi(0xf3));V[xi(0xf5)]=Q,V[xi(0x116)](xi(0x1d6),''),V[xi(0x1b7)][xi(0x13f)]=xi(0x1c6),V[xi(0x1b7)][xi(0x15d)]=xi(0x15e),document[xi(0x146)]['appendChild'](V);const e=document['getSelection']()[xi(0x1d5)]>0x0?document[xi(0x11a)]()[xi(0x1ba)](0x0):![];V['select'](),document['execCommand'](xi(0x1e6)),document[xi(0x146)][xi(0x18e)](V),e&&(document['getSelection']()[xi(0x171)](),document[xi(0x11a)]()[xi(0x200)](e));};function safeLogObject(Q,V=0x0,e=0x3){var xA=c;if(V>e)return xA(0x14b);if(typeof Q!=='object'||Q===null)return Q;const w=new WeakSet();function a(S,F){var xK=xA;if(F>e||S===null||typeof S!==xK(0x1e3))return S;if(w[xK(0x1cd)](S))return xK(0x1de);w[xK(0x10b)](S);const Z=Array[xK(0x147)](S)?[]:{};for(const z in S){Object['prototype'][xK(0x123)][xK(0x1ab)](S,z)&&(Z[z]=a(S[z],F+0x1));}return w['delete'](S),Z;}return a(Q,V);}function parametersProcess(){var xk=c;if(typeof element===xk(0x172)||element===null)throw new Error('Target\x20table/grid\x20is\x20undefined');return_variable_name=DEFAULT_RETURN_VARIABLE_NAME;if(typeof returnVariableName!==xk(0x172)&&returnVariableName!==null)return_variable_name=returnVariableName;typeof highlightElements!==xk(0x172)&&highlightElements===!![]&&(highlight_elements=!![],highlight_grid=!![],highlight_pager=!![],highlight_pager_sizes=!![],highlight_pager_pages=!![],highlight_headers=!![],highlight_rowgroup=!![],highlight_rows=!![],highlight_cells=!![],highlight_target_row=!![],highlight_target_cell=!![]);if(typeof gridTypeSearchOrder===xk(0x1d0))grid_type_search_order=[gridTypeSearchOrder['toUpperCase']()];if(typeof gridTypeSearchOrder===xk(0x1e3)&&Array[xk(0x147)](gridTypeSearchOrder))grid_type_search_order=gridTypeSearchOrder;if(typeof customGridSelectors==='object'&&customGridSelectors!==null)custom_grid_definitions=customGridSelectors;else grid_type_search_order['forEach'](Q=>{var xm=xk;grid_definitions[xm(0xfa)](V=>{var xL=xm;Q===V['Name']&&(V['Definitions'][xL(0xfa)](e=>{var xq=xL;custom_grid_definitions[xq(0x1b2)](e);}),active_grid_names[xL(0x1b2)](V[xL(0x1c7)]));});});verbose&&(console[xk(0x164)]('grid_type_search_order:\x20'+JSON[xk(0xe4)](grid_type_search_order)),console['log']('custom_grid_definitions:\x20'+JSON['stringify'](custom_grid_definitions)));matchtype=xk(0x10a);if(typeof matchType!=='undefined'&&matchType!==null)matchtype=matchType;row_selector={'index':0x0};typeof rowSelector!==xk(0x172)&&rowSelector!==null&&(row_selector=typeof rowSelector===xk(0xee)?{'index':rowSelector}:rowSelector);column_selector=0x0;typeof columnSelector!==xk(0x172)&&columnSelector!==null&&(column_selector=columnSelector);typeof pageSize!==xk(0x172)&&pageSize!==null&&(page_size=pageSize);typeof pageNumber!==xk(0x172)&&pageNumber!==null&&(page_number=pageNumber);typeof searchString!=='undefined'&&searchString!==null&&(search_string=searchString);compare_expression='==';if(typeof compareExpression!==xk(0x172)&&compareExpression!==null){compare_expression=compareExpression;if(compare_expression=='=')compare_expression='=';}order_direction='ASCENDING',typeof sortOrder!==xk(0x172)&&sortOrder!==null&&(order_direction=sortOrder[xk(0x1af)]()),verbose&&(console[xk(0x1ff)](xk(0x191)),console[xk(0x1ff)](xk(0x105),grid_type_search_order),console[xk(0x1ff)]('\x20\x20row_selector',row_selector),console['info'](xk(0x161),column_selector),console[xk(0x1ff)]('\x20\x20matchtype',matchtype),console[xk(0x1ff)](xk(0x1db),compare_expression),console[xk(0x1ff)](xk(0x178),order_direction),console[xk(0x1ff)]('\x20\x20return_variable_name',return_variable_name));}function parseRanges(Q,V){var xT=c;if(typeof Q===xT(0xee))return Array['from']({'length':Math[xT(0x11e)](Q,V)},(a,S)=>S);if(typeof Q!==xT(0x1d0)||!Q[xT(0x189)]())return Array[xT(0x1ee)]({'length':V},(a,S)=>S);let e=Q[xT(0x1a7)](','),w=[];return e[xT(0xfa)](a=>{var xr=xT;let [S,F]=a[xr(0x1a7)]('-')[xr(0x166)](Number);if(isNaN(S))return;isNaN(F)&&(F=S);for(let Z=S;Z<=F;Z++){Z<=V&&w['push'](Z-0x1);}}),w[xT(0x111)](0x0,V);}

stringMatch['regex'] = function (str, regexPattern) {
    const patternParts = regexPattern.match(/\/(.+?)\/([a-z]*)$/);
    if (patternParts) {
        const pattern = patternParts[1];  // the regex pattern itself
        const flags = patternParts[2];    // the flags (e.g., "i", "g", "ig")
        const regex = new RegExp(pattern, flags);
        return regex.test(str);
    } else {
        // If no flags are provided, assume the entire input is the pattern without slashes
        const regex = new RegExp(regexPattern);
        return regex.test(str);
    }
};

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

tableHeaders = tableHeadersGet(table);
tablePager = tablePagerGet(table);
tableSearchField = tableSearchFieldGet(table);
tableRows = tableRowsGet(table, tableHeaders);
tableCells = tableCellsGet(tableRows, tableHeaders);

if (verbose) {
    console.log("===> table", table);
    console.log("===> tablePager", tablePager);
    console.log("===> tableSearchField", tableSearchField);
    console.log("===> tableHeaders", tableHeaders);
    console.log("===> tableRows", tableRows);
    console.log("===> tableCells", tableCells);
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

exportsTest["tableHTML"] = table.outerHTML;
exportsTest["tableColumnNames"] = table_columnnames;
exportsTest["tableCellValues"] = table_cell_values;

/*** END COMMON TABLE FUNCTIONALITY ***/

/*** Function Specific Logic Below ***/

let actual_values = table_cell_values;

exportsTest[return_variable_name] = actual_values;
console.log("actual_values", JSON.stringify(actual_values));
copyToClipboard(JSON.stringify(actual_values));

// Validate
//
function validateDataSet(actualValues, options, expectedValues) {

    if (verbose)
        console.log("validateItems called");

    let result = true;
    let expected_values;
    let actual_values;
    let row_differences;
    let differences = [];

    let pk = null;
    let matchtype = "exact";
    if (typeof options !== 'undefined' && options !== null) {
        pk = options["PK"];
        matchtype = options["matchType"].toLowerCase();
    }

    for (let evid = 0; evid < expectedValues.length; evid++) {

        row_differences = {};
        expected_values = expectedValues[evid];

        let _e_index = Object.keys(expected_values).includes("index") ? expected_values["index"] : evid;

        /* if PK is defined then use it to find the target row for comparison
         */
        if (pk != null) {
            let target_row = actualValues.find(row => row[pk] === expected_values[pk]);
            actual_values = target_row;
        }
        else {
            actual_values = actualValues.find(a => a?.index === _e_index);
            if (actual_values !== undefined && actual_values !== null) {
                actual_values = actualValues[evid];
            }
        }

        if (typeof expected_values === 'string' && typeof actual_values === 'string') {

            if (!stringMatch[matchtype](actual_values, expected_values)) {
                row_differences[evid] = { "row": evid, "Actual": actual_values, "Expected": expected_values, "MatchType": matchtype };
                if (result)
                    result = false;
            }

        }
        else {

            if (typeof actual_values === 'undefined' || actual_values === null) {
                console.warn("    MISMATCH:: Expected: [" + JSON.stringify(expected_values) + "], \nActual: UNDEFINED, MatchType: [" + matchtype + "]");
                row_differences[evid] = { "row": _e_index, "Actual": "undefined", "Expected": expected_values };
                continue;
            }

            for (let key in expected_values) {

                if (key === 'index')
                    continue;

                if (verbose)
                    console.log("Validate " + key + "Expected: [" + expected_values[key] + "], Actual:[" + actual_values[key] + "], MatchType: [" + matchtype + "]");

                if (Object.keys(actual_values).includes(key)) {

                    if (!stringMatch[matchtype](actual_values[key].toString(), expected_values[key].toString())) {

                        row_differences[key] = { "row": _e_index, "Actual": actual_values[key], "Expected": expected_values[key], "MatchType": matchtype };
                        if (result)
                            result = false;
                        if (verbose)
                            console.log("    MISMATCH:: " + key + " => \nExpected: [" + expected_values[key] + "], \nActual: [" + actual_values[key] + "], \nMatchType: [" + matchtype + "]");

                    }
                }
            }
        }
        if (Object.keys(row_differences).length > 0)
            differences.push(row_differences);
    }

    // If failed, echo to console and report an error
    //
    if (!result) {
        if (verbose) {
            console.log("expected_values", JSON.stringify(expectedValues));
            console.log("actual_values", JSON.stringify(actualValues));
        }
        console.log("Table - Data Results Validate: ", JSON.stringify(differences, null, 2));
        throw new Error("Table - Data Validate\n" + JSON.stringify(differences, null, 2));
    }

    return result;
}

if (typeof expectedValues !== 'undefined' && expectedValues !== null) {

    var expected_results = {};
    expected_results["options"] = { "PK": null, "matchType": "exact" };
    expected_results["expectedValues"] = tableRows?.table_row_values;
    exportsTest['expected_results'] = expected_results;
    console.log('expected_results', JSON.stringify(expected_results, null, 2));

    let options = null;
    let expected_values = expectedValues;
    if (!Array.isArray(expectedValues)) {
        options = expectedValues["options"];
        expected_values = expectedValues["expectedValues"];
    }
    if (options == null) {
        options = {
            "matchType": (typeof matchType !== 'undefined' && matchType !== null) ? matchType : "exact",
            "PK": (typeof primaryKey !== 'undefined' && primaryKey !== null) ? primaryKey : null,
        }
    }
    validateDataSet(actual_values, options, expected_values);

}
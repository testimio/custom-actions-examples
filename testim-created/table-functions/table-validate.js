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
 *      returnVariableName (JS) : string name of variable to store actual values in that can be used for setting expetedValues
 * 
 *      primaryKey (JS) [optional]
 *                   If you set PK then validation of that entry will be row specific by PK
 * 
 *      matchType [optional] : Text match type when searching for text in lists/selects
 *		            Examples: exact (default), startswith, endswith, includes 
 *
 *      gridTypeSearchOrder (JS) [optional] : Order of custom grid(s) to consider (Default is ["KENDO", "AGGRID", "DEVEX", "HTML", "SALESFORCE"])
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
 *      2.2.2     07/20/2022 Barry Solomon   Fixed row identification if rowgroup is not defined
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

var verbose = false;

var DEFAULT_RETURN_VARIABLE_NAME = 'actualItems';

/*** TABLE FUNCTIONS v2.2.2 ***/
var _0x35ad72=_0x4ec3;(function(_0x27bb35,_0x2a6575){var _0x4913c0=_0x4ec3,_0xd63527=_0x27bb35();while(!![]){try{var _0x19488d=parseInt(_0x4913c0(0x24e,'VrPS'))/0x1*(parseInt(_0x4913c0(0x2a6,'*FDS'))/0x2)+-parseInt(_0x4913c0(0x2ea,'VrPS'))/0x3+parseInt(_0x4913c0(0x1f6,'t!Zl'))/0x4+parseInt(_0x4913c0(0x2d1,'VhMo'))/0x5+-parseInt(_0x4913c0(0x2c2,'wZB]'))/0x6*(parseInt(_0x4913c0(0x252,'NQ]#'))/0x7)+parseInt(_0x4913c0(0x1f3,'6acP'))/0x8*(parseInt(_0x4913c0(0x2f0,'yb!z'))/0x9)+-parseInt(_0x4913c0(0x2bd,'*FDS'))/0xa;if(_0x19488d===_0x2a6575)break;else _0xd63527['push'](_0xd63527['shift']());}catch(_0x1fcc5f){_0xd63527['push'](_0xd63527['shift']());}}}(_0xa269,0x66a40));var DEFAULT_DELIMITER='\x0a',return_variable_name=undefined,grid_type_search_order=[_0x35ad72(0x241,'MpN6'),'AGGRID','DEVEX','HTML',_0x35ad72(0x2c1,'qhjh')],compare_expression='==',row_selector=undefined,column_selector=undefined,matchtype=undefined,order_direction=undefined,page_size=undefined,page_number=undefined,search_string=undefined,highlight_elements=![],highlight_grid=![],highlight_headers=![],highlight_rowgroup=![],highlight_rows=![],highlight_cells=![],highlight_target_row=![],highlight_target_cell=![],highlight_pager=![],highlight_pager_pages=![],highlight_pager_sizes=![],TABLE_HIGHLIGHT_BORDER='3px\x20solid\x20Green',TABLE_HEADERROW_HIGHLIGHT_BORDER='2px\x20solid\x20Green',TABLE_HEADER_HIGHLIGHT_BORDER='2px\x20dashed\x20DarkOrange',TABLE_PAGER_HIGHLIGHT_BORDER=_0x35ad72(0x26e,'5a!#'),TABLE_PAGER_PAGES_HIGHLIGHT_BORDER=_0x35ad72(0x2e5,'wZB]'),TABLE_PAGER_SIZES_HIGHLIGHT_BORDER=_0x35ad72(0x2c3,'5a!#'),TABLE_ROWGROUP_HIGHLIGHT_BORDER=_0x35ad72(0x270,'A2(L'),TABLE_ROW_HIGHLIGHT_BORDER=_0x35ad72(0x2ab,'sm4&'),TABLE_TARGET_ROW_HIGHLIGHT_BORDER='2px\x20dashed\x20Red',TABLE_CELL_HIGHLIGHT_BORDER=_0x35ad72(0x2b7,'49k8'),TABLE_TARGET_CELL_HIGHLIGHT_BORDER=_0x35ad72(0x25c,'WkEz'),grid_definitions=[{'Name':_0x35ad72(0x244,'yb!z'),'Definitions':[{'custom_grid_selector':{'tagName':_0x35ad72(0x284,'wZB]'),'querySelector':_0x35ad72(0x266,'zMVz')},'custom_headergroup_selector':{'tagName':'thead','querySelector':_0x35ad72(0x2a4,'cYkC')},'custom_header_cell_selector':{'tagName':'th','querySelector':'th','sliceIndex':0x1,'splitDelimiter':'\x0a','stringReplacements':[_0x35ad72(0x26b,'49k8')]},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':_0x35ad72(0x2cd,'Mkne'),'stringReplacements':['Sort\x0a']}}]},{'Name':_0x35ad72(0x2e4,'WkEz'),'Definitions':[{'custom_grid_selector':{'tagName':_0x35ad72(0x1fe,'F$I2'),'attributeName':_0x35ad72(0x294,'BI0Y'),'attributeValue':_0x35ad72(0x1cd,'qhjh'),'nth_child':0x0,'querySelector':_0x35ad72(0x2a9,'ZiK2')},'custom_headergroup_selector':{'tagName':_0x35ad72(0x2cb,'VhMo'),'attributeName':_0x35ad72(0x298,'o5rR'),'attributeValue':_0x35ad72(0x1df,'AS%0'),'nth_child':0x0,'querySelector':_0x35ad72(0x201,'F$I2')},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_rowgroup_selector':{'tagName':_0x35ad72(0x297,'qhjh'),'attributeName':_0x35ad72(0x1f5,'yb!z'),'attributeValue':_0x35ad72(0x1c2,'Mkne'),'nth_child':0x0,'querySelector':_0x35ad72(0x1fc,'zMVz')},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':_0x35ad72(0x260,'8It@'),'Definitions':[{'custom_grid_selector':{'tagName':_0x35ad72(0x290,'#AX9'),'attributeName':_0x35ad72(0x224,'h(tc'),'attributeValue':_0x35ad72(0x2af,'WbYr'),'nth_child':0x0,'querySelector':_0x35ad72(0x2ad,'*ed5')},'custom_header_cell_selector':{'tagName':_0x35ad72(0x2a3,'zMVz'),'attributeName':_0x35ad72(0x23a,'VhMo'),'attributeValue':'columnheader','nth_child':0x0,'querySelector':_0x35ad72(0x1cb,'NQ]#')},'custom_searchfield_selector':{'tagName':'input','attributeName':_0x35ad72(0x2f3,'wZB]'),'attributeValue':_0x35ad72(0x227,'o5rR'),'nth_child':0x0,'querySelector':'input[type=\x27text\x27]'},'custom_rowgroup_selector':{'tagName':_0x35ad72(0x1e8,'YenR'),'attributeName':'role','attributeValue':_0x35ad72(0x1e4,'yb!z'),'nth_child':0x2,'querySelector':_0x35ad72(0x2aa,'AS%0')},'custom_row_selector':{'tagName':_0x35ad72(0x23d,'BI0Y'),'attributeName':_0x35ad72(0x2a5,'&phX'),'attributeValue':_0x35ad72(0x2de,'&phX'),'nth_child':0x0,'querySelector':_0x35ad72(0x2c9,'rclK')},'custom_cell_selector':{'tagName':_0x35ad72(0x1e5,'^KDP'),'attributeName':_0x35ad72(0x230,'jF6T'),'attributeValue':'gridcell','nth_child':0x0,'querySelector':_0x35ad72(0x1d9,'EHpF')}}]},{'Name':_0x35ad72(0x292,'ZiK2'),'Definitions':[{'custom_grid_selector':{'tagName':'table','querySelector':_0x35ad72(0x2a1,'#AX9')},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_row_selector':{'tagName':'tr','querySelector':_0x35ad72(0x206,'WkEz')},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':_0x35ad72(0x1ff,'8CyI'),'Definitions':[{'custom_grid_selector':{'tagName':_0x35ad72(0x21d,'fwk$'),'attributeName':_0x35ad72(0x264,'ha(v'),'attributeValue':_0x35ad72(0x1e3,'&phX'),'nth_child':0x0,'querySelector':_0x35ad72(0x268,'fwk$')},'custom_headergroup_selector':{'tagName':'div','attributeName':_0x35ad72(0x225,'VrPS'),'attributeValue':_0x35ad72(0x22d,'dzqu'),'nth_child':0x0,'querySelector':_0x35ad72(0x2ca,'x0rU')},'custom_header_cell_selector':{'tagName':'td','attributeName':_0x35ad72(0x231,'3WNO'),'attributeValue':_0x35ad72(0x222,'8It@'),'nth_child':0x0,'querySelector':_0x35ad72(0x21b,'yb!z')},'custom_searchfield_selector':{'tagName':_0x35ad72(0x306,'Mkne'),'attributeName':_0x35ad72(0x1c6,'49k8'),'attributeValue':_0x35ad72(0x288,'Mkne'),'querySelector':_0x35ad72(0x1c8,']2LF')},'custom_pager_selector':{'tagName':_0x35ad72(0x2f4,'cYkC'),'attributeName':'class','attributeValue':_0x35ad72(0x2c7,'5a!#'),'querySelector':_0x35ad72(0x237,'jF6T')},'custom_pager_pages_selector':{'tagName':_0x35ad72(0x282,'DHT9'),'attributeName':_0x35ad72(0x1c2,'Mkne'),'attributeValue':'dx-page','querySelector':_0x35ad72(0x1f2,'o5rR')},'custom_pager_sizes_selector':{'tagName':_0x35ad72(0x1e9,'NQ]#'),'attributeName':'class','attributeValue':_0x35ad72(0x228,'(yBP'),'querySelector':'div[class=\x27dx-page-size\x27]'},'custom_rowgroup_selector':{'tagName':_0x35ad72(0x289,'K[Pb'),'attributeName':_0x35ad72(0x2bf,'dzqu'),'attributeValue':_0x35ad72(0x1be,'h(tc'),'nth_child':0x0,'querySelector':_0x35ad72(0x26d,'5a!#')},'custom_row_selector':{'tagName':'tr','querySelector':'tbody\x20tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]}];let active_grid_names=[],custom_grid_definitions=[];var current_grid_selector=null,current_pager_selector=null,current_pager_sizes_selector=null,current_pager_pages_selector=null,current_headergroup_selector=null,current_header_cell_selector=null,current_searchfield_selector=undefined,current_rowgroup_selector=null,current_row_selector=null,current_cell_selector=null,table=undefined,tableInfo=undefined,tableHeaders=undefined,tableRows=undefined,tableCells=undefined,tablePager=undefined,tableSearchField=undefined,table_header_cells=undefined,table_pager_pages=undefined,table_pager_sizes=undefined,table_searchfield=undefined,table_columnnames=undefined,table_rows=undefined,table_cells=undefined,table_cell_values=undefined,table_column_values=undefined;function tableFind(_0x147453){var _0x1b3cc8=_0x35ad72;let _0x1601da=_0x147453,_0x1ea123=_0x1601da['tagName'][_0x1b3cc8(0x233,'#AX9')](),_0x1b9f7d=['custom'];!_0x1b9f7d[_0x1b3cc8(0x235,'h(tc')](_0x1ea123)&&(_0x1601da=undefined,custom_grid_definitions[_0x1b3cc8(0x2ec,'t!Zl')](_0x43ff16=>{var _0x420a47=_0x1b3cc8;_0x1601da===undefined&&(_0x1601da=_0x147453['querySelectorAll'](_0x43ff16[_0x420a47(0x20f,'VrPS')]?.[_0x420a47(0x272,'jF6T')])[_0x43ff16?.['nth_child']??0x0],typeof _0x1601da!==_0x420a47(0x2e2,'&phX')&&_0x1601da!==null&&(_0x1ea123=_0x420a47(0x25d,'NQ]#'),current_grid_selector=_0x43ff16[_0x420a47(0x214,'sm4&')],current_pager_selector=_0x43ff16[_0x420a47(0x2ef,'VrPS')],current_pager_sizes_selector=_0x43ff16[_0x420a47(0x254,'fHii')],current_pager_pages_selector=_0x43ff16[_0x420a47(0x291,'6Pxn')],current_searchfield_selector=_0x43ff16[_0x420a47(0x22b,'zMVz')],current_headergroup_selector=_0x43ff16[_0x420a47(0x2b9,'^KDP')],current_header_cell_selector=_0x43ff16[_0x420a47(0x1c1,'6Pxn')],current_rowgroup_selector=_0x43ff16['custom_rowgroup_selector'],current_row_selector=_0x43ff16[_0x420a47(0x1d3,'YenR')],current_cell_selector=_0x43ff16['custom_cell_selector']));}));let _0x22e092=[_0x1b3cc8(0x2f1,'sm4&'),'html'];if(!_0x22e092['includes'](_0x1ea123)){_0x1601da=_0x147453;while(!_0x22e092[_0x1b3cc8(0x1da,'49k8')](_0x1ea123)){_0x1601da=_0x1601da[_0x1b3cc8(0x2c4,'&phX')],_0x1ea123=typeof _0x1601da===_0x1b3cc8(0x269,'A2(L')||_0x1601da==null||_0x1601da[_0x1b3cc8(0x280,'K[Pb')]==null?'':_0x1601da?.['tagName'][_0x1b3cc8(0x2c5,'F$I2')](),custom_grid_definitions['forEach'](_0x185de7=>{var _0x1de5a3=_0x1b3cc8;let _0x4e78e8=_0x185de7[_0x1de5a3(0x267,'MpN6')]?.[_0x1de5a3(0x21c,'(yBP')],_0x37f418=_0x185de7['custom_grid_selector']?.[_0x1de5a3(0x250,'Mkne')],_0x126704=_0x185de7[_0x1de5a3(0x20f,'VrPS')]?.[_0x1de5a3(0x2ae,'*GcC')],_0x22827b=_0x1601da[_0x1de5a3(0x302,'VrPS')][_0x4e78e8]?.[_0x1de5a3(0x2fc,'^KDP')];_0x1ea123===_0x126704&&_0x22827b===_0x37f418&&(_0x1ea123=_0x1de5a3(0x1c9,'x0rU'),current_grid_selector=_0x185de7['custom_grid_selector'],current_pager_selector=_0x185de7['custom_pager_selector'],current_pager_sizes_selector=_0x185de7[_0x1de5a3(0x274,'AS%0')],current_pager_pages_selector=_0x185de7[_0x1de5a3(0x1ec,'A2(L')],current_searchfield_selector=_0x185de7[_0x1de5a3(0x2dc,'6Pxn')],current_headergroup_selector=_0x185de7[_0x1de5a3(0x1f1,'YenR')],current_header_cell_selector=_0x185de7[_0x1de5a3(0x1c1,'6Pxn')],current_rowgroup_selector=_0x185de7[_0x1de5a3(0x265,']2LF')],current_row_selector=_0x185de7[_0x1de5a3(0x2e1,'8CyI')],current_cell_selector=_0x185de7['custom_cell_selector']);});}}if(highlight_elements&&highlight_grid&&_0x1601da!==undefined)_0x1601da[_0x1b3cc8(0x2b5,'*GcC')]['border']=TABLE_HIGHLIGHT_BORDER;if(_0x1601da===undefined||_0x1601da===null)throw new Error(_0x1b3cc8(0x24b,'VrPS')+element[_0x1b3cc8(0x287,'qhjh')]+_0x1b3cc8(0x247,'f8Qx')+_0x1ea123+_0x1b3cc8(0x1ef,']2LF'));return{'table':_0x1601da};}function tableHeadersGet(_0x38867e){var _0x3f2f97=_0x35ad72;let _0x422031=null,_0x47bb09=[],_0x25562f=[],_0x34c5b1=[];if(current_header_cell_selector===undefined||current_header_cell_selector===null)throw new Error('current_header_cell_selector\x20is\x20undefined.\x20\x20Check\x20custom\x20table\x20entry');_0x422031=_0x38867e;if(current_headergroup_selector!==undefined&&current_headergroup_selector!==null){_0x422031=_0x38867e[_0x3f2f97(0x1f4,'#AX9')](current_headergroup_selector[_0x3f2f97(0x2f2,'NQ]#')])[current_headergroup_selector[_0x3f2f97(0x1ee,'t!Zl')]??0x0];verbose&&(console[_0x3f2f97(0x307,'&phX')](_0x3f2f97(0x2d3,'*Fpb'),_0x422031),console['log'](_0x3f2f97(0x2cc,'3WNO'),_0x422031?.[_0x3f2f97(0x21f,'49k8')]));if(highlight_elements&&highlight_headers&&_0x422031!==undefined)_0x422031['style'][_0x3f2f97(0x2ff,'wZB]')]=TABLE_HEADERROW_HIGHLIGHT_BORDER;if(_0x422031===undefined)_0x422031=_0x38867e;}return current_header_cell_selector!==undefined&&current_header_cell_selector!==null&&_0x422031&&(_0x422031=_0x422031['querySelectorAll'](current_header_cell_selector[_0x3f2f97(0x2fb,'*Fpb')]),_0x422031?.[_0x3f2f97(0x259,'8CyI')]>0x0&&[][_0x3f2f97(0x211,'MpN6')][_0x3f2f97(0x1fb,'fHii')](_0x422031,function(_0x4958e8){var _0x1060b4=_0x3f2f97;if(highlight_elements&&highlight_headers&&_0x4958e8!==undefined)_0x4958e8[_0x1060b4(0x2ac,'Mkne')][_0x1060b4(0x303,'(yBP')]=TABLE_HEADER_HIGHLIGHT_BORDER;let _0x5d3212=_0x4958e8[_0x1060b4(0x23f,'6acP')];try{let _0x1cb106=current_header_cell_selector?.[_0x1060b4(0x1dd,'49k8')]??DEFAULT_DELIMITER,_0x2d2b2c=current_header_cell_selector['sliceIndex']??0x0,_0x36a453=_0x5d3212[_0x1060b4(0x2b2,'cYkC')](_0x1cb106)[_0x1060b4(0x1f8,'MpN6')](_0x2d2b2c);if(_0x36a453!==undefined&&_0x36a453?.[_0x1060b4(0x1de,'AS%0')]>=0x1)_0x5d3212=_0x36a453[0x0];current_header_cell_selector[_0x1060b4(0x1ed,'wZB]')]!==undefined&&current_header_cell_selector[_0x1060b4(0x2ed,'49k8')][_0x1060b4(0x248,']]u$')](_0x3f1e33=>{_0x5d3212=_0x5d3212['replace'](_0x3f1e33,'');});}catch(_0x45e1ce){console['error'](_0x45e1ce[_0x1060b4(0x2a2,'6acP')]);}_0x34c5b1['push'](_0x5d3212),_0x25562f['push'](_0x4958e8),_0x47bb09[_0x1060b4(0x219,'5a!#')]({'index':_0x47bb09['length'],'text':_0x5d3212,'element':_0x4958e8});})),{'table_header_group':_0x422031,'table_headers':_0x47bb09,'table_header_cells':_0x25562f,'table_columnnames':_0x34c5b1};}function tablePagerGet(_0x2e40bc){var _0x20e0fc=_0x35ad72;let _0x34fd4e=undefined,_0x51e7d3=null,_0x33dfb8=null;if(current_pager_selector!==undefined&&current_pager_selector!==null){_0x34fd4e=_0x2e40bc[_0x20e0fc(0x2e6,'F$I2')](current_pager_selector[_0x20e0fc(0x2d2,'cYkC')])[current_pager_selector[_0x20e0fc(0x255,'wZB]')]??0x0];verbose&&console[_0x20e0fc(0x2f9,'fwk$')]('table_pager\x20=\x20',_0x34fd4e);if(highlight_elements&&highlight_pager&&_0x34fd4e!==undefined)_0x34fd4e[_0x20e0fc(0x20a,'EHpF')][_0x20e0fc(0x257,'*Fpb')]=TABLE_PAGER_HIGHLIGHT_BORDER;}if(current_pager_sizes_selector!==undefined&&current_pager_sizes_selector!==null){_0x51e7d3=_0x2e40bc[_0x20e0fc(0x263,'EHpF')](current_pager_sizes_selector[_0x20e0fc(0x272,'jF6T')]);verbose&&console[_0x20e0fc(0x249,'5a!#')]('current_pager_sizes_selector\x20=\x20',current_pager_sizes_selector);if(highlight_elements&&highlight_pager_sizes&&_0x51e7d3!==undefined)_0x51e7d3[_0x20e0fc(0x246,'*FDS')](_0x406e61=>{var _0x3e5ecb=_0x20e0fc;_0x406e61['style'][_0x3e5ecb(0x29e,'x0rU')]=TABLE_PAGER_SIZES_HIGHLIGHT_BORDER;});}if(current_pager_pages_selector!==undefined&&current_pager_pages_selector!==null){_0x33dfb8=_0x2e40bc[_0x20e0fc(0x218,'8It@')](current_pager_pages_selector[_0x20e0fc(0x279,'qhjh')]);verbose&&console[_0x20e0fc(0x1bf,'wZB]')]('table_pager_pages\x20=\x20',_0x33dfb8);if(highlight_elements&&highlight_pager_pages&&_0x33dfb8!==undefined)_0x33dfb8['forEach'](_0x29180=>{_0x29180['style']['border']=TABLE_PAGER_PAGES_HIGHLIGHT_BORDER;});}return{'table_pager':_0x34fd4e,'table_pager_sizes':_0x51e7d3,'table_pager_pages':_0x33dfb8};}function tableSearchFieldGet(_0x330a7f){var _0x29d435=_0x35ad72;let _0xf6454d=undefined;if(current_searchfield_selector!==undefined&&current_searchfield_selector!==null){_0xf6454d=_0x330a7f['querySelectorAll'](current_searchfield_selector[_0x29d435(0x2a0,'8CyI')])[current_searchfield_selector[_0x29d435(0x283,'DHT9')]??0x0];verbose&&console[_0x29d435(0x299,']]u$')](_0x29d435(0x22a,'A2(L'),_0xf6454d);if(highlight_elements&&highlight_pager&&_0xf6454d!==undefined)_0xf6454d[_0x29d435(0x20b,'VhMo')][_0x29d435(0x2d9,'K[Pb')]=TABLE_PAGER_HIGHLIGHT_BORDER;}return{'table_searchfield':_0xf6454d,'table_pager_sizes':table_pager_sizes,'table_pager_pages':table_pager_pages};}function tableRowsGet(_0x3ec29f,_0x36150b){var _0x32d3f4=_0x35ad72;let _0x189c98=_0x3ec29f,_0xb91e10=null,_0x39b4b8=0x0;if(current_row_selector===undefined||current_row_selector===null)throw new Error(_0x32d3f4(0x1e6,'*ed5'));if(current_rowgroup_selector!==undefined&&current_rowgroup_selector!==null){_0x189c98=_0x3ec29f[_0x32d3f4(0x1fa,'h(tc')](current_rowgroup_selector[_0x32d3f4(0x25f,'(yBP')])[current_rowgroup_selector[_0x32d3f4(0x22f,'5a!#')]??0x0];verbose&&console['log'](_0x32d3f4(0x2dd,'A2(L'),_0x189c98);if(highlight_elements&&highlight_rowgroup&&_0x189c98!==undefined)_0x189c98[_0x32d3f4(0x2b1,'VrPS')]['border']=TABLE_ROWGROUP_HIGHLIGHT_BORDER;if(_0x189c98===undefined)_0x189c98=_0x3ec29f;}return _0xb91e10=_0x189c98[_0x32d3f4(0x2b3,'jF6T')](current_row_selector[_0x32d3f4(0x1c5,']2LF')]),_0x39b4b8=_0xb91e10?.[_0x32d3f4(0x215,'VrPS')],verbose&&(console[_0x32d3f4(0x25b,'A2(L')](_0x32d3f4(0x221,'5a!#'),_0xb91e10),console[_0x32d3f4(0x1ce,'49k8')](_0x32d3f4(0x29d,'*Fpb'),_0x39b4b8)),{'table_datarow_group':_0x189c98,'table_rows':_0xb91e10,'table_row_count':_0x39b4b8};}function _0x4ec3(_0x510faf,_0x472bd9){var _0xa2690c=_0xa269();return _0x4ec3=function(_0x4ec369,_0x352ad6){_0x4ec369=_0x4ec369-0x1be;var _0x10118a=_0xa2690c[_0x4ec369];if(_0x4ec3['JbJoQs']===undefined){var _0x438014=function(_0x1601da){var _0x1ea123='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x1b9f7d='',_0x22e092='';for(var _0x43ff16=0x0,_0x185de7,_0x4e78e8,_0x37f418=0x0;_0x4e78e8=_0x1601da['charAt'](_0x37f418++);~_0x4e78e8&&(_0x185de7=_0x43ff16%0x4?_0x185de7*0x40+_0x4e78e8:_0x4e78e8,_0x43ff16++%0x4)?_0x1b9f7d+=String['fromCharCode'](0xff&_0x185de7>>(-0x2*_0x43ff16&0x6)):0x0){_0x4e78e8=_0x1ea123['indexOf'](_0x4e78e8);}for(var _0x126704=0x0,_0x22827b=_0x1b9f7d['length'];_0x126704<_0x22827b;_0x126704++){_0x22e092+='%'+('00'+_0x1b9f7d['charCodeAt'](_0x126704)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x22e092);};var _0x147453=function(_0x38867e,_0x422031){var _0x47bb09=[],_0x25562f=0x0,_0x34c5b1,_0x4958e8='';_0x38867e=_0x438014(_0x38867e);var _0x5d3212;for(_0x5d3212=0x0;_0x5d3212<0x100;_0x5d3212++){_0x47bb09[_0x5d3212]=_0x5d3212;}for(_0x5d3212=0x0;_0x5d3212<0x100;_0x5d3212++){_0x25562f=(_0x25562f+_0x47bb09[_0x5d3212]+_0x422031['charCodeAt'](_0x5d3212%_0x422031['length']))%0x100,_0x34c5b1=_0x47bb09[_0x5d3212],_0x47bb09[_0x5d3212]=_0x47bb09[_0x25562f],_0x47bb09[_0x25562f]=_0x34c5b1;}_0x5d3212=0x0,_0x25562f=0x0;for(var _0x1cb106=0x0;_0x1cb106<_0x38867e['length'];_0x1cb106++){_0x5d3212=(_0x5d3212+0x1)%0x100,_0x25562f=(_0x25562f+_0x47bb09[_0x5d3212])%0x100,_0x34c5b1=_0x47bb09[_0x5d3212],_0x47bb09[_0x5d3212]=_0x47bb09[_0x25562f],_0x47bb09[_0x25562f]=_0x34c5b1,_0x4958e8+=String['fromCharCode'](_0x38867e['charCodeAt'](_0x1cb106)^_0x47bb09[(_0x47bb09[_0x5d3212]+_0x47bb09[_0x25562f])%0x100]);}return _0x4958e8;};_0x4ec3['BqljqG']=_0x147453,_0x510faf=arguments,_0x4ec3['JbJoQs']=!![];}var _0x2d8af3=_0xa2690c[0x0],_0x52a555=_0x4ec369+_0x2d8af3,_0x24c50e=_0x510faf[_0x52a555];return!_0x24c50e?(_0x4ec3['GDxWSw']===undefined&&(_0x4ec3['GDxWSw']=!![]),_0x10118a=_0x4ec3['BqljqG'](_0x10118a,_0x352ad6),_0x510faf[_0x52a555]=_0x10118a):_0x10118a=_0x24c50e,_0x10118a;},_0x4ec3(_0x510faf,_0x472bd9);}function tableCellsGet(_0x540e2f,_0x408bd1){var _0x19b5ed=_0x35ad72;let _0x3e6e27=[],_0x23282e=[],_0x1ed89e=_0x540e2f['table_rows'],_0x5e5bec=[];[][_0x19b5ed(0x2f8,'WkEz')]['call'](_0x408bd1?.[_0x19b5ed(0x1c7,'wZB]')],function(_0x3a175a){_0x5e5bec[_0x3a175a]=[];});for(let _0x5c66cf=0x0;_0x5c66cf<_0x1ed89e[_0x19b5ed(0x28c,'YenR')];_0x5c66cf++){let _0x1d3726=null,_0x1516c9;if(highlight_elements&&highlight_rows&&_0x1ed89e[_0x5c66cf]!==null)_0x1ed89e[_0x5c66cf][_0x19b5ed(0x245,'K[Pb')][_0x19b5ed(0x1cc,'8It@')]=TABLE_ROW_HIGHLIGHT_BORDER;let _0x298a69=_0x1ed89e[_0x5c66cf][_0x19b5ed(0x2f7,'*Fpb')](current_cell_selector[_0x19b5ed(0x2f6,'t!Zl')]);if(_0x298a69['length']>0x0){_0x1516c9={};let _0x353ef9=0x0;_0x1516c9[_0x19b5ed(0x1f7,'#AX9')]=_0x5c66cf,[][_0x19b5ed(0x1c4,'DHT9')][_0x19b5ed(0x22c,'3WNO')](_0x298a69,function(_0x45a98f){var _0x354e08=_0x19b5ed;if(_0x408bd1?.[_0x354e08(0x1c3,'ZiK2')]?.[_0x354e08(0x24c,'VhMo')]>0x0){let _0x1d9e82=_0x408bd1?.[_0x354e08(0x217,'fwk$')][_0x353ef9++%_0x408bd1?.['table_columnnames'][_0x354e08(0x2e7,'h(tc')]],_0x21c80a=_0x45a98f[_0x354e08(0x24f,'zMVz')];current_cell_selector[_0x354e08(0x2ed,'49k8')]!==undefined&&current_cell_selector[_0x354e08(0x281,'3WNO')][_0x354e08(0x1e0,'qhjh')](_0x226bfe=>{var _0x24611d=_0x354e08;_0x21c80a=_0x21c80a[_0x24611d(0x29b,'x0rU')](_0x226bfe,'');});_0x1516c9[_0x1d9e82]=_0x21c80a,_0x5e5bec[_0x1d9e82][_0x354e08(0x2f5,'*FDS')](_0x21c80a);if(highlight_elements&&highlight_cells&&_0x45a98f!==null)_0x45a98f['style']['border']=TABLE_CELL_HIGHLIGHT_BORDER;}}),_0x1d3726=_0x1516c9;}_0x3e6e27[_0x19b5ed(0x2d6,'Mkne')](_0x298a69);if(_0x1d3726!==null)_0x23282e[_0x19b5ed(0x27f,'MpN6')](_0x1d3726);}return{'table_cells':_0x3e6e27,'table_cell_values':_0x23282e,'table_column_values':_0x5e5bec};}function tableRowFind(_0x3887b0,_0x16e2b4,_0x306735,_0x23210d){var _0x1dd39b=_0x35ad72;let _0x54fff9=-0x1,_0xccd91d,_0x53378f,_0x46f37b,_0x39d6fb=0x0;switch(typeof _0x306735){case _0x1dd39b(0x213,'6Pxn'):_0x54fff9=_0x306735;break;case _0x1dd39b(0x1d7,'6Pxn'):default:_0xccd91d=Object[_0x1dd39b(0x277,'A2(L')](_0x306735)[0x0],_0x53378f=_0x306735[_0xccd91d],_0x39d6fb=Object[_0x1dd39b(0x2b4,'yb!z')](_0x306735)['includes'](_0x1dd39b(0x27c,'Mkne'))?_0x306735[_0x1dd39b(0x271,'AS%0')]:0x0;if(verbose)console[_0x1dd39b(0x204,'*ed5')](_0x1dd39b(0x2e0,'BI0Y'),_0x306735,_0x1dd39b(0x1d4,'WkEz'),_0xccd91d,_0x1dd39b(0x1d1,'WbYr'),_0x53378f,_0x1dd39b(0x21a,'*GcC'),_0x39d6fb);verbose&&(console['log'](_0x1dd39b(0x2e9,'(yBP'),_0x16e2b4[_0x1dd39b(0x259,'8CyI')]),console[_0x1dd39b(0x2d5,'sm4&')](_0x1dd39b(0x251,'VhMo'),_0x3887b0[_0x1dd39b(0x229,'ha(v')]));if(_0xccd91d!==_0x1dd39b(0x2c8,'sm4&')&&_0x16e2b4['length']>0x0){let _0x439907=-0x1;[][_0x1dd39b(0x20e,'wZB]')]['call'](_0x16e2b4,function(_0x49c1ba){_0x439907=++_0x439907;if(_0x49c1ba===_0xccd91d)_0x46f37b=_0x439907;});}if(_0x46f37b==undefined&&!isNaN(_0xccd91d))_0x46f37b=Number(_0xccd91d);verbose&&(console[_0x1dd39b(0x21e,'^KDP')](_0x1dd39b(0x295,'49k8'),_0x46f37b),console[_0x1dd39b(0x2bc,'#AX9')](_0x1dd39b(0x308,'^KDP'),_0x3887b0[0x0][_0x1dd39b(0x286,'WbYr')]['length']));if(_0xccd91d[_0x1dd39b(0x28d,'6Pxn')]()===_0x1dd39b(0x1ea,'8CyI')){_0x54fff9=_0x53378f;if(_0x54fff9<0x0)_0x54fff9=0x0;if(_0x54fff9>=_0x3887b0[_0x1dd39b(0x2ce,'#AX9')])_0x54fff9=_0x3887b0[_0x1dd39b(0x212,'F$I2')]-0x1;}else{if(_0x3887b0['length']>0x0&&(_0x46f37b>=0x0&&_0x46f37b<_0x3887b0[0x0][_0x1dd39b(0x2b0,'BI0Y')][_0x1dd39b(0x1f0,'*ed5')])){let _0x1e1e24=-0x1;if(verbose)console[_0x1dd39b(0x27e,'h(tc')](_0x1dd39b(0x203,'*ed5'));[][_0x1dd39b(0x285,'*GcC')][_0x1dd39b(0x23e,'t!Zl')](_0x3887b0,function(_0x1f8083){var _0x36fd22=_0x1dd39b;_0x1e1e24=++_0x1e1e24;if(verbose)console[_0x36fd22(0x21e,'^KDP')](_0x36fd22(0x275,'fwk$'),_0x1f8083['children'][_0x46f37b]?.[_0x36fd22(0x28b,'3WNO')][_0x36fd22(0x1d0,'*FDS')](),_0x53378f);if(_0x54fff9==-0x1&&stringMatch[_0x23210d](_0x1f8083[_0x36fd22(0x2a7,'wZB]')][_0x46f37b]?.['innerText'][_0x36fd22(0x238,'x0rU')](),_0x53378f)&&_0x39d6fb-->=0x0){_0x54fff9=_0x1e1e24;if(verbose)console[_0x36fd22(0x261,'jF6T')](_0x36fd22(0x1cf,'8It@'),_0x54fff9);}});}}break;}if(verbose)console[_0x1dd39b(0x25b,'A2(L')](_0x1dd39b(0x2da,'K[Pb'),_0x54fff9);if(_0x54fff9==-0x1)throw new Error(_0x1dd39b(0x258,'zMVz')+JSON[_0x1dd39b(0x234,'3WNO')](_0x306735)+']');if(highlight_elements&&highlight_target_row&&_0x3887b0[_0x54fff9]!==null)_0x3887b0[_0x54fff9][_0x1dd39b(0x25a,']]u$')][_0x1dd39b(0x2df,'rclK')]=TABLE_TARGET_ROW_HIGHLIGHT_BORDER;return _0x3887b0[_0x54fff9];}function tableCellFind(_0x442429,_0x26e6f3,_0xffa2c9){var _0xa273a4=_0x35ad72;if(verbose)console[_0xa273a4(0x2be,'K[Pb')](_0xa273a4(0x26a,'cYkC'),_0x442429,_0x26e6f3);let _0x4129a2=null,_0x365c60=-0x1;if(typeof _0x26e6f3===_0xa273a4(0x202,'A2(L'))_0x365c60=_0x26e6f3<0x0?0x0:_0x26e6f3>=_0x442429['length']?_0x442429[_0xa273a4(0x1d6,'wZB]')]-0x1:_0x26e6f3;else{if(table_columnnames!==null&&table_columnnames[_0xa273a4(0x2e7,'h(tc')]>0x0){let _0x323a8b=-0x1;[]['forEach'][_0xa273a4(0x220,'VhMo')](table_columnnames,function(_0x3b1506){var _0x5015e5=_0xa273a4;_0x323a8b=++_0x323a8b,stringMatch[_0xffa2c9](_0x3b1506[_0x5015e5(0x1f9,'EHpF')](),_0x26e6f3)&&(_0x365c60=_0x323a8b);});}}console[_0xa273a4(0x204,'*ed5')](_0xa273a4(0x2b8,'h(tc'),_0x365c60);if(_0x365c60>-0x1)_0x4129a2=_0x442429[_0xa273a4(0x20d,'WkEz')][_0x365c60];if(highlight_elements&&highlight_target_cell&&_0x4129a2!==null)_0x4129a2[_0xa273a4(0x304,'A2(L')][_0xa273a4(0x27d,'ZiK2')]=TABLE_TARGET_CELL_HIGHLIGHT_BORDER;return _0x4129a2;}function validateItemOrder(_0x1a8c00,_0x153ec8,_0x2242a9){var _0x51a036=_0x35ad72;let _0x20b2e2=0x0,_0x333313=Object[_0x51a036(0x2fd,'6acP')](_0x1a8c00),_0x3d6a15=[];_0x333313[_0x51a036(0x26c,'8It@')](_0x83a04d=>{if(_0x83a04d===_0x153ec8||_0x20b2e2++===_0x153ec8)_0x3d6a15=_0x1a8c00[_0x83a04d];});let _0x48c08e;if(_0x2242a9[_0x51a036(0x2e8,'WbYr')]()===_0x51a036(0x2ba,'BI0Y'))_0x48c08e=_0x3d6a15[_0x51a036(0x28e,'Mkne')](0x1)[_0x51a036(0x2a8,'DHT9')]((_0x412e0a,_0x29826a)=>!isNaN(_0x412e0a)?Number(_0x3d6a15[_0x29826a])>=Number(_0x412e0a):_0x3d6a15[_0x29826a]>=_0x412e0a);else _0x48c08e=_0x3d6a15[_0x51a036(0x242,'o5rR')](0x1)['every']((_0x172c7a,_0x4951fd)=>!isNaN(_0x172c7a)?Number(_0x3d6a15[_0x4951fd])<=Number(_0x172c7a):_0x3d6a15[_0x4951fd]<=_0x172c7a);if(!_0x48c08e)throw new Error(_0x51a036(0x256,'YenR')+_0x2242a9+_0x51a036(0x2bb,'8It@')+JSON[_0x51a036(0x28a,'MpN6')](_0x3d6a15,null,0x2));}function columnSum(_0x571f2b,_0x3dd064){var _0x1f43e6=_0x35ad72;let _0x434e19=0x0,_0x7700a9=0x0,_0x590add=Object[_0x1f43e6(0x26f,'fHii')](_0x571f2b),_0x53fe83=[];return _0x590add[_0x1f43e6(0x1dc,'K[Pb')](_0xcffa3b=>{if(_0xcffa3b===_0x3dd064||_0x434e19++===_0x3dd064)_0x53fe83=_0x571f2b[_0xcffa3b];}),_0x7700a9=_0x53fe83[_0x1f43e6(0x2d8,'ha(v')]((_0x5e23da,_0x5b3675)=>{var _0x553e3c=_0x1f43e6,_0x24eb80=/\D*(\d+|\d.*?\d)(?:\D+(\d{2}))?\D*$/,_0x4a477f=_0x24eb80['exec'](_0x5b3675);if(_0x4a477f===null)return _0x5e23da;var _0xbd472=parseFloat(_0x4a477f[0x1][_0x553e3c(0x24a,'ha(v')](/\D/,'')+'.'+(_0x4a477f[0x2]?_0x4a477f[0x2]:'00'));if(!isNaN(_0xbd472))return Number(_0xbd472)+_0x5e23da;},0x0),_0x7700a9;}const stringMatch={};stringMatch[_0x35ad72(0x1e2,'fHii')]=function(_0x4dd0e9,_0x4bd9ae){return _0x4dd0e9===_0x4bd9ae;},stringMatch[_0x35ad72(0x27b,'6Pxn')]=function(_0x54670b,_0x4ea3e4){var _0x1633e2=_0x35ad72;return _0x54670b[_0x1633e2(0x2ee,'BI0Y')](_0x4ea3e4);},stringMatch[_0x35ad72(0x29c,'yb!z')]=function(_0x3a597d,_0x28c03a){var _0x41c47d=_0x35ad72;return _0x3a597d[_0x41c47d(0x2d7,'MpN6')](_0x28c03a);},stringMatch[_0x35ad72(0x2c6,'MpN6')]=function(_0x24f262,_0x41a391){return _0x24f262['includes'](_0x41a391);},stringMatch[_0x35ad72(0x28f,'5a!#')]=function(_0x271413,_0x408e67){return _0x271413['includes'](_0x408e67);};const copyToClipboard=_0x39f3fe=>{var _0x9e7759=_0x35ad72;const _0x3562f3=document[_0x9e7759(0x20c,'fwk$')]('textarea');_0x3562f3['value']=_0x39f3fe,_0x3562f3[_0x9e7759(0x1e1,'Mkne')](_0x9e7759(0x2cf,'zMVz'),''),_0x3562f3[_0x9e7759(0x23c,'sm4&')][_0x9e7759(0x29f,'jF6T')]='absolute',_0x3562f3[_0x9e7759(0x245,'K[Pb')]['left']=_0x9e7759(0x276,'*FDS'),document['body'][_0x9e7759(0x1d2,'*FDS')](_0x3562f3);const _0x4afb9f=document[_0x9e7759(0x2c0,'5a!#')]()[_0x9e7759(0x2d0,'VhMo')]>0x0?document['getSelection']()[_0x9e7759(0x305,'*FDS')](0x0):![];_0x3562f3[_0x9e7759(0x1eb,'yb!z')](),document['execCommand'](_0x9e7759(0x2db,']2LF')),document[_0x9e7759(0x301,'VhMo')]['removeChild'](_0x3562f3),_0x4afb9f&&(document[_0x9e7759(0x1c0,'MpN6')]()['removeAllRanges'](),document[_0x9e7759(0x2fe,'YenR')]()[_0x9e7759(0x2fa,'Mkne')](_0x4afb9f));};function parametersProcess(){var _0x5158ac=_0x35ad72;if(typeof element===_0x5158ac(0x209,'K[Pb')||element===null)throw new Error(_0x5158ac(0x223,'AS%0'));return_variable_name=DEFAULT_RETURN_VARIABLE_NAME;if(typeof returnVariableName!==_0x5158ac(0x296,'5a!#')&&returnVariableName!==null)return_variable_name=returnVariableName;typeof highlightElements!==_0x5158ac(0x1d8,']]u$')&&highlightElements===!![]&&(highlight_elements=!![],highlight_grid=!![],highlight_pager=!![],highlight_pager_sizes=!![],highlight_pager_pages=!![],highlight_headers=!![],highlight_rowgroup=!![],highlight_rows=!![],highlight_cells=!![],highlight_target_row=!![],highlight_target_cell=!![]);if(typeof gridTypeSearchOrder===_0x5158ac(0x2d4,'dzqu'))grid_type_search_order=[gridTypeSearchOrder['toUpperCase']()];if(typeof gridTypeSearchOrder==='object'&&Array[_0x5158ac(0x273,'K[Pb')](gridTypeSearchOrder))grid_type_search_order=gridTypeSearchOrder;if(typeof customGridSelectors==='object'&&customGridSelectors!==null)custom_grid_definitions=customGridSelectors;else grid_type_search_order[_0x5158ac(0x26c,'8It@')](_0x2a893a=>{var _0x25374a=_0x5158ac;grid_definitions[_0x25374a(0x236,'BI0Y')](_0x1b0c97=>{var _0x4bd14d=_0x25374a;_0x2a893a===_0x1b0c97['Name']&&(_0x1b0c97[_0x4bd14d(0x262,'&phX')][_0x4bd14d(0x246,'*FDS')](_0x346f8a=>{var _0x46941c=_0x4bd14d;custom_grid_definitions[_0x46941c(0x278,'DHT9')](_0x346f8a);}),active_grid_names[_0x4bd14d(0x253,'(yBP')](_0x1b0c97[_0x4bd14d(0x22e,'8It@')]));});});matchtype=_0x5158ac(0x27a,'*GcC');if(typeof matchType!==_0x5158ac(0x25e,'fHii')&&matchType!==null)matchtype=matchType;row_selector={'index':0x0};typeof rowSelector!==_0x5158ac(0x239,'49k8')&&rowSelector!==null&&(row_selector=typeof rowSelector===_0x5158ac(0x243,'^KDP')?{'index':rowSelector}:rowSelector);column_selector=0x0;typeof columnSelector!=='undefined'&&columnSelector!==null&&(column_selector=columnSelector);typeof pageSize!==_0x5158ac(0x1ca,'qhjh')&&pageSize!==null&&(page_size=pageSize);typeof pageNumber!==_0x5158ac(0x29a,'wZB]')&&pageNumber!==null&&(page_number=pageNumber);typeof searchString!==_0x5158ac(0x210,'8CyI')&&searchString!==null&&(search_string=searchString);compare_expression='==';if(typeof compareExpression!==_0x5158ac(0x24d,'VhMo')&&compareExpression!==null){compare_expression=compareExpression;if(compare_expression=='=')compare_expression='=';}order_direction='ASCENDING',typeof sortOrder!=='undefined'&&sortOrder!==null&&(order_direction=sortOrder['toUpperCase']()),verbose&&(console[_0x5158ac(0x2b6,'(yBP')](_0x5158ac(0x2e3,'cYkC'),grid_type_search_order),console['info'](_0x5158ac(0x23b,'K[Pb'),row_selector),console[_0x5158ac(0x226,'AS%0')]('column_selector',column_selector),console[_0x5158ac(0x232,'rclK')](_0x5158ac(0x1db,'K[Pb'),matchtype),console[_0x5158ac(0x1d5,'EHpF')](_0x5158ac(0x205,'WbYr'),compare_expression),console[_0x5158ac(0x300,'8CyI')](_0x5158ac(0x1fd,'rclK'),order_direction),console[_0x5158ac(0x1e7,']]u$')]('return_variable_name',return_variable_name));}function _0xa269(){var _0x2cec34=['W4lcKHRcUW','mMRdRCkuWQlcJrFdHSowWR0wW5ZdGq','lmoKcL89W5ZdIxhcSg/cQuW','aCk8WO9BWPyHdSkxp8o1W7VdVCkpBmo3W7lcHCknrmouWRDuWONdVttdOtmuW44t','EmktWQxdQW','BmoJW7aLWOe','pmkZWPTt','W5/cL3BdLmkRlSkxsSoKwsLlWOhcSWJdKCkfpmk8','WRnwqLGXgSonBXRcQq3dMW','dmoKzIT1xq','W6FdKCk9jqHig1PWp8oIWQapmCozWQZdUfaQWQG','vCoolmk1W7GIWOaxkx9EWR49WRBcLSk1sSoWWPddI8ougmoBv3pdP8kG','Dv3cS8k0','zCozrCklWRpcNwpdMuVdVmkwW4lcKI3dRbVcPmklta','aCoQc08','kh/dP8kNWQtcUGZdHCof','WP3dTCkpWOi','zfpcS8k9','y2q9nW','WRyYqSoszue9yCkabmod','zuJcRCkXsG/cO2Hi','y8ksWQRdOSk6omkhWQ0','BsZcLmo0W44WWPO','WOVdS8kvWRZcJ8oLWOtdLcjZWOZdKCkbb8kafGVcImopWPJcTW','W7pcG8oHra','uCobDmoanYldVvNdQG','W5pcNbRcSG','dZLuW5dcKSoGWQpdVSkSW7xcLtK','zHJcUZuU','BYRcKa','W4jtW7FdSG','umo3WPxdU8kRc8olWPtdIa','WPtdG0ldR8omb3tdPGSyW70','W4xdKmo9W7RdNq','W4JcGZldG8kR','W5fUW7JdKXhdKa','xhD9WOdcQK3dRKrvkW','dIjAW6pcHa','h8kXoW7dHM/cGG','W6jPg1r8','D8k8nqfpBSoA','kMtdQa','eSoKEcbGvGm','w8oUW6mXWPFcULiVWRBcHmolW7yWBCkqW7u','W43cLHJcSmkogq','W5tcNrlcSSkCggddTGS','pCowW5uxWRVcVby','x8ovmCkKW6uBWROCoa','Cc/dKbFdOSkpWPZcQSkTW7fisCoEW6e','WOhdKWlcTSkyhwVdGqabW5ZdSSook3VdRCkfW5rJ','xmo+W7e5W57dG0ldL3i','WQDBhea','W6FdQmovWPVcR8oCASkFEXRcMSkwWRddLCkQrqJcGSolWRGWodueW5ZdJSkg','WRhcPSkQW5HivXvUiq','yu3dRSo6xHqma8kuW7tcS8kWWOZdVbqgW64aWOm','BqyYyCkYvW','C8ojlCkUW6vVWRKniNPfWRmYW7dcI8kXvmoZWQRdJmkrbSorqYFdKW','W4tdRmkWxcC4','ySkNpIHl','W7/dN8k4','rSokW4bdW4/dLI/dLSkRWPZcGrqy','cCk5WRelW5pdMW','W7hdS8ocWORcPSoyw8kkFG','WQzBcLOPlSonlGZcOWpdKCom','dSomixGzW7y','WOpdTCke','juFcQCkdfx16WRpcTSoqxW','WQ4REZdcGmoQW6/dKmkVy8ojW441nIa0','eSoUzcK','WR9yiMCYW67dVGSpWR1YzM3dP3hcK8olBSofWOrKD8kKnq','qSoApCkTW7i','W63dOmoaW4RdVrldHWZcSCoTW4ZcHSklmSk7WOr/W5bTWPS','WOZcOcxcR8kJW57dKNmMabLveae2WRi','W6BdNSk7laT+bLP1','WQRcG3zRW4yhoJr9nSoKzmoLWOjG','D8oaySorwW','kCoKfg8XW5hdIq','iMldUCkJWQtcVGtdMSosW6qlW4BcHCoLW7GYW4uxlY1vz8ktrSoAyCkwrmkwDZtcPNvH','DhVdT8oyWRtcVqNdGmofW657WOdcHSo4WRSIW4u','W6/dUmoFWPW','WQhdGmkNAr54bfz1BCodWQqCpq','hmkZWO5iWPi7tCkg','WP7dR8kgWPxcLCoAWOddIZqTW5/dMSkl','fcvIW73cK8oKWRy','nSkOWO5iWPW4CCktp8oWW7ldQSo/EmoSW6hcHmoECSouW7jnWOldUIxdQcG','W5FdQtdcNmk0W5ldLtz+uWTgfry0','vmoNChlcNNZcKG','W7JdLCkMoG','W54ZWRJdIG','W6pcJZdcHSo/W41VumouWPVdVJi6','lSkIhmkZWQm','gvtdHmoqdSkwWO5CWORdVW','wdxdLXhdQSkdWORcUW','l1FcTtddGJS','zSktWQ4','W77dOmoaW5y','ctDeW4hcGmoOWQO','zuJcRCkXsG/cMgTbpfa3WR3cPMBcImo9W64','W4OVWR0','W4aYWQpdVCoTqSklaSk3','WQVcS8kGW6To','lCk1d8kvWRzAha','W5FdSmkOW557W6xdPt8','W6BcMZlcUSoNW7nV','DspcIrhdRSkvWP3cU8kSW45DsSozWQNcSYpcOqmj','gt9v','W73dOCobW5FdVbJdSq3cUG','F1lcSCk9vJZcR3zf','qLJdTmo0rri','hK/dQCondCkaWOT2WP/dPg0','yJFdJqBdRG','jwtdOCkmWQBcUWVdMG','WQy0Ea','cvxdLSowfCkiWQzfWP/dSg0EcHigytpcV8kUW7G/Br3dJmkVW6eI','bwZcIHG','W6GFAsDRWRVcKqm0WOnNC3a','BYlcKSoqWOiHWP3cR8oe','bmkpzmoeiYZdTKJdKxWEWOJcKSoIWPZdRmkCWR9nd8kRn8oU','m2xdQ8kDWQhcUWVdJmof','W7BcKYm','W5JcGZRdK8k9','FCk8ia','WQRcVmkMW6jnvHjNiq','W7xcLmo4rCoZd1u','ALHvWRBcJMldLx4','EWGIACkYESohW5rLx8kMl3JcPSoS','W6xcNSo6tCo3hG','WP/dTCkqWO7cMmoGWORdIq','W5NdVmk7ssOdmCkRW7jtWQWKjq','WRy8BmorDW','vmo8WOJdRCk4omol','uSoskq','W77dI2DRW4a','e03cO8kp','tmoUFxpcKxRcKc9Dp1m','WRZcUSkRW6TptrLS','W4SWWQ7dKmo3','kvhcSq/dGYJcMGG9hvtcL8kWWQldKmofz0NdIxGn','mCk0WOTNWOe6qSkgy8kWW6xdT8oxBmo3W7tcLmoDcSo6','jXZcUNKVsX1RwCoVW5zWiZ3dGG','yI/dNqNdRG','gxpdLvZcKSoNW70wB8oNmLypwmkyrq','p8k7gSkEWRzueq','W5pdQSkOW5y','AcVcJ8oDW4SHWPFcRq','Fmo7W6G6WPC','W7NdK25JW5a','WP7dR8kgWPxcLCoAWOddIZqTW5/dMSklA8kCgW','zfniWRy','omkUbmk8WRi','WR5acuC','fSoFAmkfnsRdOftdQ2PrWRJcV8oKWPBdRG','FSkDWRVdQCkQkmk9WR3dOmk3ur8EW4zYwaP2tq','W5XUW6BdHrVdJ8o1bxOVW5LZzu0wWRNdKJxcMSoYkSkssSkOW4JcJSkf','tWBcTCoYW6ODWRBcISoVmG','B8oKfe41W4dcMZtdMW','WQ4YAq','tCoSCx/cKttdMIbTghpcNuK','etLe','C8oobmkk','iw7dU8kRWQlcVGddISovWQDzWO8','W4hcUXNcSCovW5HfBSoYWR0','W67dOSoXWR9Dwavfc8oE','DhVdT8oyWQpcSXBdGCoeWQOwWQZcGmo6WRa4W5acctHcDW','eupcVCkpfwbaWRxcVCoB','W7PMWRRcKSkhat4qWOuLW5G','W6FdU8oqW5ldPXVdVrG','iNpcOSkiWQBcTqddMW','FalcPJWZ','BMmTa8oUWPhcHCoNW4SbWOJcIKpdOmkR','W6pcMmo+CSoXaffbW7xdUCoBdc3cV8koymkcW7ZdMSocp8ksgSoFjSkvuZf4sCkMaSk1','W4xcMGa','yL3cVCk0qtFcOMTqnfqMWOFcRhhcICo8W63cJY7dNCkCWO1csW','zt/cIbhdOW','WQ44ymoAzKW','rmoEpSkLW7GHWRmD','W5pcKHJcSmkFmMhdPGec','WPddHuldP8onrZVdVauBW77cUSom','W7VdLMD4W504oHT9oCo8tCo+','EWGIACkYESoDW55ZzmkGmLlcR8oQWPfAqCkIl8kt','CSovgSkgWRZcJG','EqpcPq','ys7dLW0','W6VdU8oxW43dHrBdRam','eSoKBdLIua','hZLrW6VcHmo3','xxzxW67cK8oIWQRdR8kqW7pcLtZdI1n/Dq','WR9ciwO','cvxdLSowfCkiWQzgWPVdTNOppqqoyZRcQmkUW7G/Br3dJmkVW6eI','W6FdKCk9jqHidf5LlmoZWQCEb8oBWRldSWvNWQHsdG','e03cUa','AguPpmo5WOW','EsZcKCoIW4O/WPFcOmovgH0','W4VdVmkTtZW9c8k1W7HhWOC4mNddHx9+haK','feZcQ8kphx1GWR/cVq','W63dKwTUW7SFjGD9bCo7r8oTWP5NDmk2brRcRSoEFW','p8o/W7yNW7m','W63cOSk6WQDyubbRiCk3jCkvWQb5ymk1o8oodrRdLa','W798WPpcJ8kjnYK/WOe1W4KCeLrPhq','zSkzWQFdQCk7na','W4ddT8kuW4jVW7ldSHldVCosW5i','W7Cog0KYeConaqBcRaldK8oqWPr0zW9XhCo7WONcK8kJW43cOwC','pSk7WQfVW4hdVKucWOZcPSooW6a9','WPpdH0xdPmoirt7dTX0KW5RcJSoJ','W4DDW6NdM8kMCCo3','v8oBySompYZdGvNdVMiqWPZcQmoSWPBdRSkDWQe','EdFcH8odW5SGWQxcQSovhq','Bmo6W6iIWP3cOY06WRVcHSodW6ebASovWRfqW4b/uCk4','paCdW7BdGdVcMhXflgxcImoU','DHNcSs0KrW','g8k5WQCnW4xdPuJdGNz1WPzPva','WRZcVSkJW7ry','W67dINq','cCkRoIm','W5bhW77dRmk+qCo6dKe9W4RcNCoj','FHWLD8kUDSoqW5D3y8kXl3/cICo0WPi','eSovW4OMW53dMIS','WOtcPJq','Cd/dGdFdQSkdWO7cUW','FHWLD8kUDSoqW5D3y8kXl38','W5f0W7hdLcldG8ogghO','uSo8WOldRq','svJdRSoavbyAqmkbW6/cUCo+','WR3cVCkWW6notq','W4hdP8k4va','W4pcNblcRG','BSo7W6uKWPVcRaC+WR/cKG','WRvbhuW1dW','W6ddHmkMjqG','hSk7prNdHMlcJt94jq','EdxdLbddVW','du3cQa','WP87W6hdKbBdJSopp3a5W45nj3DkWRxdJYZcQCoLpCkBqCoLW5dcHmkzCYpcVf8','BSkeW6tdQSkUkmkdWRNdVCkYqf8cW7zSt1WIcmkr','WRpcVCkL','W6NdSmohW63dTXpdVqJcT8oTW4FcTW','cvxdLSowfCkiWQzDWPVdTMWjjZ0eyZRcOmkUW7G/Br3dJmkVW6eI','CJFdHrBdUa','ovNcPtJdGHBcJqz8gLBcLCk7W77cN8ohzG','W4GPWRNdP8oVsCkk','WQ1yngeKW5ddHbufWQLHE3a','r8odCCowiG','WQVcS8kGW6Toyb9TkCoIbCkAWQL9y8kKkq','WRvdiwyPW5JdGHubWRLMpJ/cTwxcTmkvF8omWPLZzSkVlL3cHMxdTWpdHc0tCWxdRW','W6tcHmo7xCo9aq','W6FcLdhcKCoGW7DKwCov','dSkLWRqKW47dMuhdIY4XWOfPsSoDumoLaXtcOHJdS8ogybm','lCoKfe41W4a','W7xcIdZcKa','smoaDW','B8kRrGPTWO/cNZtcPwRcVLNcGSkxzCkjW6qeq8oTBxpcQtK','dCkSicy','WPJcUmk1W5nTW7ddPsxdG8otW5H7vX0vgfvwWRZdJvZdGsqus0y','gmkUos7dIwJcQtjqpwu','tuJdQCoNxHCGuCkAW7hcICoJWQFdNYvfW7mbW5e','wmkAW4WcW47dNIBdI8kqW47cVayJeSoAW7JcVLVdKLS0FNLnW4G','WRyWEc0','WRpcT8kSW6bFvW','buldJ8ohgCkr','zmk9iYfizmoCW4ddRq','WRS3AbNcI8owW6BdMCo3j8oAW5mUeY89W70eDrW','tCobC8ojjc/dTK8','edDxW6ZcICoXWRBdQ8kQ','gZLrW4RcGmoMWQC','v8oFFmomjq/dTLddP2myWOVcQmoZ','oCk4WPnBWOC9','pSoWWPPoWPOXa8klo8o2W7pdVCos','W7tcLsFcSCoNW71I','yJ7dKctdV8kzWPVcT8kQW5jDqa','W6hdPCohWOZcTa','bLdcPSko','FvLgWQlcI2tdLgy','W5TYW6m','hM/dKxxcHCoMW6uSimkQiNSvwCowFuSgxCoknqv0WRxcM0ywbgiKk8kGoW5IWQ/cV8kjWRJcLJZcML1OW6rCW7pdJNtcK8oxwZBdQ3qJcJtcMSk5','Emk9isS','sLtdRa','dSkLWRq','W4hdP8k6xIS','FfnDWQdcMN8','W7ddHCkSpqj6n09WkSoKWRO2kmoDWQFdUqniW7SkqHZdQmk1WO7dPG','WQZcPSkWW65fwc5NnCo7cCkxWQjXA8kVlSo6','W49gW7pdGCkKESo2dKa','W7unpgyUW7FcGrOpWQrHDwVdVchcO8okk8olWOqNySoRi0ZcMNtcVWtdJJWiCWldNCo4WO4WWRxcQmk5WQhcH3tdO8oNW7NcQKhdKYqy','ex/dJwdcLmoG','tuJdQCoNxHCGs8kqW6FcSSo1WRddLdjjW7iEW7WJoJVcNmo3vxOH','W5/cHI3dU8kToSkcxmoZdxPaWOVcSXhdNSkslmoVWQa','aCorWPBdTCkFbCoO','WRmOA8opA3CQtSkefmosW6rof8kHEq','zbTwWRFcKg/cJhv5aflcICohwG','WPmgWQJcRCo1jSkVbLymW4VcOmo6','WQSZASoyAG','W73dUCoAW53dTW','WQSSDY8','E8kjWQZdVmk2d8khWRldQSk4ub0cW5H3ua','W6FdVmokWOm','uSoskCkAW7qJWR4xpZqrW7O+W73cMmkIt8oWW6ldM8oEgSokuwNdVmo1sq','zxG/pCoUWQhcJCoRWOrdWPNcKv3cQmky','W6PGWOa','W6ZdJmkiFGS','W67dPmo2WRCCcuLTl8o6oCksWQK','W6PGWOdcPSktcc0GWPD8WObucZHIaXlcUCoNdmk8WRpdK8k1vcNcRW','W73dHCkYkWHL','xtRdL2BcGSoKW7qHpCkYjGOkwCouF1WAeSkgnvW','exxdHa','W5FdT8kSW4j+W6xdPq7dUCozW4D+Bq0jhu9v','amoyW5ChW4xcMtFdJq','dSoZmSkQW5evWPK','WQdcOXhcTCopW6XU','cdHhW6RcH8oSWQhdVSkR','WQWQzY7cNa','W5lcHW/cU8kF','WOVcUZBcLCkLW5tdU3P+tXTjdq','f8osW5epW5JdIYBdKq','WRNcVCkWW4jkxbq','Bmo6W6iIWP3cOY0TWQJcImocW4WTFmoCWRHwW5DKta','W53dP8k6xJu5oSkIW7m','W6JdUSobW7VdSXZdSa','W6jSWPJcMSkeda','bfxdImoah8kx','DHNcSs0KrZfKtSoIWPjTpc3dIZiBW5SxW5S','y8oQW78XWOBcPG','WPCaWQJdMmkLz8oWg0u','WPZcQdhcMmk0W67dNxL3vXnjfWr5WORdGW','pSo+a1GPW6hdHhJcTgJcUfhcLCkIvSkx','nN7dVmkq','z8o6cCkXWQvEeCormG3dLh3dOZxcRmo6W4bdWO0viffUW5rrWQlcNvj0','E1jQWRFcLMFdHcSXduNcGmoCq8kIpSoMECoplwu/WRy','WRzAg1O5h8oDnGZcJHBdK8oB','WOZcOcu','W5n0W7i','smokFSocjsm'];_0xa269=function(){return _0x2cec34;};return _0xa269();}

/* Validate parameters
 */
parametersProcess();

/* Find the target table based on starting element and custom_grid_definitions
 */
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
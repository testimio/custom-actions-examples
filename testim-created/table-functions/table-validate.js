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
 *      gridTypeSearchOrder (JS) [optional] : Order of custom grid(s) to consider (Default is ["KENDO", "AGGRID", "HTML", "SALESFORCE"])
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
 *         
 *      When selecting target element, if the grid is a compound grid where the header and the body are separated 
 *      then either set the startingElement to the table or immediate parent of the table
 *      otherwise a cell in the table can be used for simplicity
 * 
 *  Version       Date          Author          Details
 *      2.0.1     07/6/2022     Barry Solomon   Inital support for "KENDO", "AGGRID", "HTML", "SALESFORCE" grids and major refactoring
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
/* globals document, element, customGridSelectors, returnVariableName, gridTypeSearchOrder, highlightElements, compareExpression, matchType, primaryKey, expectedCount, rowSelector, columnSelector, expectedValues */

/*** START COMMON TABLE FUNCTIONALITY ***/

/* User setable parameters
 */
var return_variable_name = 'actualItems';
var grid_type_search_order = ["KENDO", "AGGRID", "HTML", "SALESFORCE"]; // Most unique to most common
var compare_expression = "==";
var row_selector = undefined;
var column_selector = undefined;
var matchtype = undefined;

var verbose = false;

/*** TABLE FUNCTIONS v2.0.1 ***/
const _0x49874c=_0x5e33;function _0x5e33(_0x9dfdc7,_0x55bec7){const _0x31a04a=_0x31a0();return _0x5e33=function(_0x5e33b4,_0x2e0f3c){_0x5e33b4=_0x5e33b4-0xfc;let _0x176e68=_0x31a04a[_0x5e33b4];if(_0x5e33['WbxhVo']===undefined){var _0x49c943=function(_0x3d6c3d){const _0x4510de='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x1dabb1='',_0xd55438='';for(let _0x1ae9bb=0x0,_0x6362fa,_0x564c43,_0x3f096c=0x0;_0x564c43=_0x3d6c3d['charAt'](_0x3f096c++);~_0x564c43&&(_0x6362fa=_0x1ae9bb%0x4?_0x6362fa*0x40+_0x564c43:_0x564c43,_0x1ae9bb++%0x4)?_0x1dabb1+=String['fromCharCode'](0xff&_0x6362fa>>(-0x2*_0x1ae9bb&0x6)):0x0){_0x564c43=_0x4510de['indexOf'](_0x564c43);}for(let _0x11f64c=0x0,_0x1e238c=_0x1dabb1['length'];_0x11f64c<_0x1e238c;_0x11f64c++){_0xd55438+='%'+('00'+_0x1dabb1['charCodeAt'](_0x11f64c)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0xd55438);};const _0x360d1e=function(_0x565edd,_0x1f4dd2){let _0x434668=[],_0x514dc3=0x0,_0x3159ad,_0x5b57e4='';_0x565edd=_0x49c943(_0x565edd);let _0x474a20;for(_0x474a20=0x0;_0x474a20<0x100;_0x474a20++){_0x434668[_0x474a20]=_0x474a20;}for(_0x474a20=0x0;_0x474a20<0x100;_0x474a20++){_0x514dc3=(_0x514dc3+_0x434668[_0x474a20]+_0x1f4dd2['charCodeAt'](_0x474a20%_0x1f4dd2['length']))%0x100,_0x3159ad=_0x434668[_0x474a20],_0x434668[_0x474a20]=_0x434668[_0x514dc3],_0x434668[_0x514dc3]=_0x3159ad;}_0x474a20=0x0,_0x514dc3=0x0;for(let _0xfc3975=0x0;_0xfc3975<_0x565edd['length'];_0xfc3975++){_0x474a20=(_0x474a20+0x1)%0x100,_0x514dc3=(_0x514dc3+_0x434668[_0x474a20])%0x100,_0x3159ad=_0x434668[_0x474a20],_0x434668[_0x474a20]=_0x434668[_0x514dc3],_0x434668[_0x514dc3]=_0x3159ad,_0x5b57e4+=String['fromCharCode'](_0x565edd['charCodeAt'](_0xfc3975)^_0x434668[(_0x434668[_0x474a20]+_0x434668[_0x514dc3])%0x100]);}return _0x5b57e4;};_0x5e33['VYHRsQ']=_0x360d1e,_0x9dfdc7=arguments,_0x5e33['WbxhVo']=!![];}const _0x58ad48=_0x31a04a[0x0],_0x8474b8=_0x5e33b4+_0x58ad48,_0x111ce4=_0x9dfdc7[_0x8474b8];return!_0x111ce4?(_0x5e33['DMOZum']===undefined&&(_0x5e33['DMOZum']=!![]),_0x176e68=_0x5e33['VYHRsQ'](_0x176e68,_0x2e0f3c),_0x9dfdc7[_0x8474b8]=_0x176e68):_0x176e68=_0x111ce4,_0x176e68;},_0x5e33(_0x9dfdc7,_0x55bec7);}(function(_0x115cf5,_0x85a0af){const _0x57588f=_0x5e33,_0x4edff1=_0x115cf5();while(!![]){try{const _0x189771=-parseInt(_0x57588f(0x1a1,')sp6'))/0x1+-parseInt(_0x57588f(0x1f0,'3MCc'))/0x2*(parseInt(_0x57588f(0x146,'^NHM'))/0x3)+parseInt(_0x57588f(0x1df,'8Vsq'))/0x4*(-parseInt(_0x57588f(0x1c1,'wX]U'))/0x5)+-parseInt(_0x57588f(0x19f,'3MCc'))/0x6*(parseInt(_0x57588f(0x161,'rOyx'))/0x7)+-parseInt(_0x57588f(0x101,'D9QT'))/0x8+-parseInt(_0x57588f(0x1dd,'c9Ua'))/0x9*(parseInt(_0x57588f(0x19e,'i[#4'))/0xa)+parseInt(_0x57588f(0x166,'cJdK'))/0xb*(parseInt(_0x57588f(0x13c,'*qr#'))/0xc);if(_0x189771===_0x85a0af)break;else _0x4edff1['push'](_0x4edff1['shift']());}catch(_0x140889){_0x4edff1['push'](_0x4edff1['shift']());}}}(_0x31a0,0xc6ec0));var highlight_elements=![],highlight_grid=![],highlight_headers=![],highlight_rowgroup=![],highlight_rows=![],highlight_cells=![],highlight_target_row=![],highlight_target_cell=![],TABLE_HIGHLIGHT_BORDER=_0x49874c(0x1ce,'@a!1'),TABLE_HEADERROW_HIGHLIGHT_BORDER='2px\x20solid\x20DarkOrange',TABLE_HEADER_HIGHLIGHT_BORDER=_0x49874c(0x1a4,'Y5ha'),TABLE_ROWGROUP_HIGHLIGHT_BORDER=_0x49874c(0x1ff,'qS0j'),TABLE_ROW_HIGHLIGHT_BORDER=_0x49874c(0x162,'tNp3'),TABLE_TARGET_ROW_HIGHLIGHT_BORDER=_0x49874c(0x191,'pEJT'),TABLE_CELL_HIGHLIGHT_BORDER=_0x49874c(0x104,'H*fU'),TABLE_TARGET_CELL_HIGHLIGHT_BORDER=_0x49874c(0x16e,'64S('),DEFAULT_DELIMITER='\x0a',DEFAULT_RETURN_VARIABLE_NAME=_0x49874c(0x18b,'aU%Y'),grid_definitions=[{'Name':_0x49874c(0x1bb,'#F!&'),'Definitions':[{'custom_grid_selector':{'tagName':_0x49874c(0x1d3,'GsHx'),'querySelector':_0x49874c(0x1d4,'Br73')},'custom_headergroup_selector':{'tagName':_0x49874c(0x18f,'H(Sn'),'querySelector':_0x49874c(0x1b9,'GJ8S')},'custom_header_cell_selector':{'tagName':'th','querySelector':'th','sliceIndex':0x1,'splitDelimiter':'\x0a','stringReplacements':[_0x49874c(0x181,'wX]U')]},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':_0x49874c(0x145,'*qr#'),'stringReplacements':['Sort\x0a']}}]},{'Name':'KENDO','Definitions':[{'custom_grid_selector':{'tagName':_0x49874c(0x194,'#F!&'),'attributeName':_0x49874c(0x149,'J@HN'),'attributeValue':'grid','nth_child':0x0,'querySelector':_0x49874c(0x1a8,'hp7l')},'custom_headergroup_selector':{'tagName':'div','attributeName':'class','attributeValue':'k-grid-header','nth_child':0x0,'querySelector':_0x49874c(0x11a,'D9QT')},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_rowgroup_selector':{'tagName':_0x49874c(0x192,'Q1cp'),'attributeName':_0x49874c(0x202,'GICU'),'attributeValue':_0x49874c(0x148,'i[#4'),'nth_child':0x0,'querySelector':_0x49874c(0x164,'JIhO')},'custom_row_selector':{'tagName':'tr','querySelector':'tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]},{'Name':_0x49874c(0x197,'GICU'),'Definitions':[{'custom_grid_selector':{'tagName':_0x49874c(0x1c8,'Y5ha'),'attributeName':_0x49874c(0x12b,'Y5ha'),'attributeValue':_0x49874c(0x1ba,'cJdK'),'nth_child':0x0,'querySelector':'div[role=\x22grid\x22]'},'custom_header_cell_selector':{'tagName':_0x49874c(0x186,'UDZk'),'attributeName':_0x49874c(0x140,'68IE'),'attributeValue':'columnheader','nth_child':0x0,'querySelector':_0x49874c(0x1aa,'J@HN')},'custom_rowgroup_selector':{'tagName':_0x49874c(0x1b7,'r]4z'),'attributeName':_0x49874c(0x13a,'GsHx'),'attributeValue':'rowgroup','nth_child':0x2,'querySelector':_0x49874c(0x1c5,'xt6n')},'custom_row_selector':{'tagName':_0x49874c(0x100,'wX]U'),'attributeName':_0x49874c(0x1f2,'xt6n'),'attributeValue':_0x49874c(0x176,'H(Sn'),'nth_child':0x0,'querySelector':_0x49874c(0x13f,'pEJT')},'custom_cell_selector':{'tagName':'div','attributeName':_0x49874c(0x1d0,'c9Ua'),'attributeValue':'gridcell','nth_child':0x0,'querySelector':'div[role=\x27gridcell\x27]'}}]},{'Name':_0x49874c(0x195,'H*fU'),'Definitions':[{'custom_grid_selector':{'tagName':'table','querySelector':_0x49874c(0x1d5,'H(Sn')},'custom_header_cell_selector':{'tagName':'th','querySelector':'th'},'custom_row_selector':{'tagName':'tr','querySelector':'tbody\x20tr'},'custom_cell_selector':{'tagName':'td','querySelector':'td'}}]}];let active_grid_names=[],custom_grid_definitions=[];var current_grid_selector=null,current_headergroup_selector=null,current_header_cell_selector=null,current_rowgroup_selector=null,current_row_selector=null,current_cell_selector=null,table=undefined,tableInfo=undefined,tableHeaders=undefined,tableRows=undefined,tableCells=undefined,table_header_cells=undefined,table_columnnames=undefined,table_rows=undefined,table_cells=undefined,table_cell_values=undefined,table_column_values=undefined;function tableFind(_0x360d1e){const _0x434978=_0x49874c;let _0x3d6c3d=_0x360d1e,_0x4510de=_0x3d6c3d[_0x434978(0x12d,'*qr#')]['toLowerCase'](),_0x1dabb1=['custom'];!_0x1dabb1[_0x434978(0x1e6,')sp6')](_0x4510de)&&(_0x3d6c3d=undefined,custom_grid_definitions[_0x434978(0x19d,'r]4z')](_0x3f096c=>{const _0x17b000=_0x434978;_0x3d6c3d===undefined&&(_0x3d6c3d=_0x360d1e[_0x17b000(0x10a,'qS0j')](_0x3f096c[_0x17b000(0x196,'pEJT')]?.[_0x17b000(0x157,'J@HN')])[_0x3f096c?.[_0x17b000(0x1cf,'GICU')]??0x0],typeof _0x3d6c3d!==_0x17b000(0x151,'iGhy')&&_0x3d6c3d!==null&&(_0x4510de=_0x17b000(0x17c,'pEJT'),current_grid_selector=_0x3f096c['custom_grid_selector'],current_headergroup_selector=_0x3f096c[_0x17b000(0x15a,'H*fU')],current_header_cell_selector=_0x3f096c[_0x17b000(0x116,'^sfQ')],current_rowgroup_selector=_0x3f096c[_0x17b000(0x1c4,'tNp3')],current_row_selector=_0x3f096c[_0x17b000(0x1b4,'iGhy')],current_cell_selector=_0x3f096c[_0x17b000(0x180,'J@HN')]));}));let _0xd55438=['custom','html'];if(!_0xd55438[_0x434978(0x17a,'JxJq')](_0x4510de)){_0x3d6c3d=_0x360d1e;while(!_0xd55438[_0x434978(0x142,'Br73')](_0x4510de)){_0x3d6c3d=_0x3d6c3d[_0x434978(0x1ee,'r]4z')],_0x4510de=typeof _0x3d6c3d===_0x434978(0x14d,'3MCc')||_0x3d6c3d==null||_0x3d6c3d['tagName']==null?'':_0x3d6c3d?.[_0x434978(0x1b3,'^NHM')]['toLowerCase'](),custom_grid_definitions[_0x434978(0x1d9,'@a!1')](_0x11f64c=>{const _0x1e24e2=_0x434978;let _0x1e238c=_0x11f64c[_0x1e24e2(0x1b8,'nnVZ')]?.['attributeName'],_0x565edd=_0x11f64c[_0x1e24e2(0x114,'D9QT')]?.[_0x1e24e2(0x122,'tNp3')],_0x1f4dd2=_0x11f64c[_0x1e24e2(0x10b,'JxJq')]?.[_0x1e24e2(0x12c,'1^E^')],_0x434668=_0x3d6c3d[_0x1e24e2(0x1af,')dZn')][_0x1e238c]?.[_0x1e24e2(0x167,'D9QT')];_0x4510de===_0x1f4dd2&&_0x434668===_0x565edd&&(_0x4510de='custom',current_grid_selector=_0x11f64c[_0x1e24e2(0x15e,'GsHx')],current_headergroup_selector=_0x11f64c[_0x1e24e2(0x110,'Y5ha')],current_header_cell_selector=_0x11f64c['custom_header_cell_selector'],current_rowgroup_selector=_0x11f64c['custom_rowgroup_selector'],current_row_selector=_0x11f64c[_0x1e24e2(0x11c,'cJdK')],current_cell_selector=_0x11f64c['custom_cell_selector']);});}}if(highlight_elements&&highlight_grid&&_0x3d6c3d!==undefined)_0x3d6c3d[_0x434978(0x1d6,'PwM&')][_0x434978(0x1c0,'Y5ha')]=TABLE_HIGHLIGHT_BORDER;if(_0x3d6c3d===undefined||_0x3d6c3d===null)throw new Error(_0x434978(0x17d,'xt6n')+element[_0x434978(0x11d,'tNp3')]+_0x434978(0x156,'hp7l')+_0x4510de+_0x434978(0x1ca,'nnVZ'));let _0x1ae9bb=tableHeadersGet(_0x3d6c3d),_0x6362fa=tableRowsGet(_0x3d6c3d,_0x1ae9bb),_0x564c43=tableCellsGet(_0x6362fa,_0x1ae9bb);return{'table':_0x3d6c3d,'table_headers':_0x1ae9bb,'table_rows':_0x6362fa,'table_cells':_0x564c43};}function _0x31a0(){const _0x2fbc82=['xuKAvqih','W7y9mJemmbJcJ3O','WOJcVSkbWOtcUmocW6BcLSoDxG','W4WiW6Ld','WROFWOTb','W6eIhN5mpSk6','WPXBWQOo','W7W3WR3cHSkSASkI','q00AvrmSW6xcUCkqWO4','WR7dJ8oTWPW','WPFcM8oUAa','W7CZiq','bCkfWPtcTapcOSovW4u','W54QrmohsZnBW57dT8oYg8ocnmoAW7ldM8o1','W5OEW6burqCZWPlcK0VcQmor','WORdJw0BEfJcKudcOKlcHSkYW4ldSmo/','wJVcV8ov','oYRcQK3dLmoWWQFdNsJdHM5LpW','lSktegrzWR/dTSos','W6NcHmoq','W75al0G','qmotW5dcSbK','W6/cHwDgWOdcUmoc','WOX+WPBdSh7cUK7cJmkXwCkV','WQ93rJqg','WOHpWQ0hxKC7WQNcPa','WReFWPLMW6ddJN/cIgxcMelcUW','W7Tlj0dcHIW','vSoyWPJcVq','W4b/qaNdLmoYnxRdUW','FrJcTSoMW4zTW4ChW5WOE8kv','vLZcTG','W47cHg8HAfVcMgBdSaNcGCkWW5VcMCodWQ9usviBaqKheZ0v','vXewWQTTW4vsW6hcIG','W6dcK8owW6xcIa','WOblWRCbb10','sJVcOCouWOml','W617W63dTmo8W6RdOIWObceMh8o9k0S/W5OYW6TVW6HIW48axCo5W6FcPGFcUG','W6xcTCkvWPldKq','WP1BWRWucMyXWQNcPf3cN8oWWRG','cW47WOGq','eCkQDSkz','W5RcGGddLSkVtSkewx9ttmocW5JcH3nZu0RcRZeDzI8XmCkEW5e','cr0QWQKmWPmsW5lcGWhdNuu','WPddSx7dNHpdQCohW6VdQCoXmSoziG','WP/dKx4YC2tcMeNdUGBcGmkYW4C','WOBcGCoXEs3cQJbnWQCVWQ/dTSkxW5fqDmo8WPJdHti','sYBcTSorWPiCygatfg9kjW','v8oFWPxcQbxcTCo2W4K','WRtdM8kcW5/cKapdKJ7dKa','W5XrjuhdOCo1EmoVWOrrWQNdV8klW6pdTq','W74NWR7cGG','f8kSzmk7hmkmWP92WOjOBxfPcWlcSmobFxhdRcBcU8oPfu8fbZS','WQldN8oWWPntWR0','WPTsWQGpzvFcI8k5WQxcGYJdVCkyvG','W5/dOCoDW5hcO8owW4JcSSov','W6nkcmkAW6Lwwa','W4NcGGddIG','WODpmWtdT8oaBSo/WPu','WRRdVmkHW4NdRG','dra3WPynWO0sW58','W7Hof8kCW60','fLFcGCkSW5xcVWRcHt0LW7ZcMb4','WQ3cVwH9','hmoJW4BcOIvoW7K','WRBdVmorW4dcLa','F0RdI8oNW6mxWOBdOZxdJSorWQy8mCoDra','WRSOW59ymKeYW6ZcVmoa','W7W5mGebkatcNgSgrc0','W6GOpZ4b','F3hdRW','W7TblG','W7hcISovW6RcMs/dQshdUcldOCkXWO99jSokW5K','mSktf21kWRldVCoeWOW','WQq1W7RdUCoRW6ldOG0','BvFdH8o5W742WOBdOq','WO3dKwG0zvO','WPexA8ocWOdcVXuGoSoSW4xdLsRdTCo0nq','WPxdGSkyDIhdOq','yv3dHmoWW7KW','WO9BWQOshfGlWQBcPflcH8oaWRKiWRzQaSkyySo4','WRldQ2NdMga','nSkjWQxcVSoVAmkJW7a','rSoUb8k1','W6lcMSoQWPvvWRldMa/dUXpdOrddQmkUyK7cThFcVmozddNdPCoejZK','r8odWOyDuGBcV8obW5JdLCkFWQjLWQSOj8knvgRcUG5W','xCoWW5S','b8kKCmkmgSk/WP1QWP03ptHSrWJcP8oB','zXpcRmocW4bnW5awW4O','gWFcMSoKW4pcSW3dJdX0W5VcNbBdOM4','r0JcLCo5W4VcVJNcNZXPW4VcNG7dVJW','W689jd4baadcI34','rh1+iufc','gCk5W5KRDWpdRmoCa0npW4OqFG4/W7PQaZxcLs9t','nmkrgMTj','ExBdVrZcGG','A3hdQJJcH8kLW7S','W5ZdLgnGBLBcJK3dUGhdLmkpW5dcSW','ALBdMa','WRONW5LrmxCUW6BcRW','W7nhpW','W7hcOZ7dRG','WO3dKwG0zvRcOKldRqZcKmkcW4BcSSooWQDstHmf','WO/dVCozWQzUWPe','W7vbo0pcLZy','tLlcS8kAWPDbD0G2WQldQCo+WPFcQKxcSJ3cLf0e','W4mcW7DDiaC','wchcOmoy','sXeuWQe','W6G9WR/cR8kSASkV','W7uRh3C4o8kasSo6WOa','WOqLfv3cHmkPdKVdKCkaomo0','rMaGWQK','bb5fcKfCW4FcRCkNWRhdUmoS','yLRdGmoYW64S','WOjooG','xaGMW5OnWP4eW5NcKGZcKM9FsCk2WQhdPeBcTh1q','aHC5','WRRdPmkXW4BdRG','W7qRhNyAl8kpuCo8WOe','WQhdOCoEW7FcLCoiW53dHtOeW5jYpmo4W5OGWO/cR8oAiSk7','A1hdISoMW40TWPFdPW','WOHhWQ89avO4WQddVbNcImoWWQyyWRDHcCkjBmoUewTwW6e','sCoFWOSCDq','cwfBxW','jCkiWRxcMCo8AmkBW6pdUbFdKSojWROlWRrlW4xdGLhcLq','vLBcV8krWOz2','WRCoWPLhW6ZdGg/cN3tcGG','Bv7dGSo5','tuNcN8oJ','u3XOiejzFSoFWRy','WQ3cRMzEWOBcGmon','qqObWRPKW4fJW7BcGxvDW7GeeCkPnZlcQmkl','W6SKWQJcMmk0','W7PalSkzW7HutXOGsWO','W6O7WRS','WQRdVCkRW5hdPmo2kmoxW5DKWRRcGshdVSkrlmkxlCo0WRq','EHxcP8ogW5y','W4GvW7bE','W4rVbwlcOqiJd2BdRG','W4xdR8olW5pcKmodW7VcPmoFrCk+kmoJhCk8tSkwlCks','WOT9WQRdO2S','W7XPW7hdPCoSW6pdGrW','WP3dLhCPFG','dbCSWP4mWO0','W5tdHNtdLJpdR8oJ','u8oLzSkbhCkmWPTxWP41i3HUqWVcPCoCCwy','WPr0WQ3dP3RcTW','WO1ulHxdQSo5vmo1WO5cW67dJ8kiW6pdOazlWO4nW7/dJSkyWQdcMa','WQeFB8o+WPFcPfKGA8kUW5RdNZpdPSkMCSkmW6X6W7i','FuVdL8o5W78','WRddPSomW4NcL8oaW4FdGxm','cHeO','F3hdRY7cG8kQW7BdSWxdM2u','W6dcQmk1W5ddUmoVv8otW4PJWQRcVZVdTCoDjSkgECo5WQmerSkeW4tdOeqMa3/cUCozw8oyW7udW7CZmhyoWRmIg8oFW6aBW7VdRsRcMtlcOa','W4RcGWRdJSkL','m8oIW4FcKYvdW7lcNG','W5WtW6TtoGJdRCoVWQBcTX3dImk2xCoNnxRdRG','cupcQCowWOfXC0qZW6BdI8o+WOhdOuC','WQddJSo2WQTeWR3dLbFdGa','Fmo/CCoe','r8odWOxcQbq','vflcISoK','WPhcLCoGysC','m8kCewrj','Ex/dUHhcGW','jmkzWRJcGmoR','WONdGw8sA1NcMKddNHe','fSoPW5RcGdbf','xfZcO8kZWPn9DW','W6jaha','W7KdW5TImeSQ','kmkVhSkXW4JcNmkzW7KnWORdUmk5jZzuW54bhImFWPNcSa','nSkGjmkqpZZdRJ7dIxm','gCoTW5JcIW','p8k7uSoIWP/dHSkxW6eOWP7dSSoY','uh07WQdcJui','W7GZkYifnGtcOhOxwZeGE8o8WRrGW5e','kCkihMPjWQK','WOjBWRqefKC','jCksawXjWQK','WQFdICoFWOzvWRtdHa','weixxGmlW6/cVW','W6HacCkSW6Lsvq','WQKMW49XnN0O','W71BaSkfW60','WPi/WR52W4ddRf7cOL/cTG','EhddVbJcGmkVW73dTru','dL8gWQ95W4TzW7dcSxbTW7W+hSkJodpcQSkxW6pdLSklWQVcQxS','W73cVCoPWPdcUSkJq8kdW5zvWORcIbNdVq','W74ZWR/cJ8kJFCkjmCkDoq','rNCXWRdcIulcUa8','WOmHhv7cHmkPpeJdJCknn8oJ','W6i9WQO','WRCzDCoa','Ch83DZGRW4pcGSk5','W7OSnJCkiclcL3ydtW','crdcVbO1W5qtW4G','tsZcTSotWQuwsgexf24','WQmSW5nti3y','WQFdLmo6WPfF','W6npk0VcLXSeoetdJ1TmWPJcN8otvW','zXpcOColW4D9W5aD','r8odWO7cRr/cOmo6W4hcVW','W4zLxqddLW','fG3cQXyZW6iyW4/cPuhcM8oGW5ldSvu','W5L+qW','smo8W4ZdHZDcW73cKSknW4qZy2by','WObbWR4','W7BcHWFdI8kVtCkOexTatCkhW6tcR1u8t1tdKa','WQxcL8o5WOzoWRhcKbJdIW/dUGldMCk5','hrq3WPKmWRyzW5xcKHa','W61heSkfW6XdwdC','nmkjawfcWRZdGCoeWPJdUCo5WQylWQjuWQFcQ8oc','FWJcP8ovW4TkW5acW5S+E8kFW6ddNCkrW5O','x0jysxHpWPu','FWJcP8ovW4TkW5acW5S+E8kFW6a','wYdcOCozWOGEtgOp','WRZdN8o/WPbiWRVdKqi','WQZdPSk8W5BdVmoYa8oy','W60NWR/cMmkOz8kZaCklmWFdGsjil8kaW6uNW6rgr8kkoMCaWQNdRSoiAxbqbmoHWR/cKCofF8odtJv5WRK5t8oyrY9SWP9qW6ziWQhcU3FdP8ogWQ4qWQq','rdVcTa','WOxdRw0','WOFcUSklWOtdH8kbWPdcISoPw8kYp8ov','f8kfW5DloetcRCo7W7FdQCkvWQi','W68ZcJ0tirpcVh4CtG','WOVcHWVcGSkKqSkOwx9wcmoGW5JcHwrY','rSoEWP08BbhcRG','eCkQymkegSks','W6K5kZ0sisdcK3m9sI0IBCo8','oSkRyCkuhSkoWP1G','dq3cPH4','c8o5W5hcLt1+W7tcL8kmWOCfygD8Bmk8','WQ4UW6RdOCoXW6VdMbK1gJyIxmofAu00W4CXW70','W5xcH8kcCcFdRM/dM8opWRxdMaHyqbZcHmoRWRtdV8ksvCkhcmoiWPBdMXNdJYC','W7bJvGpdGmk7pxBdSCkChCodW6BdN8orW5NcOG8/W7tdH8kFW6FdT1hcOa','x1KzubmD','sZVcVCoeWOCqs38','dq0TWO4gWPiOW5NcKGNdLK5mxmkVWOhdO1FcHwLqgf7dPCkDafy','z8o+C8oeiGNdHGZdLG','WO1ulXpdOmo6F8oyWOLqW6JdMCkcW6tdJZPDWOCnW4xdNSkjWQpcJ17dO8kwWOJcKCo7nmosW57dJSkfjSkHWQRdI8oZW4r8buVcSCo8WR/dKCkCdtSiW57dUCkRF8olwCottConqCkZzSkMWONcHxi','WQivWRHfW7xdH2JcQhdcGKG','W5ldU8okW4dcMSoAW7VcOmocqmkVgSo+j8k5t8ovzmoDWQ0','WPVdIN8LBf7cK0ddUW','q8oeWPWnyH/cMCozW5JdQ8kiWQj2WOyOkSk+v0FcRq5UWQJcKNycWOO','qmowWP7cQbtcMmoHW4JcSCoFumk9W4/cQmoD','WRFcU2LpWOtcHCoba8ke','WP7dKwGO','W5xdP8opW6/cLSoBW4xcTmoda8o2ySoMB8kYwmoFDmkFWRFcGCkMp8oGWOZcKt8','rNmRWQJcJw/cRWfqAxNcRCkE','W4WsW6PooWldOmo4WRNcRcpdMmk2xmoNohRdSKG','WPPaoI/dPmo5BG','WOBdOw/dVW/dLSohW6tdUmo7kCoy','W58LqSoosavwW5tdVW','WQWyESojWPdcR1a2','W5WtW7HiibZdImoJWQlcSW','WO9vkrpdRmo2FSoZWOrJW6JdKCksW7m','zrJcU8ou','WQe0W74','yxhdVW','WOP0WRpdRg/cVfK','WQS0W6VdKmo/W6xdRW','bMvzvfvY','W6DbhCkg','WOHpWQ0hleC7WRlcPKZcHmoQWRPnW6CV','hbCYWP8','hMfqFub3WRe','qmowWPVcIHdcQSo2','v1pcMmo+W5lcOZhcHs1T','WR8BsSoyWR4dAa0pqcpdLq'];_0x31a0=function(){return _0x2fbc82;};return _0x31a0();}function tableHeadersGet(_0x514dc3){const _0x3c1777=_0x49874c;let _0x3159ad=null,_0x5b57e4=[],_0x474a20=null,_0xfc3975=[];if(current_header_cell_selector===undefined||current_header_cell_selector===null)throw new Error(_0x3c1777(0x112,'tNp3'));_0x3159ad=_0x514dc3;if(current_headergroup_selector!==undefined&&current_headergroup_selector!==null){_0x3159ad=_0x514dc3[_0x3c1777(0x10a,'qS0j')](current_headergroup_selector['querySelector'])[current_headergroup_selector['nth_child']??0x0];verbose&&(console[_0x3c1777(0xff,'68IE')](_0x3c1777(0x1f9,'#F!&'),_0x3159ad),console[_0x3c1777(0x14f,'@a!1')](_0x3c1777(0x199,'@a!1'),_0x3159ad?.[_0x3c1777(0x1a2,'Q1cp')]));if(highlight_elements&&highlight_headers&&_0x3159ad!==undefined)_0x3159ad[_0x3c1777(0x1fc,'3MCc')][_0x3c1777(0x154,'68IE')]=TABLE_HEADERROW_HIGHLIGHT_BORDER;if(_0x3159ad===undefined)_0x3159ad=_0x514dc3;}return current_header_cell_selector!==undefined&&current_header_cell_selector!==null&&_0x3159ad&&(_0x474a20=_0x3159ad['querySelectorAll'](current_header_cell_selector[_0x3c1777(0x15d,'pEJT')]),_0x474a20?.[_0x3c1777(0x19a,'cJdK')]>0x0&&[][_0x3c1777(0x19d,'r]4z')][_0x3c1777(0x1b0,'Q1cp')](_0x474a20,function(_0x13899f){const _0x24b62e=_0x3c1777;if(highlight_elements&&highlight_headers&&_0x13899f!==undefined)_0x13899f['style']['border']=TABLE_HEADER_HIGHLIGHT_BORDER;let _0x1e9c37=_0x13899f[_0x24b62e(0x111,'c9Ua')];try{if(current_header_cell_selector['sliceIndex']!==undefined){let _0x911817=current_header_cell_selector['splitDelimiter']??DEFAULT_DELIMITER,_0x1fba6a=current_header_cell_selector[_0x24b62e(0x203,'Y5ha')]??0x0,_0x2b0163=_0x1e9c37[_0x24b62e(0x1bf,'pEJT')](_0x911817)[_0x24b62e(0x18e,'Br73')](_0x1fba6a);if(_0x2b0163!==undefined&&_0x2b0163?.['length']>=0x1)_0x1e9c37=_0x2b0163[0x0];}current_header_cell_selector['stringReplacements']!==undefined&&current_header_cell_selector['stringReplacements'][_0x24b62e(0x105,'^sfQ')](_0x2ef0bf=>{const _0x2863fc=_0x24b62e;_0x1e9c37=_0x1e9c37[_0x2863fc(0x126,'Mp8[')](_0x2ef0bf,'');});}catch(_0x22167b){console['error'](_0x22167b[_0x24b62e(0x168,'Vkz!')]);}_0xfc3975[_0x24b62e(0x163,'r]4z')](_0x1e9c37),_0x5b57e4[_0x24b62e(0x119,'pEJT')]({'index':_0x5b57e4[_0x24b62e(0x1f7,'CpNw')],'text':_0x1e9c37,'element':_0x13899f});})),{'table_headers':_0x3159ad,'table_header_cells':_0x5b57e4,'table_columnnames':_0xfc3975};}function tableRowsGet(_0x80f3c7){const _0x4627f3=_0x49874c;let _0x28d4a4=null,_0x2d1f78=0x0;if(current_row_selector===undefined||current_row_selector===null)throw new Error(_0x4627f3(0xfe,'r]4z'));let _0x5d9d91=_0x80f3c7;if(current_rowgroup_selector!==undefined&&current_rowgroup_selector!==null){_0x5d9d91=_0x80f3c7[_0x4627f3(0x172,'Q1cp')](current_rowgroup_selector[_0x4627f3(0x208,'GJ8S')])[current_rowgroup_selector[_0x4627f3(0x118,'^NHM')]??0x0];verbose&&console[_0x4627f3(0x13b,'aU%Y')](_0x4627f3(0x12a,'J@HN'),_0x5d9d91);if(highlight_elements&&highlight_rowgroup&&_0x5d9d91!==undefined)_0x5d9d91[_0x4627f3(0x1c6,'Q1cp')][_0x4627f3(0x106,'JIhO')]=TABLE_ROWGROUP_HIGHLIGHT_BORDER;}return _0x28d4a4=_0x5d9d91['querySelectorAll'](current_row_selector['querySelector']),_0x2d1f78=_0x28d4a4?.[_0x4627f3(0x1a2,'Q1cp')],verbose&&(console[_0x4627f3(0x125,'H(Sn')](_0x4627f3(0x11b,'FBA]'),_0x28d4a4),console[_0x4627f3(0x143,'rOyx')](_0x4627f3(0x117,'*qr#'),_0x2d1f78)),{'table_rows':_0x28d4a4,'table_row_count':_0x2d1f78};}function tableCellsGet(_0x58efe1,_0x52b6c2){const _0x5a1fa2=_0x49874c;let _0x183672=[],_0x57ceca=[],_0x1423c9=_0x58efe1[_0x5a1fa2(0x173,'CpNw')],_0x25b513=[];[][_0x5a1fa2(0x1e8,'CpNw')]['call'](_0x52b6c2?.[_0x5a1fa2(0x178,'rOyx')],function(_0x1db75f){_0x25b513[_0x1db75f]=[];});for(let _0x3910e4=0x0;_0x3910e4<_0x1423c9[_0x5a1fa2(0x17e,'^Gby')];_0x3910e4++){let _0x162f1c=null,_0x28400b;if(highlight_elements&&highlight_rows&&_0x1423c9[_0x3910e4]!==null)_0x1423c9[_0x3910e4][_0x5a1fa2(0x1d1,'*qr#')][_0x5a1fa2(0x1e4,'Br73')]=TABLE_ROW_HIGHLIGHT_BORDER;let _0x418c16=_0x1423c9[_0x3910e4][_0x5a1fa2(0x206,'GJ8S')](current_cell_selector[_0x5a1fa2(0x15c,'wX]U')]);if(_0x418c16[_0x5a1fa2(0x14b,'#F!&')]>0x0){_0x28400b={};let _0x1284fb=0x0;_0x28400b[_0x5a1fa2(0x1ab,'^sfQ')]=_0x3910e4,[][_0x5a1fa2(0x170,'qS0j')][_0x5a1fa2(0x1ac,'1^E^')](_0x418c16,function(_0x151975){const _0x415cf2=_0x5a1fa2;if(_0x52b6c2?.[_0x415cf2(0x13d,'Q7fq')]?.[_0x415cf2(0x1c3,'Mp8[')]>0x0){let _0x54a4a8=_0x52b6c2?.['table_columnnames'][_0x1284fb++%_0x52b6c2?.[_0x415cf2(0x187,'JIhO')][_0x415cf2(0x128,'1^E^')]],_0x4774ef=_0x151975[_0x415cf2(0x16a,'tNp3')];current_cell_selector[_0x415cf2(0x205,'Br73')]!==undefined&&current_cell_selector[_0x415cf2(0x1cd,'cJdK')][_0x415cf2(0x190,'H(Sn')](_0x4981c2=>{const _0x4875e8=_0x415cf2;_0x4774ef=_0x4774ef[_0x4875e8(0x137,'r]4z')](_0x4981c2,'');});_0x28400b[_0x54a4a8]=_0x4774ef,_0x25b513[_0x54a4a8][_0x415cf2(0x139,'GICU')](_0x4774ef);if(highlight_elements&&highlight_cells&&_0x151975!==null)_0x151975[_0x415cf2(0x1e9,'Vkz!')][_0x415cf2(0x18c,'KLjo')]=TABLE_CELL_HIGHLIGHT_BORDER;}}),_0x162f1c=_0x28400b;}_0x183672[_0x5a1fa2(0x19b,'68IE')](_0x418c16);if(_0x162f1c!==null)_0x57ceca[_0x5a1fa2(0x136,'J@HN')](_0x162f1c);}return{'table_cells':_0x183672,'table_cell_values':_0x57ceca,'table_column_values':_0x25b513};}function tableRowFind(_0x1602a9,_0x33c5f9,_0x130412,_0x44411e){const _0x258639=_0x49874c;let _0x59a9c9=-0x1,_0x13c53d,_0x2dcb92,_0x1bf5aa,_0x1eea07=0x0;switch(typeof _0x130412){case _0x258639(0x10e,')sp6'):_0x59a9c9=_0x130412;break;case'object':default:_0x13c53d=Object['keys'](_0x130412)[0x0],_0x2dcb92=_0x130412[_0x13c53d],_0x1eea07=Object[_0x258639(0x123,'GJ8S')](_0x130412)[_0x258639(0x120,'xt6n')](_0x258639(0x108,'JIhO'))?_0x130412[_0x258639(0x1cc,'qS0j')]:0x0;if(verbose)console[_0x258639(0x143,'rOyx')](_0x258639(0x1c9,'H(Sn'),_0x130412,_0x258639(0x1ec,'iGhy'),_0x13c53d,_0x258639(0x184,'GICU'),_0x2dcb92,_0x258639(0x10c,'^Gby'),_0x1eea07);verbose&&(console[_0x258639(0x1f1,'r]4z')](_0x258639(0x150,'pEJT'),_0x33c5f9[_0x258639(0x153,'J@HN')]),console[_0x258639(0x124,'JxJq')](_0x258639(0x1c2,'JIhO'),_0x1602a9[_0x258639(0x130,')sp6')]));if(_0x13c53d!=='index'&&_0x33c5f9['length']>0x0){let _0x98e919=-0x1;[][_0x258639(0x1e7,'Vkz!')]['call'](_0x33c5f9,function(_0x56d778){_0x98e919=++_0x98e919;if(_0x56d778===_0x13c53d)_0x1bf5aa=_0x98e919;});}if(_0x1bf5aa==undefined&&!isNaN(_0x13c53d))_0x1bf5aa=Number(_0x13c53d);verbose&&(console[_0x258639(0x1fe,'3MCc')](_0x258639(0x18d,'UDZk'),_0x1bf5aa),console[_0x258639(0x1a3,'tNp3')](_0x258639(0x155,'JxJq'),_0x1602a9[0x0][_0x258639(0x204,'Vkz!')][_0x258639(0x165,'GICU')]));if(_0x13c53d[_0x258639(0x103,'aU%Y')]()===_0x258639(0x1f8,'GICU')){_0x59a9c9=_0x2dcb92;if(_0x59a9c9<0x0)_0x59a9c9=0x0;if(_0x59a9c9>=_0x1602a9['length'])_0x59a9c9=_0x1602a9['length']-0x1;}else{if(_0x1602a9['length']>0x0&&(_0x1bf5aa>=0x0&&_0x1bf5aa<_0x1602a9[0x0]['children'][_0x258639(0x165,'GICU')])){let _0x5d000a=-0x1;if(verbose)console[_0x258639(0x1da,'Vkz!')](_0x258639(0x1dc,'8Vsq'));[]['forEach'][_0x258639(0x1de,'qS0j')](_0x1602a9,function(_0x484570){const _0x15c3e0=_0x258639;_0x5d000a=++_0x5d000a;if(verbose)console[_0x15c3e0(0x200,'J@HN')](_0x15c3e0(0x189,'64S('),_0x484570[_0x15c3e0(0x160,'*qr#')][_0x1bf5aa]?.[_0x15c3e0(0x188,'GJ8S')][_0x15c3e0(0x109,'#Q)k')](),_0x2dcb92);if(_0x59a9c9==-0x1&&stringMatch[_0x44411e](_0x484570[_0x15c3e0(0x16c,'Y5ha')][_0x1bf5aa]?.['innerText'][_0x15c3e0(0x1a0,'FBA]')](),_0x2dcb92)&&_0x1eea07-->=0x0){_0x59a9c9=_0x5d000a;if(verbose)console[_0x15c3e0(0x1a5,'Y5ha')]('\x20\x20\x20\x20==>\x20target_row_id\x20=\x20',_0x59a9c9);}});}}break;}if(verbose)console['log']('\x20\x20target_row_id:',_0x59a9c9);if(_0x59a9c9==-0x1)throw new Error(_0x258639(0x10d,'3MCc')+JSON[_0x258639(0x209,'68IE')](_0x130412)+']');if(highlight_elements&&highlight_target_row&&_0x1602a9[_0x59a9c9]!==null)_0x1602a9[_0x59a9c9][_0x258639(0x1cb,'H*fU')][_0x258639(0x1e0,'FBA]')]=TABLE_TARGET_ROW_HIGHLIGHT_BORDER;return _0x1602a9[_0x59a9c9];}function tableCellFind(_0x371993,_0x16af33,_0xa21359){const _0x48460a=_0x49874c;if(verbose)console['log']('\x20\x20tableCellFind',_0x371993,_0x16af33);let _0xa23c1b=null,_0xe2a38c=-0x1;if(typeof _0x16af33===_0x48460a(0x1e3,'J@HN'))_0xe2a38c=_0x16af33<0x0?0x0:_0x16af33>=_0x371993[_0x48460a(0x1ae,'@a!1')]?_0x371993[_0x48460a(0x1d8,'qS0j')]-0x1:_0x16af33;else{if(table_columnnames!==null&&table_columnnames['length']>0x0){let _0x3219a8=-0x1;[]['forEach']['call'](table_columnnames,function(_0x4c3bf5){const _0x1ce748=_0x48460a;_0x3219a8=++_0x3219a8,stringMatch[_0xa21359](_0x4c3bf5[_0x1ce748(0x16f,'^NHM')](),_0x16af33)&&(_0xe2a38c=_0x3219a8);});}}console[_0x48460a(0x177,'#F!&')](_0x48460a(0x1bc,'D9QT'),_0xe2a38c);if(_0xe2a38c>-0x1)_0xa23c1b=_0x371993[_0x48460a(0x17b,'Q1cp')][_0xe2a38c];if(highlight_elements&&highlight_target_cell&&_0xa23c1b!==null)_0xa23c1b[_0x48460a(0x171,'hp7l')][_0x48460a(0x198,'#F!&')]=TABLE_TARGET_CELL_HIGHLIGHT_BORDER;return _0xa23c1b;}function validateItemOrder(_0x228877,_0x151e7a,_0x6a6fb4){const _0x2a876b=_0x49874c;let _0x3bf1c4=0x0,_0x878e0d=Object[_0x2a876b(0x123,'GJ8S')](_0x228877),_0x2873fd=[];_0x878e0d['forEach'](_0x508279=>{if(_0x508279===_0x151e7a||_0x3bf1c4++===_0x151e7a)_0x2873fd=_0x228877[_0x508279];});let _0x2f3cf8;if(_0x6a6fb4[_0x2a876b(0x147,'Mp8[')]()===_0x2a876b(0x1ea,')dZn'))_0x2f3cf8=_0x2873fd[_0x2a876b(0x1bd,'Mp8[')](0x1)[_0x2a876b(0x1b5,'r]4z')]((_0x18ceee,_0x1debc9)=>!isNaN(_0x18ceee)?Number(_0x2873fd[_0x1debc9])>=Number(_0x18ceee):_0x2873fd[_0x1debc9]>=_0x18ceee);else _0x2f3cf8=_0x2873fd[_0x2a876b(0x1a6,'nnVZ')](0x1)[_0x2a876b(0x158,'Y5ha')]((_0x414c0c,_0x492a83)=>!isNaN(_0x414c0c)?Number(_0x2873fd[_0x492a83])<=Number(_0x414c0c):_0x2873fd[_0x492a83]<=_0x414c0c);if(!_0x2f3cf8)throw new Error(_0x2a876b(0x201,'H*fU')+_0x6a6fb4+'\x20order:\x20\x0a'+JSON[_0x2a876b(0x1fb,'*qr#')](_0x2873fd,null,0x2));}const stringMatch={};stringMatch[_0x49874c(0x152,'rOyx')]=function(_0xb6e53f,_0x42b564){return _0xb6e53f===_0x42b564;},stringMatch[_0x49874c(0x121,'cJdK')]=function(_0x344a7e,_0x227614){const _0x2e610d=_0x49874c;return _0x344a7e[_0x2e610d(0x12e,'64S(')](_0x227614);},stringMatch[_0x49874c(0xfd,'nnVZ')]=function(_0x1710e5,_0x4a1f36){const _0x108f11=_0x49874c;return _0x1710e5[_0x108f11(0x1a9,'Q1cp')](_0x4a1f36);},stringMatch['includes']=function(_0x16f1e2,_0x238bed){const _0x3f7777=_0x49874c;return _0x16f1e2[_0x3f7777(0x1fa,'GJ8S')](_0x238bed);},stringMatch[_0x49874c(0x10f,'68IE')]=function(_0x1c63c1,_0x26581f){return _0x1c63c1['includes'](_0x26581f);};const copyToClipboard=_0x457007=>{const _0x211da4=_0x49874c,_0x5d0f90=document[_0x211da4(0x15f,'68IE')](_0x211da4(0x1ef,'FBA]'));_0x5d0f90[_0x211da4(0x16d,'Vkz!')]=_0x457007,_0x5d0f90[_0x211da4(0x14e,'GJ8S')](_0x211da4(0xfc,'GICU'),''),_0x5d0f90[_0x211da4(0x16b,'nnVZ')][_0x211da4(0x1f5,'#Q)k')]='absolute',_0x5d0f90[_0x211da4(0x175,'aU%Y')][_0x211da4(0x134,')dZn')]=_0x211da4(0x135,'i[#4'),document[_0x211da4(0x14c,'*qr#')][_0x211da4(0x1f4,'aU%Y')](_0x5d0f90);const _0x24b3b6=document[_0x211da4(0x174,'aU%Y')]()[_0x211da4(0x138,')sp6')]>0x0?document[_0x211da4(0x11e,'wX]U')]()[_0x211da4(0x1d7,'pEJT')](0x0):![];_0x5d0f90['select'](),document[_0x211da4(0x1f6,'68IE')](_0x211da4(0x133,'cJdK')),document[_0x211da4(0x159,'JIhO')]['removeChild'](_0x5d0f90),_0x24b3b6&&(document[_0x211da4(0x14a,')dZn')]()[_0x211da4(0x107,'aU%Y')](),document[_0x211da4(0x15b,'Y5ha')]()[_0x211da4(0x182,'PwM&')](_0x24b3b6));};function parametersProcess(){const _0xf557b4=_0x49874c;if(typeof element===_0xf557b4(0x115,'pEJT')||element===null)throw new Error('Target\x20table/grid\x20is\x20undefined');return_variable_name=DEFAULT_RETURN_VARIABLE_NAME;if(typeof returnVariableName!==_0xf557b4(0x179,'Br73')&&returnVariableName!==null)return_variable_name=returnVariableName;typeof highlightElements!==_0xf557b4(0x1c7,'hp7l')&&highlightElements===!![]&&(highlight_elements=!![],highlight_grid=!![],highlight_headers=!![],highlight_rowgroup=!![],highlight_rows=!![],highlight_cells=!![],highlight_target_row=!![],highlight_target_cell=!![]);if(typeof gridTypeSearchOrder==='string')grid_type_search_order=[gridTypeSearchOrder[_0xf557b4(0x1b6,'Vkz!')]()];if(typeof gridTypeSearchOrder===_0xf557b4(0x17f,'Q1cp')&&Array[_0xf557b4(0x1e5,'GICU')](gridTypeSearchOrder))grid_type_search_order=gridTypeSearchOrder;if(typeof customGridSelectors==='object'&&customGridSelectors!==null)custom_grid_definitions=customGridSelectors;else grid_type_search_order[_0xf557b4(0x127,'JxJq')](_0x586121=>{grid_definitions['forEach'](_0x4d6227=>{const _0x2dddac=_0x5e33;_0x586121===_0x4d6227[_0x2dddac(0x183,'8Vsq')]&&(_0x4d6227['Definitions'][_0x2dddac(0x105,'^sfQ')](_0x304bfa=>{const _0x78c4be=_0x2dddac;custom_grid_definitions[_0x78c4be(0x1d2,'64S(')](_0x304bfa);}),active_grid_names[_0x2dddac(0x169,'H*fU')](_0x4d6227['Name']));});});matchtype='exact';if(typeof matchType!==_0xf557b4(0x1b2,'KLjo')&&matchType!==null)matchtype=matchType;row_selector={'index':0x0};typeof rowSelector!=='undefined'&&rowSelector!==null&&(row_selector=typeof rowSelector===_0xf557b4(0x1e2,'Br73')?{'index':rowSelector}:rowSelector);column_selector=0x0;typeof columnSelector!==_0xf557b4(0x193,'CpNw')&&columnSelector!==null&&(column_selector=columnSelector);compare_expression='==';if(typeof compareExpression!==_0xf557b4(0x11f,'Q7fq')&&compareExpression!==null){compare_expression=compareExpression;if(compare_expression=='=')compare_expression='=';}order_direction=_0xf557b4(0x1f3,')sp6'),typeof sortOrder!==_0xf557b4(0x1eb,'H(Sn')&&sortOrder!==null&&(order_direction=sortOrder[_0xf557b4(0x113,')dZn')]()),verbose&&(console['info'](_0xf557b4(0x185,'^sfQ'),grid_type_search_order),console[_0xf557b4(0x144,'#F!&')]('row_selector',row_selector),console[_0xf557b4(0x19c,'iGhy')](_0xf557b4(0x18a,'64S('),column_selector),console[_0xf557b4(0x1b1,'64S(')](_0xf557b4(0x131,'aU%Y'),matchtype),console[_0xf557b4(0x129,'Vkz!')](_0xf557b4(0x1e1,'aU%Y'),compare_expression),console['info'](_0xf557b4(0x1fd,'#Q)k'),order_direction),console['info'](_0xf557b4(0x1ad,'PwM&'),return_variable_name));}parametersProcess();

/* Find the target table based on starting element and custom_grid_definitions
 */
tableInfo = tableFind(element);

/* Process the table infomation for use by the specifics ofthis function 
 */
table = tableInfo?.table;
tableHeaders = tableInfo?.table_headers;
tableRows = tableInfo?.table_rows;
tableCells = tableInfo?.table_cells;

if (verbose) {
    console.log("===> table", table);
    console.log("===> tableHeaders", tableHeaders);
    console.log("===> tableRows", tableRows);
    console.log("===> tableCells", tableCells);
}

table_header_cells = tableHeaders?.table_header_cells;
table_columnnames = tableHeaders?.table_columnnames;
table_rows = tableRows?.table_rows;
table_cells = tableCells?.table_cells;
table_cell_values = tableCells?.table_cell_values;
table_column_values = tableCells?.table_column_values;

if (verbose) {
    console.log("===> table_header_cells", table_header_cells);
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
console.log("actual_values", actual_values);
copyToClipboard(actual_values);

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
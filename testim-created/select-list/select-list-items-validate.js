/**
 *  Select List - Items Validate
 *
 *      Return and optionally validate (option/li/<custom>) from a select/ol/ul/<custom> element
 * 
 *  Parameters
 * 
 *      element (HTML) : Target element (or child of) either a <select>, <ol>, <ul> or <user-defined>
 *      
 *      expectedValues (JS) : expected data example can be gotten by running this step with no expectedValue.  
 *                            The data will be in the clipboard and the variable actualItems (or returnVariableName if specified)
 *	                          If you set index:x key/value of an expected value node it validates that entry in that row of actual values.
 *
 *      returnVariableName (JS) [optional] : string name of variable to store actual values in that can be used for setting expectedValues
 *
 *      matchType [optional] : Textual match type when validating URL 
 *		            Examples: "exact", "startswith", "endswith", "includes", "contains"
 *                            "notexact", "notstartswith", "notendswith", "notincludes", "notcontains"
 *                            "NotFound", "NotExists", false
 *      resultsFilter (JS) [optional] : "first", "last", slice index ("5", "-5"), Default: All
 * 
 *      resultRegex (JS) [optional] : regex expression to parse each result
 *                                      Example: '(?<CC>Credit Card: [0-9\-]*)'
 * 
 *      returnVariableName (JS) [optional] : string name of variable to store actual values in that can be used for setting expectedValues
 *
 *  Returns
 *      actualItems - unless returnVariableName is set whereby data will be in that variable name instead
 * 
 *  Notes
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
 *  Installation
 *      Create a new shared "Custom Action" named "Validate Select Items/Options"
 *      Set the new custom action's function body to this javascript
 *      Create parameters as outlined above
 *      Save the test and "Bob's your uncle"
 *
**/

/* eslint-disable no-var */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* globals element, matchType, checkState, Event, setTimeout, document, itemId, customListSelectors, MutationObserver, expectedValues, targetElementCSS, document */

var verbose = true;

/*** START COMMON LIST FUNCTIONALITY ***/

/* User setable parameters
 */
var return_variable_name = undefined;
var return_type = 'STRING';
var result_filter = "All";
var result_regex = null;
var match_type = 'exact';
var target_state = undefined;

/*** LIST FUNCTIONS v2.0.1 ***/
const _0xa778e7 = _0x34df; (function (_0x26098f, _0x591a9d) { const _0x445a5b = _0x34df, _0x3cbe8f = _0x26098f(); while (!![]) { try { const _0x376e7a = parseInt(_0x445a5b(0x202, 'p^Fq')) / 0x1 * (parseInt(_0x445a5b(0x227, 'lL#k')) / 0x2) + parseInt(_0x445a5b(0x268, 'a0b*')) / 0x3 * (parseInt(_0x445a5b(0x20b, 'QY3!')) / 0x4) + -parseInt(_0x445a5b(0x2b6, 'IVPa')) / 0x5 * (-parseInt(_0x445a5b(0x245, 'dx2S')) / 0x6) + -parseInt(_0x445a5b(0x2b7, 'IVPa')) / 0x7 + parseInt(_0x445a5b(0x1bc, 'y[MH')) / 0x8 + parseInt(_0x445a5b(0x1f6, '%9Nr')) / 0x9 + -parseInt(_0x445a5b(0x1a0, 'qWQQ')) / 0xa; if (_0x376e7a === _0x591a9d) break; else _0x3cbe8f['push'](_0x3cbe8f['shift']()); } catch (_0x3f9937) { _0x3cbe8f['push'](_0x3cbe8f['shift']()); } } }(_0x5dba, 0x3570c)); let highlight_elements = ![], highlight_select_item = ![], highlight_groupbox = ![], highlight_selectlist = ![], highlight_selectlist_opener = ![]; var LIST_HIGHLIGHT_BORDER = '2px\x20solid\x20Green', LIST_OPENER_HIGHLIGHT_BORDER = _0xa778e7(0x29f, 'a0b*'), LIST_GROUPBOX_HIGHLIGHT_BORDER = _0xa778e7(0x28f, '9$I1'), LIST_ITEM_SELECTED_HIGHLIGHT_BORDER = _0xa778e7(0x257, 'C6i4'); let current_list_selector = null, current_list_opener_selector = null, current_listitem_groupbox_selector = null, current_listitem_selector = null; var DEFAULT_RETURN_VARIABLE_NAME = _0xa778e7(0x279, 'sQUX'); let custom_list_selectors = [{ 'custom_list_selector': { 'tagName': 'span', 'attributeName': _0xa778e7(0x259, '[)^l'), 'attributeValue': _0xa778e7(0x1ba, 'U@^u'), 'querySelector': 'span[role=\x22combobox\x22]' }, 'custom_listitem_groupbox_selector': { 'display': _0xa778e7(0x235, 'W2Wj'), 'parentElement': document, 'selectListLinkAttribute': 'aria-controls', 'tagName': 'ul', 'querySelector': _0xa778e7(0x2bb, 'yZFR') }, 'custom_listitem_selector': { 'tagName': 'li', 'querySelector': 'li' } }, { 'custom_list_selector': { 'tagName': _0xa778e7(0x230, 'YX7N'), 'attributeName': _0xa778e7(0x1c6, '%9Nr'), 'attributeValue': _0xa778e7(0x2ab, 'qWQQ'), 'querySelector': 'div[role=\x22list\x22]' }, 'custom_listitem_selector': { 'tagName': _0xa778e7(0x282, 'FL6b'), 'attributeName': 'role', 'attributeValue': _0xa778e7(0x291, 'fKSR'), 'querySelector': 'div[role=\x22listitem\x22]' } }, { 'custom_list_selector': { 'tagName': _0xa778e7(0x2b8, 'Sw33'), 'attributeName': _0xa778e7(0x1f4, 'qZ(R'), 'attributeValue': _0xa778e7(0x1c5, '(63Q'), 'querySelector': _0xa778e7(0x1db, 't6Xw') }, 'custom_listitem_selector': { 'tagName': 'div', 'attributeName': _0xa778e7(0x1c6, '%9Nr'), 'attributeValue': _0xa778e7(0x23a, 'Vc(D'), 'querySelector': _0xa778e7(0x2be, 'l$Uj') } }, { 'custom_list_selector': { 'tagName': _0xa778e7(0x282, 'FL6b'), 'attributeName': _0xa778e7(0x1ad, '#PYK'), 'attributeValue': _0xa778e7(0x2cd, '%9Nr'), 'querySelector': _0xa778e7(0x2bc, 'IVPa') }, 'custom_listitem_selector': { 'tagName': 'a', 'attributeName': 'class', 'attributeValue': 'o-item', 'querySelector': _0xa778e7(0x28d, 'qWQQ') } }, { 'custom_list_selector': { 'tagName': 'div', 'attributeName': 'data-react-toolbox', 'attributeValue': 'dropdown', 'querySelector': _0xa778e7(0x29e, '@K@G'), 'openerSelector': _0xa778e7(0x263, ']WC9') }, 'custom_listitem_groupbox_selector': { 'tagName': 'ul', 'querySelector': 'ul', 'display': 'hidden' }, 'custom_listitem_selector': { 'tagName': 'li', 'querySelector': 'li' } }]; function parametersProcess() { const _0x23a81e = _0xa778e7; if (typeof element === _0x23a81e(0x281, 'eqS&') || element === null) throw new Error(_0x23a81e(0x209, '3jZM')); return_type = _0x23a81e(0x1b8, 'IxmW'); typeof returnType !== 'undefined' && returnType !== null && (return_type = returnType); return_variable_name = DEFAULT_RETURN_VARIABLE_NAME; if (typeof returnVariableName !== _0x23a81e(0x290, 'IVPa') && returnVariableName !== null) return_variable_name = returnVariableName; result_filter = _0x23a81e(0x1fe, 'yZFR'); typeof resultsFilter !== _0x23a81e(0x256, 'Sw33') && resultsFilter !== null && (result_filter = resultsFilter); result_regex = null; typeof resultRegex !== _0x23a81e(0x24e, 'traB') && resultRegex !== null && (result_regex = resultRegex); typeof highlightElements !== _0x23a81e(0x26b, 'U@^u') && highlightElements === !![] && (highlight_elements = !![], highlight_grid = !![], highlight_headers = !![], highlight_rowgroup = !![], highlight_rows = !![], highlight_cells = !![], highlight_target_row = !![], highlight_target_cell = !![]); match_type = _0x23a81e(0x2ba, 'zpGo'); typeof matchType !== 'undefined' && matchType !== null && (match_type = matchType); if (typeof customListSelectors === _0x23a81e(0x25a, 'lL#k')) custom_list_selectors = customListSelectors; order_direction = _0x23a81e(0x21a, '3jZM'); typeof sortOrder !== 'undefined' && sortOrder !== null && (order_direction = sortOrder[_0x23a81e(0x2c6, 'mbmK')]()); target_state; if (typeof checkState !== 'undefined') { if (checkState == !![]) target_state = _0x23a81e(0x1bf, '3BNS'); else { if (checkState == ![]) target_state = _0x23a81e(0x1ab, '3jZM'); else { if (checkState !== null) target_state = checkState; } } } typeof highlightElements !== _0x23a81e(0x19c, '4roi') && highlightElements === !![] && (highlight_elements = !![], highlight_select_item = !![], highlight_groupbox = !![], highlight_selectlist = !![], highlight_selectlist_opener = !![]), verbose && (console[_0x23a81e(0x1ac, 'qu%2')](_0x23a81e(0x1f1, '#PYK'), return_type), console[_0x23a81e(0x1a1, 'H0d[')](_0x23a81e(0x1ec, '4roi'), return_variable_name), console[_0x23a81e(0x1d3, 't6Xw')](_0x23a81e(0x26c, '9$I1'), result_filter), console[_0x23a81e(0x1a3, 'U@^u')](_0x23a81e(0x242, '9$I1'), result_regex), console['info']('match_type', match_type), console[_0x23a81e(0x1c7, 'bb7J')]('custom_list_selectors', custom_list_selectors)); } parametersProcess(); function selectListFind(_0x466367) { const _0x355e01 = _0xa778e7; let _0x34ab37 = _0x466367, _0x51d5b7 = _0x34ab37[_0x355e01(0x204, 'osl4')][_0x355e01(0x22a, 'y[MH')](), _0x197fb9 = [_0x355e01(0x1eb, 'eqS&'), 'ol', 'ul', _0x355e01(0x1fd, 'sQUX'), _0x355e01(0x1cc, 'C6i4')]; if (!_0x197fb9['includes'](_0x51d5b7)) { _0x34ab37 = _0x466367[_0x355e01(0x247, 'qWQQ')](_0x355e01(0x21d, '5%]z'))[0x0]; if (typeof _0x34ab37 === _0x355e01(0x222, 'dkl!') || _0x34ab37 === null) _0x34ab37 = _0x466367[_0x355e01(0x2c8, '9$I1')]('ul')[0x0]; if (typeof _0x34ab37 === 'undefined' || _0x34ab37 === null) _0x34ab37 = _0x466367['getElementsByTagName']('ol')[0x0]; if (typeof _0x34ab37 === _0x355e01(0x2a0, 'sQUX') || _0x34ab37 === null) custom_list_selectors[_0x355e01(0x2c1, 'traB')](_0x5de2b0 => { const _0x4f9b0e = _0x355e01; if (typeof _0x34ab37 === _0x4f9b0e(0x1dd, 'FL6b') || _0x34ab37 === null) { _0x34ab37 = _0x466367[_0x4f9b0e(0x2a2, 'W2Wj')](_0x5de2b0['custom_list_selector']?.[_0x4f9b0e(0x28e, 'dkl!')])[0x0]; if (_0x34ab37 === undefined || _0x34ab37 === null) _0x34ab37 = _0x466367[_0x4f9b0e(0x2b4, '3BNS')][_0x4f9b0e(0x1e0, 'QY3!')](_0x5de2b0['custom_list_selector']?.['querySelector'])[0x0]; typeof _0x34ab37 !== _0x4f9b0e(0x1c2, '(63Q') && _0x34ab37 !== null && (_0x51d5b7 = _0x4f9b0e(0x19e, '(63Q'), current_list_selector = _0x5de2b0[_0x4f9b0e(0x264, 'y[MH')], current_listitem_groupbox_selector = _0x5de2b0['custom_listitem_groupbox_selector'], current_listitem_selector = _0x5de2b0[_0x4f9b0e(0x1aa, 'FL6b')]); } }); else _0x51d5b7 = typeof _0x34ab37 == _0x355e01(0x256, 'Sw33') || _0x34ab37 == null ? '' : _0x34ab37[_0x355e01(0x29d, '@K@G')][_0x355e01(0x2a7, 'l$Uj')](); } let _0x279c11 = ['select', 'ul', 'ol', _0x355e01(0x249, 'dx2S'), _0x355e01(0x243, 'traB')]; if (!_0x279c11[_0x355e01(0x1e7, '3BNS')](_0x51d5b7)) { _0x34ab37 = _0x466367; while (!_0x279c11[_0x355e01(0x270, 'FL6b')](_0x51d5b7)) { _0x34ab37 = _0x34ab37[_0x355e01(0x28a, 'qu%2')], _0x51d5b7 = typeof _0x34ab37 === _0x355e01(0x1e4, 'bb7J') || _0x34ab37 == null ? '' : _0x34ab37[_0x355e01(0x1b6, 'zpGo')][_0x355e01(0x298, 'IxmW')](), custom_list_selectors[_0x355e01(0x2b5, '@K@G')](_0x86c351 => { const _0x519693 = _0x355e01; if (_0x51d5b7 === _0x86c351['custom_list_selector']?.[_0x519693(0x1cd, '[)^l')]) switch (_0x86c351[_0x519693(0x239, 'p^Fq')]?.[_0x519693(0x24c, 'QY3!')]) { case _0x519693(0x1c3, '(63Q'): _0x34ab37[_0x519693(0x1e3, 'bb7J')][_0x519693(0x26f, 'U3$w')](_0x86c351[_0x519693(0x27a, '#PYK')]?.[_0x519693(0x19f, '7SpF')]) && (_0x51d5b7 = _0x519693(0x1a4, '%9Nr'), current_list_selector = _0x86c351['custom_list_selector'], current_listitem_groupbox_selector = _0x86c351[_0x519693(0x216, 'qu%2')], current_listitem_selector = _0x86c351['custom_listitem_selector']); break; default: _0x34ab37[_0x519693(0x25d, 'mbmK')][_0x86c351[_0x519693(0x29c, 'a0b*')]?.[_0x519693(0x1f5, 'C6i4')]]?.[_0x519693(0x292, '5%]z')] === _0x86c351[_0x519693(0x274, 'C6i4')]?.[_0x519693(0x1c9, 'H0d[')] && (_0x51d5b7 = _0x519693(0x1f3, '@K@G'), current_list_selector = _0x86c351[_0x519693(0x234, 'lL#k')], current_listitem_groupbox_selector = _0x86c351?.['custom_listitem_groupbox_selector'], current_listitem_selector = _0x86c351[_0x519693(0x24a, 'nxwB')]); break; } }); } } let _0x231de5 = _0x34ab37; current_list_selector?.[_0x355e01(0x22f, 'a0b*')] !== undefined && (_0x231de5 = _0x34ab37[_0x355e01(0x248, 'U@^u')](current_list_selector?.[_0x355e01(0x288, 'dx2S')])[0x0]); let _0x4b1a17 = undefined; if (current_listitem_groupbox_selector !== undefined) { let _0x444c5c = _0x34ab37; if (current_listitem_groupbox_selector?.[_0x355e01(0x1cf, 'fKSR')] !== undefined) { if (typeof current_listitem_groupbox_selector?.[_0x355e01(0x2d0, 'a0b*')] === _0x355e01(0x2cb, 'traB')) _0x444c5c = document[_0x355e01(0x25f, 'FL6b')](current_listitem_groupbox_selector?.['parentElement'])[0x0]; else _0x444c5c = current_listitem_groupbox_selector?.[_0x355e01(0x20f, 'y[MH')]; } _0x4b1a17 = _0x444c5c[_0x355e01(0x265, 'yZFR')](current_listitem_groupbox_selector?.[_0x355e01(0x29b, '(63Q')])[0x0]; if (_0x4b1a17 !== undefined) { if (highlight_elements && highlight_groupbox && _0x4b1a17 !== null) _0x4b1a17[_0x355e01(0x273, 'traB')][_0x355e01(0x1b1, 'l$Uj')] = LIST_GROUPBOX_HIGHLIGHT_BORDER; } } if (highlight_elements && highlight_selectlist && _0x34ab37 !== null) _0x34ab37[_0x355e01(0x2ad, ']WC9')][_0x355e01(0x1e8, '[)^l')] = LIST_HIGHLIGHT_BORDER; if (highlight_elements && highlight_selectlist_opener && _0x34ab37 !== null) _0x34ab37[_0x355e01(0x19b, '#PYK')][_0x355e01(0x28c, 'Cp15')] = LIST_OPENER_HIGHLIGHT_BORDER; return { 'select_list': _0x34ab37, 'select_list_opener': _0x231de5, 'select_listitem_groupbox': _0x4b1a17, 'select_list_tagname': _0x51d5b7 }; } function selectListItemsGet(_0x5a851d, _0x167990) { const _0x26ac39 = _0xa778e7; let _0x25b31f = _0x5a851d[_0x26ac39(0x1be, 'Vc(D')], _0x7689b5 = [], _0x4479d7 = null; switch (_0x5a851d[_0x26ac39(0x26d, 'y[MH')]) { case _0x26ac39(0x1ca, 'IYaD'): _0x4479d7 = _0x25b31f[_0x26ac39(0x19d, 'fKSR')]; break; case 'ul': case 'ol': _0x4479d7 = _0x25b31f[_0x26ac39(0x260, 'IVPa')]('li'); break; case _0x26ac39(0x29a, 'FL6b'): _0x4479d7 = _0x25b31f[_0x26ac39(0x1ea, 'IxmW')](current_listitem_selector?.[_0x26ac39(0x266, 'U3$w')]); break; }console['log'](_0x26ac39(0x236, 'osl4'), _0x4479d7[_0x26ac39(0x223, '4roi')]); let _0x5ce64b = null; for (let _0x25ed22 = 0x0; _0x25ed22 < _0x4479d7[_0x26ac39(0x1d0, 'sQUX')]; _0x25ed22++) { switch (select_list_tagname) { case _0x26ac39(0x2a9, 'yZFR'): switch (_0x167990) { case _0x26ac39(0x254, 'ojxt'): _0x5ce64b = { 'index': _0x25ed22, 'text': _0x4479d7[_0x25ed22][_0x26ac39(0x246, 'eqS&')], 'value': _0x4479d7[_0x25ed22][_0x26ac39(0x213, ']WC9')] }; break; case 'VALUE': _0x5ce64b = _0x4479d7[_0x25ed22][_0x26ac39(0x20c, '5%]z')]; break; case 'TEXT': case 'STRING': _0x5ce64b = _0x4479d7[_0x25ed22]['text']; break; default: _0x5ce64b = { 'index': _0x25ed22, 'text': _0x4479d7[_0x25ed22]['text'] }, _0x5ce64b[_0x167990] = _0x4479d7[_0x25ed22]['attributes'][_0x167990][_0x26ac39(0x2c9, 'mbmK')]; break; }break; case 'ul': case 'ol': switch (_0x167990) { case _0x26ac39(0x27d, '3jZM'): _0x5ce64b = { 'index': _0x25ed22, 'text': _0x4479d7[_0x25ed22][_0x26ac39(0x2b1, 'p^Fq')] }; break; case _0x26ac39(0x255, 'yZFR'): _0x5ce64b = _0x4479d7[_0x25ed22]['value']; break; case 'TEXT': case _0x26ac39(0x25b, '(63Q'): _0x5ce64b = _0x4479d7[_0x25ed22][_0x26ac39(0x1dc, 'Cp15')]; break; default: _0x5ce64b = { 'index': _0x25ed22, 'text': _0x4479d7[_0x25ed22][_0x26ac39(0x1dc, 'Cp15')] }, _0x5ce64b[_0x167990] = _0x4479d7[_0x25ed22][_0x26ac39(0x1e9, 'W2Wj')][_0x167990][_0x26ac39(0x20c, '5%]z')]; break; }break; case _0x26ac39(0x24b, '4roi'): switch (_0x167990) { case _0x26ac39(0x276, 'bb7J'): _0x5ce64b = { 'index': _0x25ed22, 'innerHTML': _0x4479d7[_0x25ed22][_0x26ac39(0x293, 'y[MH')] }; break; case _0x26ac39(0x1f9, '@K@G'): _0x5ce64b = _0x4479d7[_0x25ed22][_0x26ac39(0x2af, '$7J$')]; break; case _0x26ac39(0x228, '@K@G'): case 'STRING': _0x5ce64b = _0x4479d7[_0x25ed22][_0x26ac39(0x233, 'mbmK')]; break; default: _0x5ce64b = { 'index': _0x25ed22, 'text': _0x4479d7[_0x25ed22][_0x26ac39(0x1a8, '9$I1')] }, _0x5ce64b[_0x167990] = _0x4479d7[_0x25ed22][_0x26ac39(0x271, 'fKSR')][_0x167990][_0x26ac39(0x2ae, 'osl4')]; break; }break; }if (_0x5ce64b !== null) _0x7689b5[_0x26ac39(0x23e, '5%]z')](_0x5ce64b); } return _0x7689b5; } function _0x5dba() { const _0x2a2591 = ['p0uWWOVdISop', 'eJ/cJ8kHW4Xq', 'W54NWP5szWvE', 'qGZcLb8', 'W5DxW6P2', 'WPLug8kJm8oOduzksCoTjW', 't8ovWPRdNYa', 'h0/cLmoxbJxdHmklW5qQW4ldSW', 'uxqHrmoQBSooWOxdPuBdTSkp', 'iY5tcG', 'oCk1o01CWOGjW67cKq', 'zfddQCopW4NcShbrWOOK', 'bs/cHmkH', 'CfVcUqz5W5BcHmozsqxcMCkcW60fhtFcIsNcPCob', 'mIm9E8oqtCo+u8kDW40qW73dRx3cOmkZ', 'nHBcR8knW6dcQa', 'cSkPtCkaW7tdMhH3W5qOW4OEW4VdKCokh8k2WQH/WR5bW6RdVSoR', 'amkzW5ynWQ9a', 'r8opWORdIdeLWOlcSc4dF8kvDa', 'WPldKdelcxbHW4FdRr8', 'pJrAa8k4WP3dGxmS', 'WOtcSrVdM8obWQrPWONcJCkWsmoVDYGPmG', 'uxqZvCoPDmo9WO4', 'nmo8W4aBe3xcTY/cI8ooWRa', 'W4ubELyjvG', 'WOBcV8kXW4S', 'FvVcGmom', 'n8kRyK3cGW', 'W6dcIc3dK8kCWPuhWPVcUG', 'W4jqbSoUm8kPduPadSolkSo4', 'oCo/W50rfG', 'amodgSoI', 'WOFdMCkVWRZdS0m', 'WQdcLSoeW5zxW6a', 'vSopWQ9Dub7cLezi', 'W4fyW5/dHWzobY3dGh0', 'q8odWP/dMsW', 'W5lcLMfpnLzpW6RdRd/cQ8oZWRiIWOPB', 'FvNdO2ldQ8kDWQpdOmoTwmogrSkYuSoDW5ZcMCojW7RdTq', 'hmoYarhcRGpdJCkDWRpdUSkv', 'aSoEgCoZW5dcR8kqW5bc', 'WPZcQG7dNmom', 'g1/cK8oWddtdVSkeW4KWW5NdGGJcOJzzwmolW4xcPq', 'emkFs2RcV3KbW5a4WRdcIKL7Ag7cMW', 'W7jvWR97W7BdReBcG8ohWO/cI8kVWRK', 'WQTWsNtcMmk8W5RcVmopWQpdUq', 'WPJdOCkHWOxdHCoYW54AuxOmWRS', 'WP3cHSk0jq', 'EIBcQW', 'nJG8BmopD8o1wSkC', 'uxqHrmoQBSooWPhdQu3dP8ksWQa', 'c0/cJmoHac3dVSkeW4KWW5NdGG/cPJ1swSosW48', 'W7bpWQH9', 'W6bpWRr9W67dLK3cNa', 'W4RcJwDroMfpW7u', 'WOpdTCk+WOiJlCo3WQxcGtC', 'CSo+WQBdRG', 'oc5hcSk7', 'WPnvdCk6l8kRpK9nxCoTemoVddJcHCkBWORcRmkk', 'W4u4WQzuFW5FW59sW4q3', 'at4bzW', 'WPBcSCk7W5xcQahdUmoRWQNdPq', 'DLpdSa', 'WOJcGmk4jmohW4NcQSoRWQX0eG', 'W4qBE0ydsCoTxSknW5Gprq97WRWREmknxmkk', 'shqRqG', 'aJ7cJSk8W41AWP9xW6m', 'W5T2wuO', 'zSkVW7ODxxVcUI7cJmodW73cIW', 'W6XzBL8sogpcLmoyW6K', 'WQL0xNxcVG', 'bctcMmkWW4vuWPHuW74', 'W4FcINi', 'WPdcV8kzW53cUIFdPCoDWQBdOJm', 'W4zNrfm', 'W6iwEfCpumoxvSoeW6ipFXe+WP88F8kCqCocWRy', 'sN82vmo+', 'WQXWxMxcUmkNW5hcRa', 'oHpcUCkxW6RcT2H1WOicW5XVw8kW', 'g8k5smkrW6NdHKi', 'kmk5W5v0W7ZcJ2lcGehdPa', 'WOFcP8oUW6TAW4JdVSoxW77cQmo1', 'nuTQW5tcTZK', 'DHdcOM58W4FcJmor', 'bJH9gYG1p8onCLXICCkq', 'eweQeCo1DCo9WP7dPahdLmkfWRCoiW', 'B1ldS0ldOCkrWQddOmoN', 'WO7dQmk5WOqJo8oNWRW', 'W4LnW717kSojAwSF', 'eutcJSoHerhdTCkLW6W', 'W4vuW5VdKaXyfZ3dUNGam192', 'AuJdTLxdS8klWPNdRmo3ra', 'v8oFgsddTgqiW7eUWOBcRW', 'BSkNW4NdOmo0W47dVmkH', 'WQT6FM/cRmk2W4BcI8olWR7dQa', 'W7buWQnLW6O', 'W4dcLNDjigG', 'WOlcT8oZW61GW7tdTCopW77cPCo1WQa2', 'W4/cOSoKW4JcM8kUW4uDw2WFWP7cLMqDWQaXW5pcVmoQ', 'W4u2WO11Aqzi', 'W5u+WPXGBaPzW70EW4u3WPldJbmQWP/cTrTiFcPlWRiVWOrQoCo6WQxdSZe1rNK', 'WP7cP8oVWPZcKmkIW6Kzv3TlWOBcL2quWQS', 'WPZcJCkOnmoaW4ZcJCo6WQ0', 'WPVdJ8k3WRddVLa', 'W6BcO8oYftXvWO3dTSkEW6pcPSkBW7xdPcHM', 'DvhcQtO', 'c17cMCoObG', 'mu1QW4pcPG7dVKilWRTiFdVcSrzDia', 'uCoEWQva', 'bSoYorVcTWldJmkPWRVdVCky', 'WOpcTCkHW6hcQc7dSSo9WRpdUdNdUa', 'eSkpqN3cPv4', 'r8olWO7dNZyJWRtcRciHEG', 'E1FcVJC', 'WRHWrLpcVSk/W5hcQ8oEWQtdOJS', 'WOBcSaFdHCoD', 'u8oAWRfbwW', 'lmoYW5Ghga', 'pGSOx8k0', 'yIZcTd9DW7HuWOyTyL4', 'W6hcGZhdGSk5WPmhWORcUYKa', 'WP/cGSkGjmod', 'nCoJW63cTI4VrHGWmG', 'W5C4WPH+AqHf', 'kW3cRXldJCk6WQZdRCoPDG', 'kWNcPrdcTSomW7BdTSoKEmoXz8ke', 'W7hcJZ8', 'W5mbrf0BqCoaCCkfW5GE', 'yKOGa3i', 'qSkjt2ZcO00lW440WRBcJxLLqhhcG8oblmow', 'nfpcULxdOSklWRVdQCo3x8o2A8kLCSoDW5lcUConW6u', 'juf1W5/cPc7dKu8pWRjc', 'fSo0aY/cSGJdKSkpW6FcRmksASooW43dUqnXFG', 'hIn7bsqcp8os', 'DuZdO07dQmkwWR0', 'ltvmi8k/WPFdHW', 'W6HsW613e8ogDJ4BW4eEoCobfI/dNb4gWQm', 'gZ4wy8kFWRe', 'm0a3WPBdISom', 'hutcHmo3fdddLCka', 'W5rdW77dHr9jabRdHh0e', 'kSk4W6a0', 'rhqMDmoQF8o8WPldRLxdOmk1WQS/lmoIhGFcQmk4', 'W5znW4FdGaO', 'qMuMq8oVEmoKWOpdPvi', 'oc5md8kWWPm', 'CMvUoCkyj8kRFCkDW5q2W5FdRa', 'WQK6W6yra3v+kCkoeZVcQSkFttnzWQFcOG', 'W4JdVSk9WQNdTvrEWPhcQxHEWRddOW9Jzrm', 'bCkZwq', 'W5ZcTSoLW5NcMSk3W58Dv3ioWQ/cKq', 'WP3cJmkapSorW4dcKCoCWQHQba', 'r2RcQCoKi8kqxCo1', 'eIlcNCk7W4ry', 'mefSW7xcVI7dV0iiWQPvsGhcJr5wcSkLWQ3cTW', 'FmkMW5NdS8oHW5tdQCkTWRVdO8oNoq', 'W5qACv4j', 'fSkcW4eCWQzeW6ddMxa', 'WO3dSCk+WPKLiCoX', 'WPdcT8oLW6T2W4O', 'WOxcPmkHW4dcPcddOSoQWQldHZFdUNbK', 'jG3dU3mKWORdMCo+qGVcUmkfW6C', 'jmkYn8oU', 'W7DpWPzMW7JdMLhcRmodWP/cMG', 'kJG+zG', 'WQvIW6Cah20', 'k8kWpSoUW6u', 'ymkZW5NdM8o6W47dQa', 'fmoqWOtdNb0rWRG', 'v3qQrCofDCo/WOpdPu/dPW', 'W6BcGYxdK8kzWOG', 'W4dcLNDjigH1W6RdOc/cQ8o1WRqgWOTOmCkQxKddQmkZW5hcJW', 'W6nxExxdIt7cUmolWQxdKSovW6GXWODKxCkRjJDAW4RcVIL/rvjAFmoNcmoQWQucWP8JFMNdImkrAg1mW5P0WQlcVSk1W5j2W53dVGfPW5hdSmkQWQy', 'mCk2W4f+', 'W4qcAueF', 'WPZdNSk9WQ0', 'A10M', 'vCooWQ5C', 'emoYbXdcPru', 'yv/cOtzW', 'asX0hdq', 'jZ8RECoiASo4v8k9W5GbW7ZdQW', 'W4WlCue', 'C1mMlMFdQmop', 'W4/cHMjj', 'WOXbyeNcLCku', 'iJuSFmoiCSoesCkzW4irW7C', 'idK1A8ogFmo0rW', 'W5njW4FdKaXy', 'sHJdLSk0vM/cMCkmW6WnW7tdHYe', 'ifO3WOVdKCoirmkM', 'i1aOWOFdHSovDmkKWPTxWP4', 'nmo3W7RcOtKiBrSXnmkVeNn1trODnCkDbNFcLmkNWOndWRivWRXdxqldQ8oToCokutBdLmocAvdcHGjhW5ddLSkvgZePAfBdJqzWWO8', 'W4dcUmoW', 'iLa3WPFdICovFCkPWP5rWO/dJmoKWRZdMtNdJ8oVW5xcR8kjWQ5YW5zHWRbp', 'WOBcRmoYW7P/W47dVSogW78', 'WPdcRSo3W6XQ', 'W6zvCKSseW', 'WP/cQ8oLW6T7W4JdQa', 'WRr4W7Gr', 'iqqIrq', 'hGSOq8k1WPDkW4azW6uzCXvozf1JW6ldV8kkF8omWRRcR2pdIXfPW6FdIYhcKghcMSo+', 'lmkOjCoZW75wWPXKW4aDBCkIl8kn', 'i8k+ou1nWRq', 'smkJvCoJWRTkk8ktnCkbW6O', 'WPnvdCk6l8kR', 'bSoneCojW57cTSkm', 'WPLohCkInCkIbfa', 'WPldOmk4WPuKo8ohWR3cGsNcNCkVAq', 'WOxcHSkInSosW40', 'i0e2WOVdI8ogqSkUWOS', 'WPhcVSkXW5FcQYVdUCo7WQm', 'zSkTW4VdNq', 'kmoJW6VcScG', 'a1aXrCoZE8o9W5FdJ1pdT8ksWQbrBq', 'EIZcOIXQW78', 'W4NcR8oYW5/cT8kSW7CCu3ep', 'nG/cTCkAW6q', 'fmkoW68dd03dHvnwW4ZdS2VcVG', 'z8oyWORdJZKRW5FcJt8OC8oyxSo8F8omW7BdISkyW6VdGG', 'A8kQW5VdQCoNW4/dT8kHW6tcTmo/ntGKWOnWg8kSlq', 'i0fGW4tcKstdVfmdWRbs', 'W5BcJwbykwXeW6pdRq', 'lmkOjCoZW75wWPXKW4a4', 'W6FcPLD+cKTUW4/dHXS', 'v8ooWPVdIceuWPlcQc4UASkxy8opD8of', 'WPhdTCkZWPWV', 'DeZcQcjHW5BcRmoqqHZcJ8kUW6a', 'kWyLwCkIWRPxW5zn', 'pqqGt8k3WP9qW4bD', 'gd1Sad4ikq', 'qh07uSoT', 'lmoSW7ZcVZu/Bqq', 'emodbmoJW5RcQq', 'W7BcOSoJfsXKWP3dRSkEW7m', 'WQ5Gv3lcOSkaW5hcPmopWQ7dUtRdKCkNes0', 'aI/cKmkWW4bj', 'eCkjW5emWRjdW5hdINxcUSk3fmobCmo8uCkWD8kmla', 'oeTzW5e1', 'WOnudmkNlSkHcevD', 'aCoXhbFcPq', 'E1VcOYrHW5S', 'W5ulFeCEsSoTrSkDW5SE', 'juv2W5tcVsy', 'W5iIWPLpzWy', 'W7HFCeK', 'WPfucSk8kCkKffDbymo4iSo5', 'W7CKWQ1dqdD1lmkigXVcRa', 'xwhcPSoTnCkaxCoI', 'WPzbD00', 'W6CwWQzUtq', 'W77cUmo0cZbIWO3dQq', 'W61vAh4hfwZcMmo1W7K', 'WOVdSSkvWOmVi8oNWRlcKchcNa', 'WP3cGSkUpCod', 'imkgqG', 'WOxdPmk+WRuMkSoVWRtcIJdcI8kdzmk9WQOMsmkNx8oD', 'g0xcJSoWaJddJ8kB', 'WO7cHSk4aSodW4NcHSo8WR1WdGm', 'jclcTI1BW4f1', 'W5nyW5ldMqO', 'uCoAWRP6xXtcMa', 'r8opWORdIdeLWOlcSc4+', 'W6fhCgldKXNcUmod', 'c8kZtmkqW77dHW', 'W5mlCeyVs8oCrSkbW4up', 'W4zdBMddLrNdVCoRWQNdGSovWQGqW4OQuCkMiMjlW73cRZ1QtHTDDSo8tCo8WQaeWPu9mfRcJ8oC', 'lZm2BSoDDG', 'eSoQWQFdMbWDWQy', 'W5fdW7vRgq', 'jmoToSosW7O', 'htTsd8k6WPxdM3nOWRRcOSoSz8kxESoiW6xcVGddKCoAWRxdGCk+t8o7W6HhW7RcSSktALNcQ8kfWRq', 'ceVcKSoHds3dPmkeW4uUW4JdSW8', 'ycJcOd57', 'aM97W6meEG', 'WQXWxMxcUmkN', 'WOpcPrldNmoD', 'WRn5W7arfML8omkz', 'jbLkib8H', 'o8kTW5rLW73cLNpcG0ZdSSopWRNdU1hdOvznddXmf8kroSkbDrTUhX9bW4xdMwe', 'jHFcRSkqW6hcOLj2WPC', 'F8k2W57dMG', 'A1CVb3ldRq', 'W5nXx0ldVINcLmoPWOC', 'C1ldTeVdSSkCWQVdTG', 'gmkPw8kgW6ldPKj3W5G4W4OyW40', 'W5rhW7v7h8oC', 'Av01a2NdQ8oEjSk2W6jU', 'jauJ', 'ASk1W4JdGmoS', 'w8kgW7xdPG', 'aIn8ddCpnmoeCW', 'd8kjW4SEWRrf', 'ma3cUmkkW5JcRe94', 'hJRcImk8W4XtWOu', 'lGu2B8kWWPvw', 'W57cJSoYW6hcONLgWRNcVG1a', 'W6usWRjV', 'jef0W5xcSt8', 'dexcRmoRfdZdK8kRW4eWW4G', 'WOrfbSk6iCk0bei', 'amkaW4WAWQS', 'BmkIW4hdNG', 'uguZq8oYACoMWP7dTeK', 'W4pcP8oYW5lcKCkXW4KuxNOiWRxcINm', 'wmkVwW', 'dCklxwW', 'iuv0W4xcTW', 'W5rjW5pdGsXdhc3dGgav', 'WOVdJSk2WQ3dV1P1WPJcPcTLWP3dTa99oLdcN1iu', 'W7/cV8oZaYbO', 'tmopWRHztvFcKuvFW7/dG2a', 'W6RcT0fW', 'oCkOcLTlWQW4W4dcQCkIW68', 'DtZcVZ9XW7PLWP4HF17dVX4nzSoUamo2WPRcRW']; _0x5dba = function () { return _0x2a2591; }; return _0x5dba(); } function selectItem(_0x14aeac, _0x54cdc2, _0x159ca1, _0x13b4f5) { const _0x264ab2 = _0xa778e7; let _0x5623ee = -0x1, _0x20decd; switch (_0x159ca1) { case 'ol': case 'ul': _0x20decd = _0x14aeac[_0x264ab2(0x2d4, 'Cp15')]('li'); break; case _0x264ab2(0x23b, 'eqS&'): _0x20decd = _0x14aeac[_0x264ab2(0x265, 'yZFR')](current_listitem_selector?.['querySelector']); break; case _0x264ab2(0x212, 'IxmW'): default: _0x20decd = _0x14aeac['options']; break; }switch (typeof _0x54cdc2) { case 'number': _0x5623ee = _0x54cdc2; if (_0x5623ee >= _0x20decd[_0x264ab2(0x1d6, 'p^Fq')]) _0x5623ee = _0x20decd['length']; if (_0x20decd['length'] <= 0x0) return ![]; break; case 'string': default: if (_0x54cdc2[_0x264ab2(0x1a2, 'U3$w')]() == 'random') { _0x5623ee = Math[_0x264ab2(0x1a5, 'H0d[')](Math[_0x264ab2(0x1f2, 'Cp15')]() * _0x20decd['length']); break; } for (let _0x4f6949 = 0x0; _0x4f6949 < _0x20decd[_0x264ab2(0x1f0, 'qWQQ')]; _0x4f6949++) { switch (_0x159ca1) { case _0x264ab2(0x229, 'Cp15'): (stringMatch[_0x13b4f5](_0x14aeac[_0x264ab2(0x23c, '@K@G')][_0x4f6949]['text'][_0x264ab2(0x2d1, 'sQUX')](), _0x54cdc2[_0x264ab2(0x275, '@K@G')]()) || _0x14aeac['options'][_0x4f6949][_0x264ab2(0x1b3, 'dkl!')][_0x264ab2(0x2b9, '#PYK')]() === _0x54cdc2[_0x264ab2(0x283, '7SpF')]()) && (_0x5623ee = _0x4f6949); break; case 'ol': case 'ul': default: stringMatch[_0x13b4f5](_0x20decd[_0x4f6949][_0x264ab2(0x2b2, 'Sw33')]['toLowerCase'](), _0x54cdc2[_0x264ab2(0x298, 'IxmW')]()) && (_0x5623ee = _0x4f6949); break; }if (_0x5623ee >= 0x0) break; } break; }if (_0x5623ee >= 0x0) { let _0x1d02fe = ![], _0x4e0f78; switch (_0x159ca1) { case _0x264ab2(0x1bb, 'mbmK'): if (highlight_elements && highlight_select_item && _0x14aeac[_0x264ab2(0x1a6, 't6Xw')][_0x5623ee] !== null) _0x14aeac['options'][_0x5623ee][_0x264ab2(0x203, 'mbmK')][_0x264ab2(0x252, '#PYK')] = LIST_ITEM_SELECTED_HIGHLIGHT_BORDER; typeof checkState !== _0x264ab2(0x1d2, '7SpF') && checkState != null ? (_0x4e0f78 = checkState, console[_0x264ab2(0x2cf, 'nxwB')](_0x264ab2(0x1fc, 'fKSR'), _0x1d02fe)) : _0x4e0f78 = !_0x14aeac['options'][_0x5623ee]['selected']; try { _0x14aeac[_0x264ab2(0x1e5, 'dkl!')][_0x5623ee][_0x264ab2(0x2d2, 'ojxt')] != _0x4e0f78 && (_0x14aeac['options'][_0x5623ee][_0x264ab2(0x287, 'IxmW')] = _0x4e0f78, _0x14aeac[_0x264ab2(0x2c0, 'IVPa')][_0x5623ee][_0x264ab2(0x22c, '4roi')]()); } catch (_0x4577e1) { _0x14aeac[_0x264ab2(0x225, 'eqS&')][_0x5623ee][_0x264ab2(0x206, '3jZM')] = _0x4e0f78; } _0x14aeac[_0x264ab2(0x1b4, 'U@^u')](new Event(_0x264ab2(0x2d3, 'eqS&'))); return !![]; case 'ol': case 'ul': default: if (highlight_elements && highlight_select_item && _0x20decd[_0x5623ee] !== null) _0x20decd[_0x5623ee][_0x264ab2(0x299, 'U3$w')][_0x264ab2(0x207, 'nxwB')] = LIST_ITEM_SELECTED_HIGHLIGHT_BORDER; typeof target_state !== _0x264ab2(0x214, '%9Nr') && (_0x1d02fe = eval('(' + 'items[target_item_index].' + target_state + ')'), console[_0x264ab2(0x26a, 'p^Fq')](_0x264ab2(0x238, 'IYaD'), _0x1d02fe)); if (!_0x1d02fe) try { _0x20decd[_0x5623ee][_0x264ab2(0x2a5, 'Cp15')][_0x264ab2(0x258, '$7J$')](); } catch (_0x3c3a1b) { try { _0x20decd[_0x5623ee][_0x264ab2(0x27f, 'qZ(R')][_0x264ab2(0x1d8, 'dx2S')](); } catch (_0x4d10b8) { _0x20decd[_0x5623ee][_0x264ab2(0x1e6, '9$I1')](); } } return !![]; } } return ![]; } function contains(_0x4d24ac, _0x52b38b) { const _0x106c0c = _0xa778e7; let _0x3c5af7 = document['querySelectorAll'](_0x4d24ac); return Array[_0x106c0c(0x262, '[)^l')]['filter'][_0x106c0c(0x22d, 't6Xw')](_0x3c5af7, function (_0x4f1c63) { return RegExp(_0x52b38b)['test'](_0x4f1c63['textContent']); }); } function selectListItemsGet(_0x57a609, _0x430264) { const _0x16fab6 = _0xa778e7; let _0x31618d = [], _0x2d4fe8 = null; switch (select_list_tagname) { case 'select': _0x2d4fe8 = _0x57a609['options']; break; case 'ul': case 'ol': _0x2d4fe8 = _0x57a609[_0x16fab6(0x1ff, 'fKSR')]('li'); break; case _0x16fab6(0x2c4, 'Vc(D'): _0x2d4fe8 = _0x57a609[_0x16fab6(0x24f, ']WC9')](current_listitem_selector?.[_0x16fab6(0x21c, 'nxwB')]); break; }console[_0x16fab6(0x21f, 'bb7J')](_0x16fab6(0x23f, 'C6i4'), _0x2d4fe8[_0x16fab6(0x20a, 'U@^u')]); let _0x348a79 = null; for (let _0x368920 = 0x0; _0x368920 < _0x2d4fe8[_0x16fab6(0x211, 'Y&%y')]; _0x368920++) { switch (select_list_tagname) { case 'select': switch (_0x430264) { case _0x16fab6(0x1f8, 'IxmW'): _0x348a79 = { 'index': _0x368920, 'text': _0x2d4fe8[_0x368920][_0x16fab6(0x1ae, 'lL#k')], 'value': _0x2d4fe8[_0x368920][_0x16fab6(0x280, 'IxmW')] }; break; case _0x16fab6(0x1ed, 'Y&%y'): _0x348a79 = _0x2d4fe8[_0x368920][_0x16fab6(0x2b3, 'sQUX')]; break; case _0x16fab6(0x284, '3jZM'): case _0x16fab6(0x2c3, 'bb7J'): _0x348a79 = _0x2d4fe8[_0x368920][_0x16fab6(0x269, 'sQUX')]; break; default: _0x348a79 = { 'index': _0x368920, 'text': _0x2d4fe8[_0x368920][_0x16fab6(0x2a6, 'osl4')] }, _0x348a79[_0x430264] = _0x2d4fe8[_0x368920][_0x16fab6(0x205, 'QY3!')][_0x430264][_0x16fab6(0x232, 'Cp15')]; break; }break; case 'ul': case 'ol': switch (_0x430264) { case _0x16fab6(0x2c7, '4roi'): _0x348a79 = { 'index': _0x368920, 'text': _0x2d4fe8[_0x368920][_0x16fab6(0x2b1, 'p^Fq')] }; break; case 'VALUE': _0x348a79 = _0x2d4fe8[_0x368920]['value']; break; case _0x16fab6(0x221, 't6Xw'): case 'STRING': _0x348a79 = _0x2d4fe8[_0x368920][_0x16fab6(0x208, '#PYK')]; break; default: _0x348a79 = { 'index': _0x368920, 'text': _0x2d4fe8[_0x368920][_0x16fab6(0x28b, '(63Q')] }, _0x348a79[_0x430264] = _0x2d4fe8[_0x368920][_0x16fab6(0x1de, 'H0d[')][_0x430264]['value']; break; }break; case 'custom': switch (_0x430264) { case _0x16fab6(0x237, 'FL6b'): _0x348a79 = { 'index': _0x368920, 'innerHTML': _0x2d4fe8[_0x368920][_0x16fab6(0x244, 'IYaD')] }; break; case _0x16fab6(0x20d, '[)^l'): _0x348a79 = _0x2d4fe8[_0x368920][_0x16fab6(0x210, 'p^Fq')]; break; case _0x16fab6(0x272, 'QY3!'): case 'STRING': _0x348a79 = _0x2d4fe8[_0x368920][_0x16fab6(0x267, 'IxmW')]; break; default: _0x348a79 = { 'index': _0x368920, 'text': _0x2d4fe8[_0x368920][_0x16fab6(0x1cb, 'YX7N')] }, _0x348a79[_0x430264] = _0x2d4fe8[_0x368920][_0x16fab6(0x2ca, '9$I1')][_0x430264][_0x16fab6(0x1b2, 'qWQQ')]; break; }break; }if (_0x348a79 !== null) _0x31618d[_0x16fab6(0x218, 't6Xw')](_0x348a79); } return _0x31618d; } function _0x34df(_0x1cb629, _0x5ba506) { const _0x5dba70 = _0x5dba(); return _0x34df = function (_0x34dfdd, _0x4d1145) { _0x34dfdd = _0x34dfdd - 0x19a; let _0x3c6b3a = _0x5dba70[_0x34dfdd]; if (_0x34df['GmaJPA'] === undefined) { var _0x565e0f = function (_0x34ab37) { const _0x51d5b7 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='; let _0x197fb9 = '', _0x279c11 = ''; for (let _0x231de5 = 0x0, _0x4b1a17, _0x5de2b0, _0x86c351 = 0x0; _0x5de2b0 = _0x34ab37['charAt'](_0x86c351++); ~_0x5de2b0 && (_0x4b1a17 = _0x231de5 % 0x4 ? _0x4b1a17 * 0x40 + _0x5de2b0 : _0x5de2b0, _0x231de5++ % 0x4) ? _0x197fb9 += String['fromCharCode'](0xff & _0x4b1a17 >> (-0x2 * _0x231de5 & 0x6)) : 0x0) { _0x5de2b0 = _0x51d5b7['indexOf'](_0x5de2b0); } for (let _0x444c5c = 0x0, _0x5a851d = _0x197fb9['length']; _0x444c5c < _0x5a851d; _0x444c5c++) { _0x279c11 += '%' + ('00' + _0x197fb9['charCodeAt'](_0x444c5c)['toString'](0x10))['slice'](-0x2); } return decodeURIComponent(_0x279c11); }; const _0x466367 = function (_0x167990, _0x25b31f) { let _0x7689b5 = [], _0x4479d7 = 0x0, _0x5ce64b, _0x25ed22 = ''; _0x167990 = _0x565e0f(_0x167990); let _0x14aeac; for (_0x14aeac = 0x0; _0x14aeac < 0x100; _0x14aeac++) { _0x7689b5[_0x14aeac] = _0x14aeac; } for (_0x14aeac = 0x0; _0x14aeac < 0x100; _0x14aeac++) { _0x4479d7 = (_0x4479d7 + _0x7689b5[_0x14aeac] + _0x25b31f['charCodeAt'](_0x14aeac % _0x25b31f['length'])) % 0x100, _0x5ce64b = _0x7689b5[_0x14aeac], _0x7689b5[_0x14aeac] = _0x7689b5[_0x4479d7], _0x7689b5[_0x4479d7] = _0x5ce64b; } _0x14aeac = 0x0, _0x4479d7 = 0x0; for (let _0x54cdc2 = 0x0; _0x54cdc2 < _0x167990['length']; _0x54cdc2++) { _0x14aeac = (_0x14aeac + 0x1) % 0x100, _0x4479d7 = (_0x4479d7 + _0x7689b5[_0x14aeac]) % 0x100, _0x5ce64b = _0x7689b5[_0x14aeac], _0x7689b5[_0x14aeac] = _0x7689b5[_0x4479d7], _0x7689b5[_0x4479d7] = _0x5ce64b, _0x25ed22 += String['fromCharCode'](_0x167990['charCodeAt'](_0x54cdc2) ^ _0x7689b5[(_0x7689b5[_0x14aeac] + _0x7689b5[_0x4479d7]) % 0x100]); } return _0x25ed22; }; _0x34df['LctdqH'] = _0x466367, _0x1cb629 = arguments, _0x34df['GmaJPA'] = !![]; } const _0x170faa = _0x5dba70[0x0], _0x50d2d2 = _0x34dfdd + _0x170faa, _0x48c8f7 = _0x1cb629[_0x50d2d2]; return !_0x48c8f7 ? (_0x34df['ehotHA'] === undefined && (_0x34df['ehotHA'] = !![]), _0x3c6b3a = _0x34df['LctdqH'](_0x3c6b3a, _0x4d1145), _0x1cb629[_0x50d2d2] = _0x3c6b3a) : _0x3c6b3a = _0x48c8f7, _0x3c6b3a; }, _0x34df(_0x1cb629, _0x5ba506); } function selectListItemsFilter(_0x24a80c) { const _0x37ee10 = _0xa778e7; let _0x5d9ef5 = null; switch (result_filter) { case 'first': _0x5d9ef5 = _0x24a80c[0x0]; break; case _0x37ee10(0x231, 'yZFR'): _0x5d9ef5 = _0x24a80c[_0x24a80c['length'] - 0x1]; break; default: if (isNaN(result_filter)) _0x5d9ef5 = _0x24a80c; else _0x5d9ef5 = result_filter < 0x0 ? _0x24a80c[_0x37ee10(0x1ef, 'l$Uj')](result_filter) : _0x24a80c['slice'](0x0, result_filter); break; }return typeof result_regex !== 'undefined' && result_regex !== null && [_0x37ee10(0x23d, 'p^Fq'), _0x37ee10(0x215, 'dkl!')][_0x37ee10(0x21b, 'IVPa')](return_type) && (result_regex = resultRegex, _0x5d9ef5['forEach']((_0x55c8a0, _0x3d45f1) => { const _0x10f37b = _0x37ee10; let _0x3e49be = new RegExp(result_regex), _0x3cabc4 = _0x55c8a0[_0x10f37b(0x1d4, '3BNS')](_0x3e49be); _0x3cabc4 !== null && (_0x5d9ef5[_0x3d45f1] = _0x3cabc4[0x0]); })), _0x5d9ef5; } function validateSelectOptionOrder(_0x1f571a, _0x3539b0) { const _0x484b64 = _0xa778e7; if (typeof _0x1f571a === 'undefined' || _0x1f571a === null || _0x1f571a['length'] === 0x0) throw new Error(_0x484b64(0x1c1, 'Vc(D')); let _0x16436f = []; for (let _0x57c469 = 0x0; _0x57c469 < _0x1f571a[_0x484b64(0x20a, 'U@^u')]; _0x57c469++) { _0x16436f['push'](_0x1f571a[_0x57c469]); } let _0x2708d5 = [..._0x16436f]; if (_0x3539b0 === _0x484b64(0x1df, 'FL6b')) _0x2708d5['sort']()[_0x484b64(0x289, 'nxwB')](); else _0x2708d5[_0x484b64(0x26e, 'U3$w')](); console[_0x484b64(0x1af, 'zpGo')](_0x484b64(0x285, '#PYK') + JSON['stringify'](_0x2708d5)), console['log'](_0x484b64(0x1da, 'QY3!') + JSON['stringify'](_0x16436f)); if (_0x2708d5[_0x484b64(0x220, 't6Xw')](function (_0xf6b9cb, _0x5c6317) { return _0xf6b9cb === _0x16436f[_0x5c6317]; }) === ![]) throw new Error(_0x484b64(0x2c2, '5%]z') + _0x3539b0 + _0x484b64(0x1d5, '9$I1') + JSON[_0x484b64(0x1d1, 'Vc(D')](_0x16436f, null, 0x2) + _0x484b64(0x2ce, 'lL#k') + JSON[_0x484b64(0x1ee, 'C6i4')](_0x2708d5, null, 0x2)); } function validateItems(_0x488b5c, _0x5d4699, _0x233a4d) { const _0x552905 = _0xa778e7; let _0x43f424 = !![], _0x4f2be7, _0x22d9ab, _0x3df4a8, _0x3cab6f = []; for (let _0x2d7ef4 = 0x0; _0x2d7ef4 < _0x5d4699['length']; _0x2d7ef4++) { _0x4f2be7 = _0x5d4699[_0x2d7ef4]; let _0x2f7784 = Object[_0x552905(0x1b5, '#PYK')](_0x4f2be7)[_0x552905(0x1ce, 'C6i4')](_0x552905(0x286, '9$I1')) ? _0x4f2be7[_0x552905(0x240, 'QY3!')] : _0x2d7ef4; _0x22d9ab = _0x488b5c?.[_0x552905(0x1c4, 'qZ(R')] >= _0x488b5c && _0x488b5c[_0x2f7784] !== null ? _0x488b5c[_0x2f7784] : undefined, _0x3df4a8 = {}; if (_0x488b5c === undefined) _0x3df4a8[_0x2d7ef4] = { 'index': _0x2d7ef4, 'Actual': '<<No\x20Selection>>', 'Expected': _0x4f2be7 }, _0x43f424 = ![]; else { if (typeof _0x4f2be7 === _0x552905(0x2a1, 'lL#k')) { _0x43f424 = ![], _0x488b5c[_0x552905(0x226, 'bb7J')](_0x58e01c => { if (stringMatch[_0x233a4d](_0x58e01c, _0x4f2be7)) { if (!_0x43f424) _0x43f424 = !![]; } }); if (!_0x43f424) _0x3df4a8[_0x2d7ef4] = { 'Actual': _0x552905(0x27e, '$7J$'), 'Expected': _0x4f2be7, 'MatchType': _0x233a4d }; } } if (Object[_0x552905(0x27b, '9$I1')](_0x3df4a8)[_0x552905(0x219, 'zpGo')] > 0x0) _0x3cab6f[_0x552905(0x1b0, 'osl4')](_0x3df4a8); } if (!_0x43f424) { verbose && (console['log'](_0x552905(0x294, 'mbmK'), JSON[_0x552905(0x217, 'dx2S')](_0x5d4699)), console[_0x552905(0x278, 'IVPa')](_0x552905(0x1b9, 'U@^u'), JSON[_0x552905(0x27c, 'eqS&')](_0x22d9ab))); console[_0x552905(0x1c0, 'a0b*')](_0x552905(0x20e, 'traB'), JSON['stringify'](_0x3cab6f, null, 0x2)); throw new Error(_0x552905(0x1c8, 'bb7J') + JSON[_0x552905(0x25c, 'osl4')](_0x3cab6f, null, 0x2)); } return _0x43f424; } const stringMatch = {}; stringMatch[_0xa778e7(0x25e, 'QY3!')] = function (_0x2d8c6e, _0x29881d) { return _0x2d8c6e === _0x29881d; }, stringMatch[_0xa778e7(0x22e, '9$I1')] = function (_0x5ed95b, _0x17c753) { const _0x37fdcb = _0xa778e7; return _0x5ed95b[_0x37fdcb(0x295, 'IVPa')](_0x17c753); }, stringMatch[_0xa778e7(0x2c5, 'y[MH')] = function (_0x3febf8, _0x4e9307) { const _0x58152d = _0xa778e7; return _0x3febf8[_0x58152d(0x224, 'dx2S')](_0x4e9307); }, stringMatch[_0xa778e7(0x1fa, 'W2Wj')] = function (_0xac5e3, _0x2603d5) { const _0x4ceaff = _0xa778e7; return _0xac5e3[_0x4ceaff(0x1f7, 'ojxt')](_0x2603d5); }, stringMatch[_0xa778e7(0x200, 'y[MH')] = function (_0x4d5c35, _0x1a12d5) { const _0x2ad18a = _0xa778e7; return _0x4d5c35[_0x2ad18a(0x2bf, 'dkl!')](_0x1a12d5); }, stringMatch['notexact'] = function (_0xe7cd11, _0x28f24d) { return _0xe7cd11 !== _0x28f24d; }, stringMatch['notstartswith'] = function (_0x5550f0, _0x55db5b) { return !_0x5550f0['startsWith'](_0x55db5b); }, stringMatch[_0xa778e7(0x261, 'l$Uj')] = function (_0x7081e, _0x9b997) { return !_0x7081e['endsWith'](_0x9b997); }, stringMatch[_0xa778e7(0x251, '$7J$')] = function (_0x29846d, _0x535750) { return !_0x29846d['includes'](_0x535750); }, stringMatch[_0xa778e7(0x21e, 'zpGo')] = function (_0x51ec3b, _0xd1fbf8) { return !_0x51ec3b['includes'](_0xd1fbf8); }; const copyToClipboard = _0x831b1e => { const _0x793f00 = _0xa778e7, _0x48577f = document[_0x793f00(0x1e2, 'qWQQ')](_0x793f00(0x22b, 'C6i4')); _0x48577f[_0x793f00(0x2b0, 'bb7J')] = _0x831b1e, _0x48577f[_0x793f00(0x19a, 't6Xw')](_0x793f00(0x250, '9$I1'), ''), _0x48577f[_0x793f00(0x2a4, 'y[MH')][_0x793f00(0x1bd, 'Vc(D')] = 'absolute', _0x48577f[_0x793f00(0x1e1, 'fKSR')][_0x793f00(0x1b7, 'FL6b')] = '-9999px', document[_0x793f00(0x2a3, 'qWQQ')][_0x793f00(0x2aa, 'QY3!')](_0x48577f); const _0x155df0 = document[_0x793f00(0x241, 'y[MH')]()[_0x793f00(0x277, '7SpF')] > 0x0 ? document[_0x793f00(0x201, 'sQUX')]()[_0x793f00(0x1fb, 'qZ(R')](0x0) : ![]; _0x48577f[_0x793f00(0x1a9, 'Sw33')](), document[_0x793f00(0x1d7, 'a0b*')]('copy'), document[_0x793f00(0x253, '7SpF')][_0x793f00(0x2bd, 'Cp15')](_0x48577f), _0x155df0 && (document[_0x793f00(0x2a8, '7SpF')]()['removeAllRanges'](), document[_0x793f00(0x2ac, 'IxmW')]()[_0x793f00(0x297, 't6Xw')](_0x155df0)); };

/* If user pointed at a list item or for the target element then be nice
 *	try to find the parent element <select> or <ul>
 */
var results = selectListFind(element);
var select_list_tagname = results?.select_list_tagname.toLowerCase();
var select_list = results?.select_list;
var select_list_opener = results?.select_list_opener;
var select_listitem_groupbox = results?.select_listitem_groupbox;

let select_tags = ["select", "ol", "ul", "custom"];
if (!select_tags.includes(select_list_tagname)) {
    throw new Error("Select Option(s) ==> Target element must be a select, ol, ul, option, li, or custom");
}

if (select_listitem_groupbox !== undefined && current_listitem_groupbox_selector?.display == 'hidden') {

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes') {
                console.log('target.style.visibility = ' + mutation.target.style.visibility);
                //if (mutation.target.style.visibility !== "hidden") {
                //resolve();
                //}
            }
        });
    });
    let observerConfig = {
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

/*** END COMMON TABLE FUNCTIONALITY ***/

/*** Function Specific Logic Below ***/

// Validate list items
//
function validateItems(actualValues, expectedValues, matchType) {

    let result = true;
    let expected_value;
    let actual_value;
    let row_differences;
    let differences = [];

    for (let evid = 0; evid < expectedValues.length; evid++) {

        expected_value = expectedValues[evid];

        let row_id = Object.keys(expected_value).includes("index") ? expected_value["index"] : evid;
        actual_value = (actualValues?.length >= actualValues && actualValues[row_id] !== null) ? actualValues[row_id] : undefined;

        row_differences = {};

        if (actualValues === undefined) {

            row_differences[evid] = { "index": evid, "Actual": "<<No Selection>>", "Expected": expected_value };
            result = false;

        }
        else if (typeof expected_value === 'string') {

            result = false;
            actualValues.forEach((actual_value) => {
                if (stringMatch[matchType](actual_value, expected_value)) {
                    if (!result)
                        result = true;
                }
            });
            if (!result)
                row_differences[evid] = { "Actual": "<<No match>>", "Expected": expected_value, "MatchType": matchType };

        }

        if (Object.keys(row_differences).length > 0)
            differences.push(row_differences);

    }

    // If failed, echo to console and report an error
    //
    if (differences?.length > 0) {
        if (verbose) {
            console.log("expected_value", JSON.stringify(expectedValues));
            console.log("actual_value", JSON.stringify(actual_value));
        }
        console.log("Validate Select/List Options/Items: ", JSON.stringify(differences, null, 2));
        throw new Error("Validate Select/List Options/Items\n" + JSON.stringify(differences, null, 2));
    }

    return result;
}

let actualValues = selectListItemsGet(select_list, return_type);

let filteredValues = selectListItemsFilter(actualValues);

copyToClipboard(JSON.stringify(filteredValues, null, 1));

exportsTest[return_variable_name] = filteredValues;

if (verbose) {
    console.log("===>", return_variable_name, JSON.stringify(exportsTest[return_variable_name]));
}

/* If itemId is set then assume we are to select it (for now)
*/
if (typeof itemId !== 'undefined' && itemId !== null) {

    /* Normalize items to select
     */
    let items_to_select = [];
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

}

/* If orderDirection is set then assume we are to validate list order (for now)
*/
if (typeof orderDirection !== 'undefined' && orderDirection !== null) {
    if (filteredValues != null)
        validateSelectOptionOrder(filteredValues, orderDirection);
}

if (typeof expectedValues !== 'undefined' && expectedValues !== null) {
    validateItems(filteredValues, expectedValues, match_type);
}

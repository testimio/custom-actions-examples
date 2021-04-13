/*
 *  Validate Computed Style
 *  
 *      Validates any/all style(s) of an element by getting the computed styles and validating them against expected styles 
 * 
 *  Parameters
 * 
 *  		element        (HTML) : Target Element
 *  		expectedStyles (JS)   : expected styles formatted as JSON 
 *  	 		Example:  {"alignContent": "left", "alignItems": "center", "backgroundColor": "rgb(56, 234, 100)", "backgroundImage": "none", "border": "0px none rgb(49, 49, 49)" }
 *   
 *  Notes
 * 
 *  	Actual values are copied to the clipboard and can be used as extected values either in whole or in part
 *      To start, run this without an expectedStyles set to capture the current values that can then be set as expectedStyles 
 *      The configuration variable 'supportedStyles' (below) can be modified to filter captured styles to just those of interest to you as there are a ton by default
 * 
 *  Use
 *      Set the element to the target element to be validated
 *      Run the step with an empty expectedStyles value\
 *      After a successful run, all current styles will be in the clipboard and can be pasted into the expectedStyles parameter
 *      Optionally, you can edit expectedStyles to just those that you want to validate
 * 
 *  Base Step
 *      Custom Validation
 * 
 *  Installation
 *      Create a new "Custom Validation"
 *      Name it "Validate Element Computed Style(s)"
 *      Create 2 parameters
 *          HTML - element
 *          JS   - expectedStyles
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      And Bob's your uncle * 
 */

// Used for debugging.  Enable/disable writing interim data to the console
var verbose = false;

const supportedStyles = {
    computedStyles: {
        "alignContent": "", "alignItems": "", "alignSelf": "", "alignmentBaseline": "", "animation": ""
        , "animationDelay": "", "animationDirection": "", "animationDuration": "", "animationFillMode": "", "animationIterationCount": "", "animationName": ""
        , "animationPlayState": "", "animationTimingFunction": "", "appearance": "", "backdropFilter": "", "backfaceVisibility": "", "background": ""
        , "backgroundAttachment": "", "backgroundBlendMode": "", "backgroundClip": "", "backgroundColor": "", "backgroundImage": "", "backgroundOrigin": ""
        , "backgroundPosition": "", "backgroundPositionX": "", "backgroundPositionY": "", "backgroundRepeat": "", "backgroundSize": "", "baselineShift": ""
        , "blockSize": "", "border": "", "borderBlockEnd": "", "borderBlockEndColor": "", "borderBlockEndStyle": "", "borderBlockEndWidth": "", "borderBlockStart": ""
        , "borderBlockStartColor": "", "borderBlockStartStyle": "", "borderBlockStartWidth": "", "borderBottom": "", "borderBottomColor": "", "borderBottomLeftRadius": ""
        , "borderBottomRightRadius": "", "borderBottomStyle": "", "borderBottomWidth": "", "borderCollapse": "", "borderColor": "", "borderImage": ""
        , "borderImageOutset": "", "borderImageRepeat": "", "borderImageSlice": "", "borderImageSource": "", "borderImageWidth": "", "borderInlineEnd": ""
        , "borderInlineEndColor": "", "borderInlineEndStyle": "", "borderInlineEndWidth": "", "borderInlineStart": "", "borderInlineStartColor": "", "borderInlineStartStyle": ""
        , "borderInlineStartWidth": "", "borderLeft": "", "borderLeftColor": "", "borderLeftStyle": "", "borderLeftWidth": "", "borderRadius": "", "borderRight": ""
        , "borderRightColor": "", "borderRightStyle": "", "borderRightWidth": "", "borderSpacing": "", "borderStyle": "", "borderTop": "", "borderTopColor": ""
        , "borderTopLeftRadius": "", "borderTopRightRadius": "", "borderTopStyle": "", "borderTopWidth": "", "borderWidth": "", "bottom": "", "boxShadow": ""
        , "boxSizing": "", "breakAfter": "", "breakBefore": "", "breakInside": "", "bufferedRendering": "", "captionSide": "", "caretColor": "", "clear": ""
        , "clip": "", "clipPath": "", "clipRule": "", "color": "", "colorInterpolation": "", "colorInterpolationFilters": "", "colorRendering": "", "colorScheme": ""
        , "columnCount": "", "columnFill": "", "columnGap": "", "columnRule": "", "columnRuleColor": "", "columnRuleStyle": "", "columnRuleWidth": "", "columnSpan": ""
        , "columnWidth": "", "columns": "", "contain": "", "containIntrinsicSize": "", "content": "", "contentVisibility": "", "counterIncrement": "", "counterReset": ""
        , "counterSet": "", "cursor": "", "cx": "", "cy": "", "d": "", "direction": "", "display": "", "dominantBaseline": "", "emptyCells": "", "fill": "", "fillOpacity": ""
        , "fillRule": "", "filter": "", "flex": "", "flexBasis": "", "flexDirection": "", "flexFlow": "", "flexGrow": "", "flexShrink": "", "flexWrap": "", "float": "", "floodColor": ""
        , "floodOpacity": "", "font": "", "fontFamily": "", "fontFeatureSettings": "", "fontKerning": "", "fontOpticalSizing": "", "fontSize": "", "fontStretch": "", "fontStyle": ""
        , "fontVariant": "", "fontVariantCaps": "", "fontVariantEastAsian": "", "fontVariantLigatures": "", "fontVariantNumeric": "", "fontVariationSettings": "", "fontWeight": ""
        , "gap": "", "grid": "", "gridArea": "", "gridAutoColumns": "", "gridAutoFlow": "", "gridAutoRows": "", "gridColumn": "", "gridColumnEnd": "", "gridColumnGap": ""
        , "gridColumnStart": "", "gridGap": "", "gridRow": "", "gridRowEnd": "", "gridRowGap": "", "gridRowStart": "", "gridTemplate": "", "gridTemplateAreas": ""
        , "gridTemplateColumns": "", "gridTemplateRows": "", "height": "", "hyphens": ""
        , "imageOrientation": "", "imageRendering": "", "inlineSize": "", "isolation": "", "justifyContent": "", "justifyItems": "", "justifySelf": "", "left": ""
        , "letterSpacing": "", "lightingColor": "", "lineBreak": "", "lineHeight": "", "listStyle": "", "listStyleImage": "", "listStylePosition": "", "listStyleType": ""
        , "margin": "", "marginBlockEnd": "", "marginBlockStart": "", "marginBottom": "", "marginInlineEnd": "", "marginInlineStart": "", "marginLeft": "", "marginRight": ""
        , "marginTop": "", "marker": "", "markerEnd": "", "markerMid": "", "markerStart": "", "mask": "", "maskType": "", "maxBlockSize": "", "maxHeight": "", "maxInlineSize": ""
        , "maxWidth": "", "minBlockSize": "", "minHeight": "", "minInlineSize": "", "minWidth": "", "mixBlendMode": "", "objectFit": "", "objectPosition": "", "offset": ""
        , "offsetDistance": "", "offsetPath": "", "offsetRotate": "", "opacity": "", "order": "", "orphans": "", "outline": "", "outlineColor": "", "outlineOffset": "", "outlineStyle": ""
        , "outlineWidth": "", "overflow": "", "overflowAnchor": "", "overflowWrap": "", "overflowX": "", "overflowY": "", "overscrollBehavior": "", "overscrollBehaviorBlock": ""
        , "overscrollBehaviorInline": "", "overscrollBehaviorX": "", "overscrollBehaviorY": "", "padding": "", "paddingBlockEnd": "", "paddingBlockStart": "", "paddingBottom": ""
        , "paddingInlineEnd": "", "paddingInlineStart": "", "paddingLeft": "", "paddingRight": "", "paddingTop": "", "page": "", "pageBreakAfter": "", "pageBreakBefore": ""
        , "pageBreakInside": "", "paintOrder": "", "perspective": "", "perspectiveOrigin": "", "placeContent": "", "placeItems": "", "placeSelf": "", "pointerEvents": ""
        , "position": "", "r": "", "resize": "", "right": "", "rowGap": "", "rubyPosition": "", "rx": "", "ry": "", "scrollBehavior": "", "scrollMargin": "", "scrollMarginBlock": ""
        , "scrollMarginBlockEnd": "", "scrollMarginBlockStart": "", "scrollMarginBottom": "", "scrollMarginInline": "", "scrollMarginInlineEnd": "", "scrollMarginInlineStart": ""
        , "scrollMarginLeft": "", "scrollMarginRight": "", "scrollMarginTop": "", "scrollPadding": "", "scrollPaddingBlock": "", "scrollPaddingBlockEnd": "", "scrollPaddingBlockStart": ""
        , "scrollPaddingBottom": "", "scrollPaddingInline": "", "scrollPaddingInlineEnd": "", "scrollPaddingInlineStart": "", "scrollPaddingLeft": "", "scrollPaddingRight": "", "scrollPaddingTop": ""
        , "scrollSnapAlign": "", "scrollSnapStop": "", "scrollSnapType": "", "shapeImageThreshold": "", "shapeMargin": "", "shapeOutside": "", "shapeRendering": "", "speak": ""
        , "stopColor": "", "stopOpacity": "", "stroke": "", "strokeDasharray": "", "strokeDashoffset": "", "strokeLinecap": "", "strokeLinejoin": "", "strokeMiterlimit": ""
        , "strokeOpacity": "", "strokeWidth": "", "tabSize": "", "tableLayout": ""
        , "textAlign": "", "textAlignLast": "", "textAnchor": "", "textCombineUpright": "", "textDecoration": "", "textDecorationColor": "", "textDecorationLine": ""
        , "textDecorationSkipInk": "", "textDecorationStyle": "", "textIndent": "", "textOrientation": "", "textOverflow": "", "textRendering": "", "textShadow": ""
        , "textSizeAdjust": "", "textTransform": "", "textUnderlinePosition": "", "top": "", "touchAction": "", "transform": "", "transformBox": "", "transformOrigin": ""
        , "transformStyle": "", "transition": "", "transitionDelay": "", "transitionDuration": "", "transitionProperty": "", "transitionTimingFunction": "", "unicodeBidi": ""
        , "userSelect": "", "vectorEffect": "", "verticalAlign": "", "visibility": "", "whiteSpace": "", "widows": "", "width": "", "willChange": "", "wordBreak": "", "wordSpacing": ""
        , "wordWrap": "", "writingMode": "", "x": "", "y": "", "zIndex": "", "zoom": "", "cssFloat": "",
    }
};

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

// If Expected Values is not JSON, attempt to convert to JSON
//
if (typeof expectedStyles === 'string') {
    if (expectedStyles.startsWith("{") === false) {
        expectedStyles = "{" + expectedStyles.replace("=", ":") + "}";
    }
    expectedStyles = JSON.parse(expectedStyles);
}

// Get Expected Values.  Use default (all known if undefined)
//
var expected_styles;
if (typeof expectedStyles !== 'undefined' && expectedStyles !== null)
    expected_styles = expectedStyles;

if (verbose)
    console.log("EXPECTED STYLES", JSON.stringify(expected_styles, null, 2));

// Get Actual Computed Styles
//
var actual_styles = {};
var elementStyles = window.getComputedStyle(element, null)
for (var key in elementStyles) {
    if (isNaN(key) && key != "cssText") {
        if (key.length > 0 && elementStyles[key] !== null && elementStyles[key].length > 0) {
            actual_styles[key] = elementStyles[key];
        }
    }
}

// Save actual styles to the clipboard.  These can be used to set expected values
//
copyToClipboard(JSON.stringify(actual_styles, null, 1));
if (verbose)
    console.log("ACTUAL STYLES", JSON.stringify(actual_styles, null, 2));

// Validate
//
var result = true;
var differences = { "Type": element.tagName, "Text": element.innerText };
if (typeof expected_styles !== 'undefined') {
    for (var key in expected_styles) {
        if (verbose)
            console.log("Validate " + key + "Expected: [" + expected_styles[key] + "], Actual:[" + actual_styles[key] + "]");

        if (supportedStyles.computedStyles.hasOwnProperty(key) && actual_styles.hasOwnProperty(key)) {

            if (actual_styles[key] != expected_styles[key]) {
                differences[key] = { "Actual": actual_styles[key], "Expected": expected_styles[key] };
                if (result)
                    result = false;
                if (verbose)
                    console.log("    MISMATCH:: " + key + " => \nExpected: [" + expected_styles[key] + "], \nActual: [" + actual_styles[key] + "]");
            }
        }
    }
}

// If failed, echo to console and report an error
//
if (!result) {
    if (verbose) {
        console.log("expected_styles", JSON.stringify(expected_styles));
        console.log("actual_styles", JSON.stringify(actual_styles));
    }
    console.log("Validate Computed Style(s): ", JSON.stringify(differences, null, 2));
    throw new Error("Validate Computed Style(s)\n" + JSON.stringify(differences, null, 2));
}

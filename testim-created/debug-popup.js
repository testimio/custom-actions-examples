/**
  Debug Popup

  Parameters:

  	message (JS) : Test/JSON/HTML to display

	timeout (JS) [optional] : Time to display popup
    
**/

var script_jquery  = document.createElement('script');
script_jquery.type = 'text/javascript';
script_jquery.src  = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script_jquery);

var style       = document.createElement('style');
style.type      = 'text/css';
style.innerHTML = '/* Popup box BEGIN */ .hover_bkgr_fricc{ background:rgba(0,0,0,.4); cursor:pointer; display:none; height:100%; position:fixed; text-align:center; top:-5px; width:100%; z-index:10000;}.hover_bkgr_fricc .helper{ display:inline-block; height:100%; vertical-align:middle;}.hover_bkgr_fricc > div {    background-color: #fff;    box-shadow: 10px 10px 60px #555; display: inline-block; height: auto; max-width: 551px; min-height: 100px; vertical-align: middle; width: 60%; position: relative; border-radius: 8px; padding: 15px 5%;} .popupCloseButton {    background-color: #fff;    border: 3px solid #999;    border-radius: 50px;    cursor: pointer;    display: inline-block;    font-family: arial;    font-weight: bold;    position: absolute;    top: -20px;    right: -20px;    font-size: 25px;    line-height: 30px;    width: 30px;    height: 30px;    text-align: center;} .popupCloseButton:hover {    background-color: #ccc;} .trigger_popup_fricc {    cursor: pointer;    font-size: 20px;    margin: 20px;    display: inline-block;    font-weight: bold;}/* Popup box BEGIN */';
document.getElementsByTagName('head')[0].appendChild(style);

var popup_html = '<span class="helper"></span><div style="width: 800px;">'
                + '<div class="popupCloseButton" onclick="$(\'.hover_bkgr_fricc\').hide();">&times;</div>'
                + '<div style="width: 100%; height: 100%; border:0px solid black; padding: 2px; text-align: left;">'
                + '<table>'
                +   '<tr>'
                +     '<td>'
                +       message
                +     '</td>'
                +   '</tr>'
                + '</table>'
                + '</div>';
              + '</div></div>';

var div = document.getElementById("debugDialog");
if (div === null) {
    div = document.createElement('div');
    div.id = "debugDialog";
    div.className = "hover_bkgr_fricc";
    document.body.appendChild(div);
}
div.innerHTML = popup_html;

var script = document.createElement("script");
script.type="text/javascript";
script.innerHTML='setTimeout(function() { $(".hover_bkgr_fricc").show(); }, 500);';
document.body.appendChild(script);

if (typeof timeout !== 'undefined' && timeout > 0) {
    
    // var script = document.createElement("script");
    // script.type = "text/javascript";
    // script.innerHTML = 'setTimeout(function() { $(".hover_bkgr_fricc").hide(); }, ' + timeout + ');';
    // document.body.appendChild(script);

    return new Promise((resolve,reject) => {
       setTimeout(function() { $(".hover_bkgr_fricc").hide(); resolve(); }, timeout );
    });

}

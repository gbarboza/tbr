var mongoose = require('mongoose');
var User = require('./models').User;
var token = require('./token');

exports.bookmarklet = function(req, res) {
    var bookmarkletURL;
    bookmarkletURL = 'javascript:' + wrapToExec(doit1979.toString()).
        replace('SERVER', 'WEBSITE');

        res.send(bookmarkletURL);
};

/* Code that starts loading UI when user clicks the bookmarklet */
exports.bmui = function(req, res) {
    var tok = token.createToken(req.user.id);
    console.log('Sending UI');
    res.contentType('text/javascript');
    res.send(wrapToExec(ui.toString().
                replace('TOKEN', tok).
                replace('UID', req.user.id).
                replace(new RegExp('SERVER', 'g'), 'http://' + 'WEBSITE')));
};

/* Javascript code that bookmarklet runs */
function doit1979() {
    var d = document;
    var u = d.location.href;
    var svr = 'SERVER';
    try {
        if (!d.body) {
            throw (0);
        } else {
            var j = d.createElement('script');
            j.type = 'text/javascript';
            j.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';
            j.id = '237jq';

            var k = d.createElement('script');
            k.type = 'text/javascript';
            k.src = document.location.protocol + '//' + svr + '/js/jquery.foundation.reveal.js';
            k.id = '237rv';

            var n = d.createElement('script');
            n.type = 'text/javascript';
            n.src = document.location.protocol + '//' + svr + '/bmui';
            n.id = '237js';

            d.body.appendChild(j);
            d.body.appendChild(k);
            d.body.appendChild(n);
        }
    } catch (e) {
        alert('Yo dawg, slow down. The page is not loaded yet');
    }
}

function wrapToExec(s) {
    return '(' + s + ')();';
}

/* Sneak the bookmarklet UI into the DOM of the page the user is on */
function ui() {
    var t = 'TOKEN';
    var id = 'UID';
    var d = document;
    var u = d.location.href;
    var sty = '<style id="237style">';
    sty += ' .reveal-modal-bg { position: fixed; height: 100%; width: 100%; background: #000; background: rgba(0, 0, 0, 0.45); z-index: 10000; display: none; top: 0; left: 0; }';
    sty += ' .reveal-modal { background: white; visibility: hidden; display: none; top: 100px; left: 50%; margin-left: -260px; width: 520px; position: absolute; z-index: 10001; padding: 30px; -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.4); -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.4); box-shadow: 0 0 10px rgba(0, 0, 0, 0.4); }';
    sty += ' .reveal-modal .close-reveal-modal { font-size: 22px; font-size: 2.2rem; line-height: .5; position: absolute; top: 8px; right: 11px; color: #aaa; text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.6); font-weight: bold; cursor: pointer; }';
    sty += ' .reveal-modal.small { width: 30%; margin-left: -15%; }';
    sty += ' .reveal-modal.medium { width: 40%; margin-left: -20%; }';
    sty += ' .reveal-modal.large { width: 60%; margin-left: -30%; }';
    sty += ' .reveal-modal.xlarge { width: 70%; margin-left: -35%; }';
    sty += ' .reveal-modal.expand { width: 90%; margin-left: -45%; }';
    sty += ' .reveal-modal .row { min-width: 0; margin-bottom: 10px; }';
    sty += ' .reveal-modal > :first-child { margin-top: 0; }';
    sty += ' .reveal-modal > :last-child { margin-bottom: 0; }';
    sty += ' button{background:#eee;background:#eee -moz-linear-gradient(top,rgba(255,255,255,.2) 0,rgba(0,0,0,.2) 100%);background:#eee -webkit-gradient(linear,left top,left bottom,color-stop(0%,rgba(255,255,255,.2)),color-stop(100%,rgba(0,0,0,.2)));background:#eee -webkit-linear-gradient(top,rgba(255,255,255,.2) 0,rgba(0,0,0,.2) 100%);background:#eee -o-linear-gradient(top,rgba(255,255,255,.2) 0,rgba(0,0,0,.2) 100%);background:#eee -ms-linear-gradient(top,rgba(255,255,255,.2) 0,rgba(0,0,0,.2) 100%);background:#eee linear-gradient(top,rgba(255,255,255,.2) 0,rgba(0,0,0,.2) 100%);border:1px solid #aaa;border-top:1px solid #ccc;border-left:1px solid #ccc;-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3px;color:#444;display:inline-block;font-size:11px;font-weight:bold;text-decoration:none;text-shadow:0 1px rgba(255,255,255,.75);cursor:pointer;margin-bottom:20px;line-height:normal;padding:8px 10px;font-family:"HelveticaNeue","Helvetica Neue",Helvetica,Arial,sans-serif;width:100%;padding-left:0!important;padding-right:0!important;text-align:center}';
    sty += ' input[type="text"]{border:1px solid #ccc;padding:6px 4px;outline:0;-moz-border-radius:2px;-webkit-border-radius:2px;border-radius:2px;font:13px "HelveticaNeue","Helvetica Neue",Helvetica,Arial,sans-serif;color:#777;margin:0 auto;width:210px;max-width:100%;display:block;margin-bottom:20px;background:#fff}';
    sty += ' </style>';

    $(d).ready(function() {
        console.log("GO");
        $('body').append(sty);
        var folders = [];
        $.ajax({
            type: 'POST',
            url: 'SERVER' + '/folders',
            data: {
                id: id,
                token: t
            },
            statusCode: {
                200: loadMenu,
                503: function() {
                    /* Ugly but quick */
                    alert("Error: Couldn't access users resources.");
                }
            }
        });
    });

    function loadMenu(f) {
        var mdiv = $('<div/>');
        var cdiv = $('<div/>');
        var nfi = $('<input/>');
        var nfb = $('<button/>');
        var a = null;

        mdiv.addClass('reveal-modal');
        mdiv.addClass('large');
        mdiv.attr('id', '237overlay');

        nfb.attr('type', 'submit');
        nfb.attr('id', '237nfb');
        nfb.text('Create New Folder');
        nfi.attr('type', 'text');
        nfi.attr('id', '237nfi');
        nfi.val('Enter New Folder Name');

        nfi.focus(function() {
            $(this).val('');
        });

        nfb.click(function(e) {
            $.ajax({
                type: 'POST',
                url: 'SERVER' + '/save',
                data: {
                    id: id,
                    token: t,
                    folder: $('#237nfi').val(),
                    desc: (d.title ? d.title : 'Unknown'),
                    url: u
                },
                success: function() {
                    $('#237overlay').trigger('reveal:close');
                    cleanUp();
                }
            });
        });


        $('body').append(mdiv);
        mdiv.append(cdiv);
        cdiv.append(nfi);
        cdiv.append(nfb);

        for (i = 0; i < f.length; i++) {
            a = $('<button/>');

            a.text(f[i]);
            a.attr('title', f[i]);
            a.attr('href', '#');

            (function() {
                var fn = f[i];
                a.click(function(e) {
                    $.ajax({
                        type: 'POST',
                        url: 'SERVER' + '/save',
                        data: {
                            id: id,
                            token: t,
                            folder: fn,
                            desc: (d.title ? d.title : 'Unknown'),
                            url: u
                        },

                        success: function() {
                            $('#237overlay').trigger('reveal:close');
                            cleanUp();
                        }
                    });
                });
            })();

            cdiv.append(a);
        }

        $('#237overlay').reveal({
            closed: cleanUp
        });
    }

    function cleanUp() {
        $('#237overlay').remove();
        $('#237rv').remove();
        $('#237js').remove();
        $('#237jq').remove();
    }
}

$(document).ready(function() {
    var regFocus = false;

    $('#username').focus();

    $('#reg_form *').focus(function() {
        regFocus = true;
    });

    $('#reg_form *').blur(function() {
        regFocus = false;
    });

    $('html').keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            if (regFocus === true) {
                $('#register').click();
            } else {
                $('#login').click();
            }
        }
    });

    $('#login').click(function(e) {
        e.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: 'http://' + window.location.host + '/login',
            data: { username: username,
                password: password },
            statusCode: {
                200: function() {
                    window.location = '/account';
                },
            401: function() {
                noty({text: 'Invalid login'});
            }
            }
        });
    });

    $('#register').click(function(e) {
        e.preventDefault();

        var username = $('#reg_email').val();
        var password = $('#reg_password').val();

        if ($('#reg_password').val() === $('#reg_password_conf').val()) {
            $.ajax({
                type: 'POST',
                url: 'http://' + window.location.host + '/register',
                data: { username: username,
                    password: password },
                statusCode: {
                    200: function() {
                        window.location = '/account';
                    },
                503: function() {
                    noty({text: 'Username already taken'});
                }
                }
            });
        } else {
            noty({text: "Passwords don't match"});
        }
    });
});

$(document).ready(function() {
    var curLink = null;
    populateFolderList();
    populateLinksFrom('Main');

    $.get('http://' + window.location.host + '/bookmarklet', function(data) {
        $('#bookmarklet').attr('href', data);
    });

    $('#selectFolder').change(function(e) {
        $('#links').empty();
        populateLinksFrom($('#selectFolder').val());
    });

    $('#logout').click(function(e) {
        $.get('/logout', function(data) {
            window.location.href = '/';
        });
    });

    $('#df').click(function(e) {
        if ($('#selectFolder').val() == 'Main') {
            showError("Can't delete main folder");
        } else {
            $.ajax({
                type: 'POST',
                url: 'http://' + window.location.host + '/removeFolder',
                data: { folder: $('#selectFolder').val() },
                statusCode: {
                    503: function() { showError("Couldn't remove folder"); },
                    200: function() {
                        populateFolderList();
                        populateLinksFrom('Main');
                    }
                },
                error: function(xhr, ts, et) {
                    showError("Couldn't connect to server");
                }
            });
        }
    });

    $('#new_folder_modal').keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $('#mnf').click();
        }
    });

    $('#mnf').click(function(e) {
        var folderName = $('#nfn').val();

        if (!folderName || folderName === '') {
            showError('Folder name must not be empty');
        }

        $.ajax({
            type: 'GET',
            url: 'http://' + window.location.host + '/folders',
            success: function(data) {
                if (data.indexOf(folderName) > -1) {
                    showError('Folder with that name already exists');
                } else {
                    addFolder(folderName);
                    $('#nfn').val('');
                }
            },
            error: function(xhr, ts, et) {
                showError("Couldn't connect to server");
            }
        });
    });

});

function handleSuccess(d, ts, xhr) {
    window.location.href = '/account';
}

function populateFolderList() {
    var l1 = $('#selectFolder');
    var l2 = $('#cfl');
    var i;

    $('#selectFolder').empty();
    $('#cfl').empty();

    $.ajax({
        type: 'GET',
        url: 'http://' + window.location.host + '/folders',
        success: function(data) {
            for (i = 0; i < data.length; i++) {
                var nb = $('<button type="submit"/>');
                nb.addClass('nfp');
                nb.addClass('full-width');
                nb.attr('id', data[i]);
                nb.text(data[i]);
                nb.click(changeLinkFolder);

                l1.append('<option value="REPLACE">REPLACE</option>'.
                    replace(new RegExp('REPLACE', 'g'), data[i]));
                l2.append(nb);
            }
        },
        error: function(xhr, ts, et) {
                showError("Couldn't connect to server");
        }
    });
}

function populateLinksFrom(folder) {
    var i;

    $('#links').empty();

    $.ajax({
        type: 'POST',
        url: 'http://' + window.location.host + '/linksInFolder',
        data: { folder: folder },
        success: function(data) {
            for (i = 0; i < data.length; i++) {
                addLink(data[i], i);
            }

            $('body').editables({
                beforeFreeze: function(d, e) {
                    var o = $(d[0]).text();
                    var n = e.currentTarget.value;

                    if (o !== n) {
                        $(d[0]).text(e.currentTarget.value);

                        console.log('p');
                        $.ajax({
                            type: 'POST',
                            url: 'http://' + window.location.host + '/changeDesc',
                            data: { linkId: $(d[0]).closest('.link').attr('id'),
                                    desc: n
                                  }
                        });
                    }
                }
            });
        },
        error: function(xhr, ts, et) {
                showError("Couldn't connect to server");
        }
    });
}

function addLink(link, i) {
    var wrapperId = link._id;
    var ldiv = $('<div/>');
    var mdiv = $('<div/>');
    var cdiv = $('<div/>');
    var mspn = $('<span/>');
    var lbl = $('<label data-type="editable"/>');
    var inp = $('<input/>');
    var a = $('<a/>');
    var b1 = $('<a/>');
    var b2 = $('<a/>');

    ldiv.addClass('link');
    ldiv.attr('id', wrapperId);

    mdiv.addClass('lmain');
    cdiv.addClass('ctrls');

    lbl.addClass('ltxt');
    lbl.text(link.desc);
    lbl.data('for', '#' + wrapperId + ' .linp');

    inp.addClass('linp');
    inp.val(link.desc);

    a.addClass('lurl');
    a.attr('href', link.url);
    a.text(link.url);

    b1.addClass('cfb');
    b1.addClass('button');
    b1.addClass('remove-bottom');
    b1.click(cfbClick);
    b1.attr('href', '#');
    b1.text('Change Folder');

    b2.addClass('dlb');
    b2.addClass('button');
    b2.addClass('remove-bottom');
    b2.click(dlbClick);
    b2.attr('href', '#');
    b2.text('Delete');

    $('#links').append(ldiv);
    ldiv.append(mdiv);
    ldiv.append(cdiv);
    mdiv.append(mspn);
    mdiv.append(a);
    mspn.append(lbl);
    mspn.append(inp);
    cdiv.append(b1);
    cdiv.append(b2);
}

function showError(msg) {
    noty({text: msg });
}

function cfbClick(e) {
    /* :( */
    curLink = $(e.currentTarget).closest('.link').attr('id');
    $('#change_folder_modal').reveal();
}

function dlbClick(e) {
    $.ajax({
        type: 'POST',
        url: 'http://' + window.location.host + '/delete',
        data: { linkId: $(e.currentTarget).closest('.link').attr('id') },
        statusCode: {
            503: function() { showError("Couldn't delete link") },
            200: function() { populateLinksFrom($('#selectFolder').val()); }
        },
        error: function(xhr, ts, et) {
                showError("Couldn't connect to server");
        }
    });
}

function changeLinkFolder(e) {
    $.ajax({
        type: 'POST',
        url: 'http://' + window.location.host + '/changeFolder',
        data: { linkId: curLink,
                newFolder: $(e.currentTarget).closest('.nfp').text()
              },
        statusCode: {
            503: function() { showError("Couldn't change link folder") },
            200: function() {
                populateLinksFrom($('#selectFolder').val());
                $('#change_folder_modal').trigger('reveal:close');
            }
        },
        error: function(xhr, ts, et) {
                showError("Couldn't connect to server");
        }
    });
}

function addFolder(folderName) {
    $.ajax({
        type: 'POST',
        url: 'http://' + window.location.host + '/addFolder',
        data: { folder: folderName},
        statusCode: {
            503: function() { showError("Couldn't add folder"); },
            200: function() {
                populateFolderList();
                $('#new_folder_modal').trigger('reveal:close');
            }
        },
        error: function(xhr, ts, et) {
                showError("Couldn't connect to server");
        }
    });
}

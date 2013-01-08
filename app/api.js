var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var User = require('./models').User;

/* Create an user */
exports.addUser = function(req, res) {
    var newUser = {};

    User.count({ email: req.body.username }, function(err, count) {
        if (err) {
            console.log('Error registring', req.body.username);
            res.send(503);
        } else {
            /* Only allow reg if email isn't in db */
            if (count === 0) {
                console.log('Registering',
                    req.body.username, req.body.password);

                newUser.email = req.body.username;
                newUser.pass = bcrypt.hashSync(req.body.password, 8);
                newUser.links = [];
                newUser.folders = ['Main'];

                User.create(newUser, function(err, newUser) {
                    if (err) {
                        res.send(503);
                    } else {
                        req.login(newUser, function(err) {
                            if (err) {
                                res.send(503);
                            } else {
                                console.log('Registered', req.body.username);
                                res.send(200);
                            }
                        });
                    }
                });
            } else {
                console.log('Someone tried to register', req.body.username);
                res.send(503);
            }
        }
    });
};

/* Add a link to user with default folder of main */
exports.addLink = function(req, res) {
    console.log(req.body);
    var folder = req.query['f'] ? req.query['f'] : req.body.folder;
    var desc = req.query['d'] ? req.query['d'] : req.body.desc;
    var url = req.query['u'] ? req.query['u'] : req.body.url;

    console.log('Saving url', url, 'for user', req.user.id,
            'in folder', folder);

    /* TODO: Robustify */
    if (url.substring(0, 4) !== 'http') {
        url = 'http://' + url;
        console.log('Changed url to', url);
    }

    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.send(503);
        } else {

            /* Add folder if it doesn't exist */
            if (folder && user.folders.indexOf(folder) === -1) {
                console.log('Adding folder', folder);
                user.folders.push(folder);
            }

            user.links.push({
                url: url,
                folder: folder,
                desc: desc
            });

            user.save(function(err) {
                if (err) {
                    res.send(503);
                } else {
                    console.log('Link added', url, folder);
                    res.send(200);
                }
            });
        }
    });
};

exports.removeLink = function(req, res) {
    var i;

    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.send(503);
        } else {
            user.links.id(req.body.linkId).remove();

            user.save(function(err) {
                if (err) {
                    res.send(503);
                } else {
                    console.log('Remove link', req.body.linkId);
                    res.send(200);
                }
            });

        }
    });
};

exports.listLinks = function(req, res) {
    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.send(503);
        } else {
            console.log('Sent', user.links);
            res.send(user.links);
        }
    });
};

exports.listFolderLinks = function(req, res) {
    var folderName = req.body.folder;
    var matched = [];
    var i;

    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.send(503);
        } else {
            console.log('Getting links from', folderName);
            for (i = 0; i < user.links.length; i++) {
                if (user.links[i].folder === folderName) {
                    matched.push(user.links[i]);
                }
            }

            res.send(matched);
        }
    });
};

exports.changeLinkFolder = function(req, res) {
    var link;

    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.send(503);
        } else {
            link = user.links.id(req.body.linkId);

            if (user.folders.indexOf(req.body.newFolder) < 0) {
                res.send(503);
            } else {

                link.folder = req.body.newFolder;

                user.save(function(err) {
                    if (err) {
                        res.send(503);
                    } else {
                        console.log('Moved link to folder', link, req.body.newFolder);
                        res.send(200);
                    }
                });
            }
        }
    });
};

exports.changeLinkDesc = function(req, res) {
    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.send(503);
        } else {
            link = user.links.id(req.body.linkId);

            link.desc = req.body.desc;

            user.save(function(err) {
                if (err) {
                    res.send(503);
                } else {
                    console.log('New desc is', link.desc, req.body.linkId);
                    res.send(200);
                }
            });
        }
    });
};

exports.addFolder = function(req, res) {
    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.send(503);
        } else {

            user.folders.push(req.body.folder);
            user.save(function(err) {
                if (err) {
                    res.send(503);
                } else {
                    console.log('Added folder', req.body.folder);
                    res.send(200);
                }
            });
        }
    });
};

exports.removeFolder = function(req, res) {
    var i;
    var matched = [];

    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.send(503);
        } else {
            for (i = 0; i < user.links.length; i++) {
                console.log('Checking link', user.links[i].id);
                if (user.links[i].folder === req.body.folder) {
                    matched.push(user.links[i].id);
                }
            }

            for (i = 0; i < matched.length; i++) {
                console.log('Removing link', matched[i]);
                user.links.id(matched[i]).remove();
            }

            user.folders.splice(user.folders.indexOf(req.body.folder), 1);

            user.save(function(err) {
                if (err) {
                    res.send(503);
                } else {
                    console.log('Removed folder', req.body.folder);
                    res.send(200);
                }
            });
        }
    });
};

exports.listFolders = function(req, res) {
    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.send(503);
        } else {
            console.log('Sent list of folders', user.folders);
            res.send(user.folders);
        }
    });
};

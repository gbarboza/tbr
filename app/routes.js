/* Boring routes to send pages */
exports.index = function(req, res) {
    res.sendfile('public/index.html');
};

exports.account = function(req, res) {
    res.sendfile('public/account.html');
};

exports.addFolder = function(req, res) {
    res.sendfile('public/addfolder.html');
};

exports.addLink = function(req, res) {
    res.sendfile('public/addlink.html');
};

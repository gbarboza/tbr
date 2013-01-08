/* Libs */
var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt');
var ls = require('passport-local').Strategy;
var mongoose = require('mongoose');

/* App */
var routes = require('./app/routes');
var api = require('./app/api');
var bookmarklet = require('./app/bookmarklet');
var User = require('./app/models').User;
var token = require('./app/token');

var PORT = process.env.PORT || 5000;
var app = express();

mongoose.connect('');

/* Passport */
passport.use(new ls(function(email, password, done) {
    console.log(email);
    User.findOne({ email: email }, function(err, user) {
        if (err) {
            return done(err);
        } else if (!user) {
            console.log('Tried to login as nonexistent user', email);
            return done(null, false, { message: 'Invalid login' });
        } else if (bcrypt.compareSync(password, user.pass) === true) {
            console.log('Logged in as', user.email);
            return done(null, user);
        } else {
            console.log('Failed login for', user.email);
            return done(null, false, { message: 'Invalid login' });
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

/*
 * Check that a req either has a proper cookie,
 * a token, or passed creds via POST req.
 */
function reqAuth(req, res, next) {
    var bid = req.body.id;
    var tok = req.body.token;

    var puser = req.body.user;
    var ppass = req.body.pass;

    /* Auth via cookie */
    if (req.isAuthenticated()) {
        return next();

        /* Auth via token */
    } else if (tok && bid) {
        if (token.validateToken(bid, tok) === true) {
            /*
             * Needed since we make API requests in the bookmarklet
             * from any domain the user wants.
             */
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods',
                    'PUT,GET,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers',
                    'Content-Type,X-Requested-With');

            /*
             * If user has token psuedo log them in
             * so we can make db requests with their
             * user ID
             */
            req.user = { id: bid };
            return next();
        } else {
            res.send(401);
        }

        /* Auth via POSTed passed creds */
    } else if (puser && ppass) {
        User.findOne({ email: puser }, function(err, user) {
            if (user === null) {
                req.send(401);
            }
            if (bcrypt.compareSync(ppass, user.pass) === true) {
                req.user = user;
                return next();
            } else {
                res.send(401);
            }
        });
    } else {
        res.redirect('/');
    }
}

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({
        secret: 'SECRET'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

/* App routes */
app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        routes.account(req, res);
    } else {
        routes.index(req, res);
    }
});
app.get('/account', reqAuth, routes.account);
app.get('/bookmarklet', reqAuth, bookmarklet.bookmarklet);
app.get('/bmui', reqAuth, bookmarklet.bmui);
app.post('/login',
        passport.authenticate('local'),
        function(req, res) {
            res.send(200);
        }
);

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/* API routes */
app.post('/register', api.addUser);
app.all('/save', reqAuth, api.addLink);
app.post('/links', reqAuth, api.listLinks);
app.post('/linksInFolder', reqAuth, api.listFolderLinks);
app.post('/changeDesc', reqAuth, api.changeLinkDesc);
app.post('/delete', reqAuth, api.removeLink);
app.post('/changeFolder', reqAuth, api.changeLinkFolder);
app.all('/folders', reqAuth, api.listFolders);
app.post('/addFolder', reqAuth, api.addFolder);
app.post('/removeFolder', reqAuth, api.removeFolder);

/* Start app */
app.listen(PORT);

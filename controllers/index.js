var fs = require('fs');

function init(app) {
    loadRoutes(app);
    initRootRoutes(app);
    /*
    app.get('/', function (req, res) {
        if (!req.user) {
            res.redirect('/login');
        }
        else {
            res.render('cols-12', { layout : false, title : '' });
        }
    });
    */
}

// get a list of all route and init each one
function loadRoutes(app) {
    // load up all the routes
    fs.readdir(__dirname, function (err, files) {
        if (err) throw err;
        files.forEach(function (file) {
            loadRoute(app, file);
        });
    });
}

// load and initialize an individual route file
function loadRoute(app, file) {
    var name, route, match = /^([a-z_]*)\.js$/.exec(file);
    if (match) {
        name = match[1];
        if (name == 'index') return; // Don't include this file

        // load the route and call the init function if there is one
        route = require('./' + name);
        Object.keys(route).map(function (action) {
            switch (action) {
                case 'init':
                    route.init(app);
                    break;
                case '_init':
                    route._init(app);
                    break;
                default :
                    console.log('no init');
                    break;
            }
        });
    }
}

// init the base routes of the application
function initRootRoutes(app) {

    app.get('/logout', function (req, res) {
        if (req.loggedIn) {
            req.logout();
        }
        res.redirect('/');
    });

    app.all('/manager*', function(req, res, next) {
        if (!req.loggedIn) {
            res.redirect('/');
        } else {
            next();
        }
    });
}

exports.init = init;

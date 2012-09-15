var cp = require('child_process'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express'),
    socketio = require('socket.io');

var https_options = {
    key : fs.readFileSync('./certs/privatekey.pem'),
    cert : fs.readFileSync('./certs/certificate.pem')
};

var app = express();

// configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	
	app.use(express.favicon());
    app.use(express.cookieParser('abcdefg1234567'));
    app.use(express.session({
        secret: 'abcdefg1234567'
    }));

	app.use(express.static(__dirname + '/public'));
    app.use(express.methodOverride());
    app.use(express.bodyParser());

	app.use(app.router);

});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(function (err, req, res, next) {
        console.log(err);
    });
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// load controller
require('./controllers').init(app);

//var server = https.createServer(https_options, app);
var server = http.createServer(app);
var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
    console.log('socket connected!');
    socket.on('command', function (data) {
        var child;
        if (data.slice(0,2) === 'cd') {
            try {
                process.chdir(data.slice(3, data.length));
                socket.emit('command:response', {
                    cwd : process.cwd(),
                    stdout : '',
                    stderr : ''
                });
            }
            catch (err) {
                console.log('chdir err: ' + err);
            }
        }
        else {
            try {
                child = cp.exec(data, function (error, stdout, stderr) {
                    console.log(error);
                    console.log(stdout);
                    console.log(stderr);
                    socket.emit('command:response', {
                        cwd : process.cwd(),
                        stdout : stdout,
                        stderr : stderr
                    });
                });
            }
            catch (err) {
                console.log('command err: ' + err);
            }
        }
    });
});
server.listen(3000);

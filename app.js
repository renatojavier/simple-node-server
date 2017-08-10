var express = require('express');
var app = express();

var path = require('path');
var http = require('http');
var EventEmitter = require('events').EventEmitter;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var HomeRoute = require('./routes/home');
var DishesRoute = require('./routes/dishes');
var RESTService = require('./services/RESTService');

// TEST
var FooRoute = require('./routes/foo');

var expect = require('chai').expect;

// setMaxListeners to infinite
EventEmitter.setMaxListeners = 100;

// setup for view engine and root directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// assistive vendor middlewares
app.use( logger('dev') );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: true }) );
app.use( cookieParser() );
app.use( express.static(path.join(__dirname, 'public')) );

// mount routes middleware to the app
app.use('/', HomeRoute);
app.use('/dishes', DishesRoute);
app.use('/rest', RESTService);
app.use('/foo', FooRoute);

// catch 404 and forward to error handler middleware
app.use((req, res, next) => {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// get port from process environment and store in Express
var port = normalizePort( process.env.port || '2088' );

// set port
app.set('port', port);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if ( isNaN(port) ) {
        // named pipe
        return val;
    }

    if ( port >= 0 ) {
        // port number
        return port;
    }

    return false;
}

// create server
const server = http.createServer(app);

// start server on port set
server.listen(port);
server.on('listening', () => {
    console.log(`Server is listening at port ${port}\n--------------------------------`);
});

server.on('error', (err) => {
    console.log(err.syscall);
    console.log(err.code);
});

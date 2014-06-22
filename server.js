var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');


//glj add
var mongoSore = require('connect-mongo')(express);
//var settings = require('./settings');

var routes = require('./routes');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// all environments  add glj
app.set('port', process.env.PORT || 8081);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //拒绝直接路径进行访问
app.use(app.router);

app.get('/', routes.index);
app.get('/index.html', routes.index);
app.get('/demo.html', routes.demo);

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes(app);//这里执行

//app.get('/lib.html', routes.lib);
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,  //标题 比如not found
            error: err             //错误信息 404  以及stacktrace 信息打印
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//下面是创建启动服务器：
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var template = require('art-template');
var os = require('os');
var app = express();

// var proxy = require('http-proxy-middleware');

var emailUtil = require('./routes/util/getMailer');

// 视图引擎设置
template.config('base', '');
template.config('extname', '.html');
template.config('encoding', 'utf-8');
template.config('openTag', '[[');
template.config('closeTag', ']]');
template.config('cache', false);
//template.config('compress', true);


// service discovery start
// discovery();

app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//资源托管
app.use(express.static(path.join(__dirname, 'public')));
//跨域设置
app.use(function(req, res, next){
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //  res.header('Access-Control-Allow-Headers', 'Content-Type');
  //  res.header('Access-Control-Allow-Credentials','true');
  //  res.header('Content-Type', 'application/json; charset=utf-8');
   res.header('X-Powered-By', 'wtf');

   if (req.method == 'OPTIONS') {
      res.send(200); //让options请求快速返回
     }else {
       next();
     }
});
//网关控制台
app.use('/admin', require('./routes/index'));
//拦截设置,代理设置
app.use('/gateway', require('./routes/gateway'));
//代理设置
// app.use('/gateway', proxy({
//    target:'http://192.168.2.247:8080',
//    changeOrigin:true,
//    pathRewrite: {
//            '^/gateway' : '/',
//        },
//  }));









// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.send({
    message: err.message,
    status: err.status || 500,
    stack:  err.status!==404 ?err.stack:''
  });

});


process.on("uncaughtException", function (err) {

  //系统级异常监控
  console.info('进程异常:',err.message + "\n\n" + err.stack + "\n\n" + err.toString());

  emailUtil.sendMail({
    subject : "saas.web http://"+'serverIp'+" 发生严重错误，导致用户不能正常使用系统，请火速救援 [Web Server Error]",
    text    : err.message + "\n\n" + err.stack + "\n\n" + err.toString()
  });

  setTimeout(function () {
    process.exit(1);
  }, 5000);

});


module.exports = app;

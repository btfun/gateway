var  gulp = require('gulp'),
     babel = require('gulp-babel'),//es6转es5
     uglify = require('gulp-uglify'),//js压缩仅支持es5写法
     cleancss = require('gulp-clean-css'),//css压缩
     less = require('gulp-less'),//编译less
     gulpif = require('gulp-if'),
     minifyhtml = require('gulp-htmlmin'),//压缩html
     concat = require('gulp-concat'),//合并文件 css使用
     autoprefixer = require('gulp-autoprefixer'),//CSS浏览器前缀补全
     del = require('del'),//删除
     watch = require('gulp-watch'),//监听
     merge = require('merge-stream'),
     debug = require('gulp-debug'),
     plumber = require('gulp-plumber'),
     jshint=require('gulp-jshint'),//语法检查
     through2= require('through2'),//路径替换
     runSequence = require('run-sequence'),//顺序执行
     path = require('path'),
     fs = require('fs'),
     glob = require('glob');

     var browserSync = require('browser-sync').create();
     var nodemon = require('gulp-nodemon');
     var reload  = browserSync.reload;

     var options ={
       env :  process.env.NODE_ENV || 'dev'
     }
     var str=process.argv.slice(2);
     if(str.length===3){
       options.env=str[2] || 'dev'
     }

    var paths ={
       path:'public/',
       styles: {
         srcAll:    ['public/components/global/**/*.{css,less}'],//组件样式，需合并  '!public/components/**/theme-*.{css,less}'

         srcApp:    ['public/components/manager/**/*.{css,less}'],

         toBulidApp:'public/stylesheets/manager/app.less',
         dest:   'dist/stylesheets/manager',

         libSrc: 'public/stylesheets/lib/**/*.*',//可能存在字体文件 所以用*号
         libTo:  'dist/stylesheets/lib'
       },
       tmpls: {
         src: 'public/components/**/*.html',//模板，无需合并
         dest: 'dist/components'
       },
       scripts: {
         requireConf : './public/javascripts/**/requireConf.js',
         //组件
         componentsSrc: 'public/components/**/*.js',
         componentsTo: 'dist/components',
         //公用
         golablBaseSrc: 'public/javascripts/base/**/*.js',
         golablBaseTo: 'dist/javascripts/base',
         //主入口
         golablSrc: 'public/javascripts/manager/**/*.js',
         golablTo: 'dist/javascripts/manager',
         //lib脚本
         libSrc: 'public/javascripts/lib/**/*.*',
         libTo: 'dist/javascripts/lib'
       },
       images:{
         src: 'public/components/**/*.{png,jpg,gif,ico}',
         dest: 'dist/images'
       }
    }

     gulp.task('mini_app_css', function(){
       //注意 如果发现合并后的css文件大小超过500KB 则需要处理成2个压缩文件

         return gulp.src(paths.styles.toBulidApp)
         .pipe( debug({title: '编译css:'}))
         .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
         .pipe( gulpif(options.env !== 'online', sourcemaps.init() ))//发布的时候才取消 sourcemaps
         .pipe( less())
         .pipe( gulpif(options.env !== 'online', sourcemaps.write() ))
         .pipe( autoprefixer({
             browsers: ['last 2 versions', 'Android >= 4.0'],
             cascade: true, //是否美化属性值 默认：true 像这样：
             remove:true //是否去掉不必要的前缀 默认：true
         }))
         .pipe( gulpif(options.env === 'online',cleancss({
           compatibility: 'ie8',
           advanced: true,
           keepSpecialComments: '*'
         })) )//发布的时候才压缩
         .pipe( concat('app.min.css'))
         .pipe( gulp.dest(paths.styles.dest) ) //输出文件夹
         .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
     });

     //lib库复制
gulp.task('copylib',function(){
  var jslib= gulp.src(paths.scripts.libSrc)
        .pipe( gulp.dest(paths.scripts.libTo));

  var csslib= gulp.src(paths.styles.libSrc)
        .pipe( gulp.dest(paths.styles.libTo));

  return merge(jslib, csslib);
});
/***********************js模块编译压缩*******************************/
gulp.task('minifyjs', function(){

  var base= gulp.src(paths.scripts.golablBaseSrc)
      .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe( changed(paths.scripts.golablBaseTo))//通过改变的文件
      .pipe( babel({presets: ['es2015','stage-3']})) //es6转es5
      .pipe( jshint())//语法检查
      .pipe( gulpif(options.env === 'online', uglify({
           mangle: {except: ['require' ,'exports' ,'module' ,'$','that']}
          }).on('error',function(e){
           console.error('【minifyjs】错误信息:',e);
         }) ))//发布的时候才压缩
      .pipe( gulp.dest(paths.scripts.golablBaseTo))  //输出
      .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新


var manager=gulp.src(paths.scripts.golablSrc)
    .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe( changed(paths.scripts.golablTo))//通过改变的文件
    .pipe( babel({presets: ['es2015','stage-3']})) //es6转es5
    .pipe( jshint())//语法检查
    .pipe( gulpif(options.env === 'online', uglify({
         mangle: {except: ['require' ,'exports' ,'module' ,'$','that']}
        }).on('error',function(e){
         console.error('【minifyjs】错误信息:',e);
       }) ))//发布的时候才压缩
    .pipe( gulp.dest(paths.scripts.golablTo))  //输出
    .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新

var components=gulp.src(paths.scripts.componentsSrc)
    .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe( changed(paths.scripts.componentsTo))//通过改变的文件
    .pipe( debug({title: '编译js:'}))
    .pipe( babel({presets: ['es2015','stage-3']})) //es6转es5
    .pipe( jshint())//语法检查
    .pipe( gulpif(options.env === 'online', uglify({
         mangle: {except: ['require' ,'exports' ,'module' ,'$','that']}
        }).on('error',function(e){
         console.error('【minifyjs】错误信息:',e);
       }) ))//发布的时候才压缩
    .pipe( gulp.dest(paths.scripts.componentsTo))  //输出
    .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新


      return merge(base, manager,components);
});
//html模板压缩
gulp.task('minifyhtml', function(cb) {
   return gulp.src(paths.tmpls.src)
    .pipe( minifyhtml({removeComments: true,collapseWhitespace: true}))
    .pipe(gulp.dest(paths.tmpls.dest))
    .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
});
//图片迁移
gulp.task('minifyimages', function() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));

});
// 静态服务器 + 监听 scss/html 文件

gulp.task('server',function(cb){
    var started = false;
      nodemon({
        ignore:['gulpfile.js','./node_modules/','./public/','./dist/'], //忽略不需要监视重启的文件 ,
        script: './bin/distribution'
    }).on('start',function(){
      if (!started) {
        started = true;
        browserSync.init({
            files: ['./views/**/*.*'], //, './public/**/*.*'（和浏览器注入脚本不能同事使用）
            proxy:'http://127.0.0.1:3000', //设置代理运行本地的3000端口
            port:8070, //设置browser-sync的运行端口号
            browser: 'chrome',
            notify: false
        },function(){
            console.log('浏览器已刷新')
        })
      }
    });


    gulp.watch([paths.styles.srcApp, paths.styles.toBulidApp],  ['mini_app_css']);
    gulp.watch([paths.scripts.golablSrc, paths.scripts.golablBaseSrc, paths.scripts.componentsSrc], ['minifyjs']);
    gulp.watch([paths.tmpls.src], ['minifyhtml']);

})

//删除掉上一次构建时创建的资源
gulp.task('clean', function() {
  return del(['dist/*','!dist/favicon.ico']);
});
//**********开发****************//
gulp.task('default', ['copylib','minifyjs', 'mini_app_css','minifyhtml','minifyimages'], function(callback) {

  // 将你的默认的任务代码放在这

});

//**********生产****************//
gulp.task('online',function(cb){
  options.env='online'; //开启压缩
  runSequence(['copylib','minifyjs', 'mini_app_css','minifyhtml','minifyimages'],'replacehtml',cb)

});


gulp.task('replacehtml', function(){

  var requireConf={};

  //获取所有的配置文件
  glob.sync(paths.scripts.requireConf).forEach(function (entry) {
      var dir = require(entry);
      Object.assign(requireConf,dir)
  });

var maps=Object.keys(requireConf).filter((ite)=>{
    //筛选出模板
   return  ite.indexOf('Tmpl')>-1 ?true:false;
 });

 return gulp.src([paths.scripts.componentsTo+'/**/*.js'])
    .pipe(through2.obj(function(file, encoding, done) {
        var content =  (String(file.contents));
        var item=maps.filter((item)=>{
            return   content.indexOf(`require('text!${item}.html')`) >-1  || content.indexOf(`require("text!${item}.html")`) >-1;
        })[0];

        if(item){
          var pathll='./dist/'+requireConf[item]+'.html';
          if(pathll){
            var str = fs.readFileSync(path.resolve(__dirname, pathll),'utf8');
                str=new Buffer(encodeURIComponent(str)).toString();
                //.toString("base64") atob
              content=content.replace(`require('text!${item}.html')`, `decodeURIComponent(("${str}"))`);
              content=content.replace(`require("text!${item}.html")`, `decodeURIComponent(("${str}"))`);
          }
        }

        file.contents = new Buffer(content);
        this.push(file);
        done();
    }))
    .pipe( gulp.dest(paths.scripts.componentsTo));  //输出

})

var express = require('express');
var router = express.Router();
var dateV=new Date();
var timeStamp= 'v='+dateV.getFullYear()+(dateV.getMonth()+1)+
                  dateV.getDate()+dateV.getHours()+dateV.getMinutes();

/* 全局拦截器*/
router.get('*',function(req, res, next){
  // console.log('进来了',req.xhr,req.ip)
  next();

});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('进来了',req.xhr,req.ip)

  res.render('index', {
    version :  timeStamp
   });
   
});

router.get('/pipe', function(req, res, next) {
  // res.sendStatus(200);
  // res.status(200)
  // res.render('index', { title: "测试" }, function (err, str) {
  //      res.write(str)
  //      console.log(`*******--*`,str)
  //  })
  // res.writeHead(200, {
  //         "Content-Type": "application/json"
  //     });
  res.header('Content-Type','application/json');


  var obj={
      uri:'one',
     name: "hello=================大的萨达大大=====",
     name1: "hello=================大的萨达大大=====",
     name2: "hello=================大的萨达大大=====",
     name3: "hello=================大的萨达大大=====",
     name4: "hello=================大的萨达大大=====",
     name5: "hello=================大的萨达大大=====",
     name6: "hello=================大的萨达大大=====",
     say:" 你hello=========刚发的广泛地============="
   }
  setTimeout(()=>{
    res.write(JSON.stringify(obj),(cb)=>{
      console.log(`*****************`,req.xhr)
    });
  },800)

  setTimeout(()=>{
     obj={
       uri:'three',
       name: "hello========66666=============="
     }
    res.write(JSON.stringify(obj),(cb)=>{
      console.log(`1111111111111111`)
    });
  },1200)

  setTimeout(()=>{
     obj={
       uri:'three',
       name: "hello======================"
     }
    res.write(JSON.stringify(obj),(cb)=>{
      console.log(`22222222222222222222`)
    });
  },1600)

  setTimeout(()=>{
    res.end();
  },2000)

  // res.send({
  //   name:'battle',
  //   bool: true
  // })

});


module.exports = router;

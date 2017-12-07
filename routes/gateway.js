var express = require('express');
var router = express.Router();

var EventProxy = require('eventproxy');
var proxy = new EventProxy();

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var balance = require('./middlewares/loadbalance')();//加载负载


var getAccessToken = require('./util/getAccessToken');
var implement = require('./controllers/index');

var STATUS={
  SUCCESS: 200,
  NOTFIND: 404,
  ERROR: 400
};
const SEND_TOTLE=10;
var signlist=[];
/* 拦截器链*/

router.all('*',function(req, res, next){
  //1 token拦截器

  var accessToken=req.param('access_token');
  getAccessToken(accessToken,function(err,data){
    if(err){
      res.send({
        message: `[token interceptor]: accessToken=${accessToken}，失败原因:${err}`,
        status: STATUS.NOTFIND
      });
    }else{
    /*
    * 如果  accessToken 存在 但是这个包含的链接所访问的店铺不是属于该accessToken也要报错
    * 链接需要区分 访问的是否 是SAAS店铺的数据以便处理
    */
      // console.log('测试----',data)
        next();
    }
  })

}).all('*',function(req, res, next){
  //2 u拦截器
  console.log('测试==2=进来了')
  next();

}).all('*', function(req, res, next) {


var api=req.param('api'), apiList=[];
var sendType=Number(req.param('send_type')||0);//0并行， 1快去快回，（串行需要独立编程）
var accessToken=req.param('access_token');

  if(!api){
    //直接下一步走代理
    return next();
  }

  if('GET'===req.method){
      apiList=JSON.parse(api);
  }else{
      apiList=api;
  }

  if(apiList.length==1){
    console.log('进入代理>')
    return next();
  }else{
    console.log('合并处理>',sendType)

    var attrList=apiList.filter((item)=>{
        return item && Array.isArray(item);
    });
    //请求不得超过10
    var bool=attrList.some((item)=>{
      return item.length>SEND_TOTLE;
    });

    if(apiList.length>SEND_TOTLE || bool){
      res.send({
        message: `[api interceptor]: 失败原因:请求并发超过${SEND_TOTLE}`,
        status: STATUS.ERROR
      });
    }else{
      //正常处理 request
      /*
      并行请求
      顺次依赖
      独立请求，谁先完成谁先返回bigPipe
      */


      apiList.forEach((item)=>{
        // item.url
        item.data.access_token=accessToken;
      });

      var signGl= JSON.stringify(apiList);

      var bool=signlist.some((item)=>{
        return item.signStr==signGl;
      });
      signlist.push({
        signStr:signGl,
        res:res
      })

      //防雪崩处理   signlist 这个处理方式需要压力测试
      if(!bool){
        //调用
        1==sendType? implement.pipe(req,res,apiList,proxy): implement.parallel(req,res,apiList,proxy)
        //接收
        proxy.once(signGl, function(data) {
          //统一发回响应
          signlist.filter((iter)=>{
            return iter.signStr==signGl;
          }).forEach((iter)=>{
            // 1==sendType? iter.res.end(JSON.stringify(data)+'!@!'):iter.res.send(data)
            1==sendType? iter.res.end(JSON.stringify(data)):iter.res.send(data)
          })
          //干掉队列中已响应的
          signlist=signlist.filter((ite)=>{
            return ite.signStr!=signGl;
          })

        });

      }else{
        //发现相同的url暂不处理等待一次性返回
        //如果时pipe类型的 可以单独做管道处理（会有处理时间差问题 暂时不做处理）
      }


    }
  }

}).all('*',function(req, res, next){
  //单个请求处理

  console.log('==into proxy=================',req.url)

  // var url=req.url.split('?')[0]

  var serviceName=req.param('service_name');

  console.log(service_name,'---------',balance('user'))

  if(serviceName){
    //调用负载 获取调用节点
    // balance(serviceName)
    proxy.web(req, res, {
        target: url,
        proxyTimeout: 5000,
    });
  }






  next()
})






module.exports = router;

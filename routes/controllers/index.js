const request = require('request');
const STATUS={
  SUCCESS: 200,
  NOTFIND: 404,
  ERROR: 400
};

function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    return arr.join("&");
}

var total=0;
module.exports={
  parallel:function(req,res,apiList, proxy){
    console.log(`------parallel------${total++}`)
    var signGl= JSON.stringify(apiList);

    // 并行执行异步操作的能力
    Promise.all(apiList.map((item,ins)=>{
            return new Promise(function(resolve, reject){

              var url=`${item.url}?`+formatParams(item.data);
              console.log('------------',url)
              var startTime=new Date().getTime();
              setTimeout(()=>{


              request(url, function (error, response, body) {
                var endTime=new Date().getTime();
                consume= `耗时：${endTime-startTime}ms`;
                if(error){
                  reject({
                    url:item.url,
                    error: error,
                    consume: consume
                  })
                }else{
                  if(response && response.statusCode==200){

                    resolve({
                      url:item.url,
                      body: 'body',
                      consume: consume
                    })
                  }else{
                    reject({
                      url:item.url,
                      response:response,
                      consume: consume,
                      message:'状态不对，调用异常'
                    })
                  }
                }
              });

              },500*(ins+1))

            })
    })).then(function(results){
        proxy.emit(signGl, {
          // method: req.method,
          path: req.path,
          results: results
        });

    });
  },
  pipe:function(req, res, apiList, proxy){
      console.log(`------pipe------${total++}`)
      //非常重要 跟 res.send()冲突
      res.header('Content-Type','application/json;charset:utf-8;');
      var signGl= JSON.stringify(apiList);

    Promise.all(apiList.map((item,ins)=>{
            return new Promise(function(resolve, reject){

              var url=`${item.url}?`+formatParams(item.data);
              var sign= (url);//标记
              proxy.once(sign, function(data) {
                if(STATUS.SUCCESS==data.status){
                  // res.write(JSON.stringify(data)+'!@!');
                  res.write(JSON.stringify(data));
                  //执行
                  resolve(data)
                }else{;
                  // res.write(JSON.stringify(data)+'!@!');
                  res.write(JSON.stringify(data));
                  //异常
                  reject(data)
                }
              });

              var startTime=new Date().getTime();
              setTimeout(()=>{

              request(url, function (error, response, body) {
                var endTime=new Date().getTime();
                consume= `耗时：${endTime-startTime}ms`;
                if(error){
                  proxy.emit(sign, {
                    url:item.url,
                    status: STATUS.ERROR,
                    message: error,
                    consume: consume,
                    content: ''
                  });

                }else{
                  if(response && response.statusCode==200){
                      proxy.emit(sign, {
                        url:item.url,
                        status: STATUS.SUCCESS,
                        message: error,
                        consume: consume,
                        content: 'body'
                      });

                  }else{
                      proxy.emit(sign, {
                        url:item.url,
                        status: STATUS.ERROR,
                        message: '返回状态异常',
                        consume: consume,
                        content: 'body'
                      });

                  }
                }
              });

            },1000 * (ins+1) )

            })
    })).then(function(results){
      proxy.emit(signGl, results);
    });

  },
  sequence:function(req, res){

      res.send({
        method: req.method ,
        path: req.path,
        param:  req.query,
        date : (new Date().format("yyyy-MM-dd hh:mm:ss"))
      });
  }

}





Function.prototype.method=function(name,fn){
    if(!this.prototype[name]){
        this.prototype[name]=fn;
        return this;
    }
};


if(!Date.prototype.format){
    Date.prototype.format =function(format){
        var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
            (this.getFullYear()+"").substr(4- RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length==1? o[k] :
                    ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    };
}

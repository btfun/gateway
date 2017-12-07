
//电脑性能监控

var lv=1024 * 1024 * 1024;

module.exports=function(){
  const os = require('os')
var  cpuInfos=os.cpus()
var lvtol=0;
cpuInfos.forEach((item)=>{
  var tol=item.times.user+item.times.nice+
          item.times.sys+item.times.idle+item.times.irq;
  item.lv= Number( ((tol-item.times.idle)/tol).toFixed(5));
  lvtol+=item.lv;
});
lvtol=Number((lvtol).toFixed(5))


  return {
      cpus: cpuInfos.length,
      cpulv: ((lvtol/cpuInfos.length)*100).toFixed(3)+'%',
      speed: cpuInfos[0].speed,
      totalmem: (os.totalmem()/lv).toFixed(2)+'G',
      freemem: (os.freemem()/lv).toFixed(2)+'G',
      // loadavg: os.loadavg()
  }
}





function run(){

  var childs=0;
  loadlist.forEach((item)=>{
    childs+=item.child.length;
  })
console.log(`loadlist 机器数量: ${loadlist.length} ,服务数量: ${childs}`)

  //服务节点调用列表
  var domain_main= [];
  function start(domain){
    var diff = process.hrtime();
    /********************/
    var weightload=[];

    //筛选
    var domain_child=domain_main.filter((item)=>{
      return item.domain===domain;
    })[0];

    if(domain_child && false){
      // 更新 放在其他地方处理
      weightload=domain_child.child;
      // console.log('88888888888888888888888888888')
    }else{
      //1 筛选出符合领域的机器地址
      var domainload= loadlist.filter((item)=>{
        return item.child.some((ite)=>{
          return ite.domain===domain;
        })
      });
      //2 根据权重配置展开调用列表
      var qztol=0;
      domainload.forEach((ite)=>{
         qztol+=ite.qz;
      })

      domainload.forEach((item,ins)=>{
        item.target=item.child.filter((iter)=>{
          return iter.domain===domain;
        })[0];//筛选出对应的目标rest服务列表

        for (var i = 0; i < item.qz; i++) {
          weightload.push(Object.assign({},item,{
            // current: (ins==0 && i==0) ? 1: 0, //可能造成首次所有请求 都到一台机器上
            current: 0,
            index: weightload.length
          }));
        }
      });

      if(weightload.length!==qztol){
        throw new Error('计算错误')
      }

      var startIndex=Math.floor(Math.random() * qztol);
      weightload.forEach((ite,ins)=>{
        if(startIndex===ins){
          ite.current=1;
        }
      })

      //3 丢进主调用列表
      domain_main.push({
        domain: domain,
        child: weightload,
        domainload: domainload
      })
    }

    /********************/

    //2 筛选出即将调用的机器地址
    var tol= weightload.length;
    var iter= weightload.filter((item)=>{
      // console.log(item.serverIp,'--------',item.qz)
      return item.current==1
    })[0];
    if(!iter){
      console.log('不存在的')
      return
    }

    //3 当前机器地址重置为0
    iter.current=0;
    // console.log(`当 前url:${iter.serverIp} ,${iter.index}`)

    //4 赋值下一次调用的机器地址
    var next=weightload[(iter.index+1) < tol ? (iter.index+1) : 0];
    next.current=1;

    return iter;

    // console.log(`下一位url:${next.serverIp} ,${next.index}`)
    var diff2 = process.hrtime(diff);
    var ms=diff2[1]/100000000;// 1毫秒=1亿纳秒=1百万微秒
    console.log(`当 前url:${iter.serverIp},${iter.index}---下一位url:${next.serverIp} ,${next.index}  -`,ms,'ms')

  }

  start('user')


setInterval(()=>{

  console.log(start('user'))

},1000)



}


    function tim(){
      var diff = process.hrtime();
      return (diff[0] * 1000000 + diff[1]) ; // nano second -> ms
    };

run();

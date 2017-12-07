/*
*  1 轮询调度算法
*  2 权重轮询调度算法
*  3 随机
*/

/*
* 已知服务器IP地址 调用URL
* 进来多个并发请求
* 保证服务器负载基本一致 调度数据的原子性
*/


const loadlist = require('./loadbalanceData')(20,200);

var discovery = require('./discovery');//获取所有ZK的服务
discovery();
var weight = require('../../conf/weight');//获取权重配置

module.exports=function( ){
  //处理获取的所有ZK服务节点

  // console.log('server list--',loadlist)

  //服务节点调用列表
  var domain_main= [];
  return function balance(domain){
    if(!domain) return false;
    /********************/
    var weightload=[];
    //筛选
    var domain_child=domain_main.filter((item)=>{
      return item.domain===domain;
    })[0];

    if(domain_child){
      // 更新 放在其他地方处理
      weightload=domain_child.child;
    }else{
      //1 筛选出符合领域的机器地址
      var domainload= loadlist.filter((item)=>{
        return item.child.some((ite)=>{
          return ite.domain===domain;
        })
      });
      //2 根据权重配置展开调用列表
      domainload.forEach((item,ins)=>{
        item.target=item.child.filter((iter)=>{
          return iter.domain===domain;
        })[0];//筛选出对应的目标rest服务列表

        for (var i = 0; i < item.qz; i++) {
          weightload.push(Object.assign({},item,{
            current: (ins==0 && i==0) ? 1: 0,
            index: weightload.length
          }));
        }
      });

      var qztol=0;
      domainload.forEach((ite)=>{
         qztol+=ite.qz;
      });

      //3 随机起点下标
      var startIndex=Math.floor(Math.random() * qztol);
      weightload.forEach((ite,ins)=>{
        if(startIndex===ins){
          ite.current=1;
        }
      })

      //4 丢进主调用列表
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
      return item.current==1;
    })[0];
    if(!iter){
      //错误补充
      var startIndex=Math.floor(Math.random() * tol);
          iter=weightload[startIndex];
      console.warn(`出现异常，已自动随机起点地址`);
    }
    //3 当前机器地址重置为0
    iter.current=0;
    //4 赋值下一次调用的机器地址
    var next=weightload[(iter.index+1) < tol ? (iter.index+1) : 0];
    next.current=1;

     return iter;
  }


}

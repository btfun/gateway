
var loadlist=[
  {
    index:0,
    serverIp:'http://192.168.2.100',
    total: 0, //统计调用次数
    current:0,
    qz: 7,
    child: [{
      domain: 'user',
      service: []
    },{
      domain: 'shop',
      service: []
    }]
  },
  {
    index:1,
    serverIp:'http://192.168.2.101',
    total: 0, //统计调用次数
    current:1,
    qz: 5,
    child: [{
      domain: 'user',
      service: []
    },{
      domain: 'shop',
      service: []
    }]
  },
  {
    index:2,
    serverIp:'http://192.168.2.102',
    total: 0, //统计调用次数
    current:0,
    qz: 1,
    child: [{
      domain: 'user',
      service: []
    },{
      domain: 'shop',
      service: []
    }]
  },
  {
    index:3,
    serverIp:'http://192.168.2.103',
    total: 0, //统计调用次数
    current:0,
    qz: 2,
    child: [{
      domain: 'user',
      service: []
    },{
      domain: 'shop',
      service: []
    }]
  }
];


//权重配置
//权重 中间系数 (1~5)3,(1~7)4,(1~9)5

/**
* 理论上服务器的配置一样，但是机器上运行的服务不一样
* 如果按照轮训机制来负载，会造成部分机器的压力不均衡
* 这时需要权重分配来减小这种问题
*/

var weight=[
  {
    nameIp: 'http://192.168.2.120',
    qz: 6
  },
  {
    nameIp: 'http://192.168.2.112',
    qz: 3
  },
  {
    nameIp: 'http://192.168.2.134',
    qz: 1
  }
];


module.exports=function(cps,service){

  var cops=cps||50; //硬件服务器台数
  var service=service||200; //每台机器上对外提供的服务数量


  for (var i = 0; i < cops; i++) {
    var serverIp=`http://192.168.2.${103+i}`;
    //加载权重值
    var wg=weight.filter((ite)=>{
      return ite.nameIp==serverIp
    })[0]||{qz: 4} //默认 权重中间值（ 3， 4， 5）

    var m=i%2;
    var child =[];
    for (var s = 0; s < service; s++) {
       child.push({
         domain: m>0 ? 'user': 'A',
         service: []
       })
    }

     loadlist.push({
       index: loadlist.length,
       serverIp: serverIp,
       total: 0, //统计调用次数
       current:0,
       child: child,
       qz:wg.qz ////权重
     })
  }

  return  loadlist;
}

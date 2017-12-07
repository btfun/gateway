/*
* 权重配置
* 整数
* 权重 中间系数 (1~5)3,(1~7)4,(1~9)5
* 只需配置有差异化的机器权重
**/

module.exports = function(){

/*
*  (1~5)3
* 只需配置有差异化的机器权重
*/

  var weight=[
    {
      nameIp: 'http://192.168.2.120',
      qz: 5
    },
    {
      nameIp: 'http://192.168.2.2',
      qz: 5
    },
    {
      nameIp: 'http://192.168.2.134',
      qz: 1
    }
  ]

  weight.forEach((item)=>{
    if(item.qz>5)item.qz=5;
    if(item.qz<0)item.qz=0;
  })

  return {
    middle: 3,
    weight: weight
  };

}

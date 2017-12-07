/**
* 配置文件
*
*/
module.exports ={
  //redis 配置文件
  redis: {
    client1:{
      name: 'BeidouRedis1',
      host: '192.168.20.113',
      port: '6379',
      timeout: '5000',
      password: 'mljia'
    },
    client2:{
      name: 'BeidouRedis2',
      host: '192.168.20.114',
      port: '6379',
      timeout: '5000',
      password: 'mljia'
    }
  },
  //email 配置文件
  email: {
    host : "smtp.exmail.qq.com",
    port : 25,
    user : "devtest@mljia.cn",
    pass : "beauty123",
    from : "devtest@mljia.cn",
    //收件人列表
    receivers   : [
      "battle@mljia.cn",
      "",
      "",
      ""
    ]
  },
  //server 配置
  SERVER: {
    TARGET: 'http:192.168.2.247:8080', //可多条配置
    ZK_HOST: '192.168.20.110:2181',
    SERVICE_ROOT_PATH: '/service/discovery',
    ROUTE_KEY: 'microservice',
    SERVICE_NAME: '',
    API_NAME: ''
  }

}

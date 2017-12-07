var zookeeper = require('node-zookeeper-client');
// var loadbalance = require('loadbalance');
var conf = require('../../conf/index');
const SERVER=conf.SERVER;
var zkClient = zookeeper.createClient(SERVER.ZK_HOST);
// var authRedis = require("../util/getRedis");

//服务发现方式

var server={
  connect(){
    /**
     * 连接ZK
     */
    zkClient.connect();
    zkClient.once('connected', function() {
        console.log('Connected to ZooKeeper.');
        server.getServiceList(SERVER.SERVICE_ROOT_PATH);
    });

  },
  getServiceList(path){
    /**
     * 获取服务列表
     */
     zkClient.getChildren(
         path,
         // 监听列表变化
         function(event) {
             console.log('Got Services watcher event: %s', event);
             server.getServiceList(SERVER.SERVICE_ROOT_PATH);
         },
         function(error, children, stat) {
             if (error) {
                 console.log(
                     'Failed to list children of %s due to: %s.',
                     path,
                     error
                 );
                 return;
             }
             console.log('server list:',children)

             // 遍历服务列表，获取服务节点信息
             children.forEach(function(item) {
                 server.getService(path + '/' + item,item);
             })

         }
     );

  },
  getService(path,item){

    /**
     * 递归获取服务节点信息
     *
     */
    zkClient.getChildren(
        path,
        // 监听服务节点变化
        function(event) {
            console.log('Got Serivce watcher event: %s', event);
            server.getService(path,item);
        },
        function(error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    path,
                    error
                );
                return;
            }
            // 打印节点信息
            console.log('>>');
            // console.log(`>${item}>`,'server path: ' + path + ', children is ' ,children);
            console.log('fullpath: ' + path + ', children is===== ' ,children);
            if (children.length > 0) {
               //设置本地缓存和负载策略
               children.forEach(function(item) {
                   server.getService(path + '/' + item);
               })
               if(item){
                 //获取负载节点
                //  console.log('loadbalance----- ' , loadbalance.roundRobin(children));
               }
              //  cache.getItem(constants.ROUTE_KEY)[path] = loadbalance.roundRobin(children);

            }else{
              // 打印节点信息

              server.getServicePath(path,item)

            }

        }
    );
  },
  getServicePath(fullPath,item){
    /**
     * 获取具体服务请求信息（IP,Port）
     */
    zkClient.getData(fullPath,
       function (event) {
           console.log('Got event: %s', event);
       },
       function (error, data, stat) {
           if (error) {
               console.log('Error occurred when getting data: %s.', error);
               return;
           }

           var str=data.toString()

           if(str){
             var dataJson= JSON.parse(str);
             var targetAddress="http://"+dataJson.address+':'+dataJson.port;
            //  proxy.web(req, res, { target: targetAddress });
            // console.log('--success--data-',data.toString())
              console.log('--success---' ,targetAddress,item, dataJson.payload.requestUrl)
              // console.log('-----',targetAddress ,JSON.stringify(dataJson,null,2))
           }else{
              console.log('没有可用的链接')
           }


          //  console.log('Node: %s has data: %s, version: %d',fullPath,data ? data.toString() : undefined,stat.version );
       }
   );

  }

}


module.exports = server.connect

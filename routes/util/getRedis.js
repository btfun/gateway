var Redis = require("ioredis");
var conf = require("../../conf/index");
var redisObj=conf.redis||{};


var authRedis = new Redis(redisObj.client1.port, redisObj.client1.host, { password: redisObj.client1.password });
var authRedis2 = new Redis(redisObj.client2.port, redisObj.client2.host, { password: redisObj.client2.password });
//
//
authRedis.on('error', function (err) {
    console.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,' redis concat Error :'+err);
});

authRedis.on('end', function (err) {
    logger.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,' redis concat Error :'+err);
    authRedis=authRedis2;
    emailUtil.sendMail({
        subject : "saas.web 连接redis发生错误 正切换到 "+host2+" [App Server Error]",
        text    : err.message + "\n" + err.stack + "\n" + err.toString()
    });
});

authRedis2.on('error', function (err) {
    console.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,' redis concat Error :'+err);
});

authRedis2.on('end', function (err) {
    console.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,' redis concat Error :'+err);
    authRedis2=authRedis;
    emailUtil.sendMail({
        subject : "saas.web 连接redis发生错误 正切换到 "+host+" [App Server Error]",
        text    : err.message + "\n" + err.stack + "\n" + err.toString()
    });
});







module.exports =authRedis;

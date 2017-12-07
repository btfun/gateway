var authRedis = require("./getRedis");

//硬编码
var LOGIN_AUTH_INFO='s:login_auth:{{token}}';


function getAccessToken(accessToken,fun){
    // var accessToken=req.cookies.access_token;
    if(accessToken && authRedis){
        var token=LOGIN_AUTH_INFO.replace('{{token}}',accessToken);
        authRedis.get(token, function(err, object) {
            if(err){
                console.error(process.pid,'redis query error:',err);
            }
            fun(err,object);
        });
    }else{
        if(!authRedis){

            console.error(process.pid,'redis is not contact');
            console.info(process.pid,'redis is not contact');
            fun('redis is not contact');
        }else{
            fun('accessToken is not exist');
        }
    }
}

module.exports = getAccessToken;

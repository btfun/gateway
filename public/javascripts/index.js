
var     param={
      // type: 'parallel', // parallel 并行； sequence 依次 JSON.stringify
      api: ([
        {
          url:'http://saas.mljiadev.cn/customer/level/name/list',
          type:'get',
          data:{
            shop_sid: 1182,
            access_token:'0dd90f2ed605620041b8a84d420ab3b9'
          },
          cb:function(res){
            console.log(res)
          }
        },
        {
          url:'http://saas.mljiadev.cn/customer/level/name/list',
          type:'get',
          data:{
            shop_sid: 1182,
            access_token:'0dd90f2ed605620041b8a84d420ab3b9'
          },
          cb:function(res){
            console.log(res)
          }
        },
        //顺次依赖请求
        [
          {
            url:'http://saas.mljiadev.cn/customer/level/name/list',
            type:'get',
            data:{
              shop_sid: 1182,
              access_token:'0dd90f2ed605620041b8a84d420ab3b9'
            },
            cb(res){
              console.log(res)
            }
          },{
            url:'http://saas.mljiadev.cn/customer/level/name/list',
            type:'get',
            data:{
              shop_sid: 1182,
              access_token:'0dd90f2ed605620041b8a84d420ab3b9'
            },
            cb(res){
              console.log(res)
            }
          }
        ]

      ])

    }


new Vue({
  el:'#app',
  data:{
    name:'小明',
    param: param,
    goods: 'test',
    result: [],
  },
  created(){
    console.log('出来浪')

var that=this;
    // that.getXhr();
    that.getPipeXhr();
    setTimeout(()=>{
      that.getPipeXhr();
    },20)
    setTimeout(()=>{
      that.getPipeXhr();
    },50)
    setTimeout(()=>{
      that.getPipeXhr();
    },80)
    // this.postXhr();
  },
  watch:{
    result(msg){
        console.log('=====',msg)
    }
  },
  methods:{
    getPipeXhr(){
      var  master=[],result={};
      var uris=[{uri:'three'},{uri:'two'},{uri:'one'}]
/*
适用：
1 浏览器端get请求
2 页面加载需要N多个请求
3 a>b>c顺次依赖请求
思考：


*/
var url='http://192.168.2.247:3000/gateway/';
// url='http://192.168.2.247:3000/admin/pipe';
var that=this;
var received=0;
      this.ajax({
         url: url,       //请求地址
         type: "get",    //请求方式
         data: {
           send_type: 1, //0并行， 1快去快回   // parallel 并行； sequence 依次
           access_token:'a2842b57b433fe9252c3e564a416be6c',
           api: JSON.stringify([
             {
             url:'http://saas.mljiadev.cn/customer/level/name/list',
             data:{
               shop_sid: 1182
             },
             cb:function(res){
               console.log(res)
             }
           }
           ,{
             url:'http://saas.mljiadev.cn/material/massage/list',
             data:{
               shop_sid: 1182,
               page: 1
             },
             cb:function(res){
               console.log(res)
             }
           }
           ,{
             url:'http://saas.mljiadev.cn/material/massage/list',
             data:{
               access_token:'39cdb35baca57289c26faff74993707c',
               shop_sid: 1182,
               page: 2
             },
             cb:function(res){
               console.log(res)
             }
           }
         ])
         },    //请求参数
         dataType: "json",
         success: function (response, xml) {
           // 此处放成功后执行的代码
            console.log('-------',response)

          //  var strs=response.split('!@!');
          //  console.log('>>strs>',strs)
          //  strs.forEach((ite)=>{
          //    if(ite){
          //      var obj=JSON.parse(ite);
          //     //  that.result[obj.url]=obj
          //     var bool=that.result.some((item)=>{
          //       return item.url==obj.url;
          //     })
          //     if(!bool)that.result.push(obj)
          //    }
          //  })
           if(response){
             var obj=JSON.parse(response);
            //  that.result[obj.url]=obj
            var bool=that.result.some((item)=>{
              return item.url==obj.url;
            })
            if(!bool)that.result.push(obj)
           }

           console.log('>>result>',that.result)

         },
         error: function (status) {
           // 此处放失败后执行的代码
           console.log('>err>>',status)
         }
      })
    },
   getXhr(){
      var that=this;
      var url='http://192.168.2.247:3000/gateway/get/uer/info';
      //

      this.$http.get(url,{
        params: {
          send_type: 0, //0并行， 1快去快回   // parallel 并行； sequence 依次
          access_token:'a2842b57b433fe9252c3e564a416be6c',
        //   api: JSON.stringify([
        //     {
        //     url:'http://saas.mljiadev.cn/customer/level/name/list',
        //     data:{
        //       shop_sid: 1182
        //     },
        //     cb:function(res){
        //       console.log(res)
        //     }
        //   }
        //   ,{
        //     url:'http://saas.mljiadev.cn/material/massage/list',
        //     data:{
        //       shop_sid: 1182,
        //       page: 2
        //     },
        //     cb:function(res){
        //       console.log(res)
        //     }
        //   }
        //
        // ])
        }
      }).then(function(res){
        console.log('===get======',JSON.stringify(res.data,null,2) )
      })

    },
    postXhr(){
       var that=this;
       var url='/gateway/url/demo';
       //JSON.parse

      //  that.param

       console.log('==post=======',((param)),this.param )

       this.$http.post(url,that.param).then(function(res){
         console.log('==post=======',res.data)
       })

     },
    ajax(options) {
          options = options || {};
          options.type = (options.type || "GET").toUpperCase();
          options.dataType = options.dataType || "json";
          var params = formatParams(options.data);
          var xhr;

          //创建 - 第一步
          if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
          } else if(window.ActiveObject) {         //IE6及以下
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
          }

          //连接 和 发送 - 第二步
          if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
          } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
          }

           //接收 - 第三步
           var ins=0,received=0;
           xhr.onload=function(){
             console.log('>....end...=',xhr.responseText, xhr.responseXML)
           }
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 3 ||xhr.readyState == 4) {
              var status = xhr.status;
              if (status >= 200 && status < 300 || status == 304) {
                console.log('>ins=',ins++)
                var result=xhr.responseText.substring(received);
                received+=result.length;
                // ||xhr.responseText
                options.success && options.success(result, xhr.responseXML);
              } else {
                options.error && options.error(status);
              }
            }else{
                console.log('==onreadystatechange==',xhr.readyState,xhr.status)
            }
          }
      }



  }
})

        //格式化参数
        function formatParams(data) {
          var arr = [];
          for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
          }
          arr.push(("v=" + Math.random()).replace("."));
          return arr.join("&");
        }

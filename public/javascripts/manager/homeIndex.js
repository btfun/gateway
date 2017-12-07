
/*
 *  应用程序入口
 *  作者：battle
 */
define(function(require){
  'use strict'

  var Vue = require('vue'); 
  var VueRouter = require('vueRouter');
  var vueResource = require('vueResource');
  var shopRouterIndex = require('routerIndex');

  var ElementUI = require('ELEMENT');
  var globalUtil=require('globalUtil');
  var globalUri=require('globalUri');


 Vue.use(ElementUI);
 Vue.use(VueRouter);
 Vue.use(vueResource);

 /**********全局组件加载 start*****************/
 // require('homeTopComponent');//加载页面顶部组件
 // require('homeMenuComponent');//加载菜单栏组件
 // require('homeFooterComponent');//加载页面尾部组件
/**********全局组件加载 end*****************/

 /**
  * 二: 应用全局路由顶级模块入口
  *
  **/
const routers = new VueRouter({
      mode:'hash',
      routes: shopRouterIndex
 });

let loadingInstance;
 //路由拦截器
 routers.beforeEach((to, from, next) => {
   console.log('当前路径：',to.path)

  //  loadingInstance = ElementUI.Loading.service({ target: '#content_panel'});

   next()
 });

 // routers.afterEach((route) => {
 //   loadingInstance.close();
 //   setTimeout(()=>{
 //     loadingInstance.close();
 //   },20)
 // })


 /**
  * 三: 应用全局的XHR请求配置
  *
  **/


  var tenantId;
  Vue.http.options.emulateJSON = true;
  // Vue.http.options.emulateHTTP = true;
  Vue.http.interceptors.push((request, next) => {
      // 请求发送前的处理逻辑
      //工作机token处理

      // var fxToken=sessionStorage.getItem('fx_token')||'',
      //     accessToken=globalUtil.util.getCookie('access_token');
      //
      // request.params.access_token=fxToken||accessToken;//增加token参数
      //
      // if(request.url)request.url=request.url.replace('{user_id}',globalUtil.util.getCookie('user_code'));//用户id
      // if(request.url && tenantId)request.url=request.url.replace('{tenant_id}',tenantId);//用户id
      // if(!request.params.tenant_id && tenantId)request.params.tenant_id=tenantId;

      // request.headers.set('Authorization', 'Bearer TOKEN');
        var timeout=setTimeout(()=>{
          request.abort();//打断请求
          next(request.respondWith(request.body, {
               status: 408,
               statusText: '请求超时或链接异常'
          }));
        }, Number(request.timeout||0)||2000);
      next((response) => {
          clearTimeout(timeout);
          return response;
      })
  });


console.log('tenantId',tenantId)



  Vue.config.devtools = false;
  // Vue.config.errorHandler = function (err, vm) {
  //   // 错误拦截器
  // }


 /**
  *  end:挂载实例
  *
  **/

 const app = new Vue({
   router: routers
 }).$mount('#app');


});

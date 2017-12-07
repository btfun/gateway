define(function(require){
'use strict'

 /* 模块主路由
  * 应用主路由文件
  *
  *
  */

   const routes = [
    //  { path:'', redirect:'home/shop/setting' },
     //主体部分

     { path: '/',           component: resolve => require(['home.indexModule'],resolve)},
    //  { path: '/home',       component: resolve => require(['home.indexModule'],resolve),
    //       children: [
    //         { path:'', redirect:'shop/setting' },
    //         { path: 'index',            component: resolve => require(['home.child.shopModule'],resolve) },
     //
    //       ]
    //  },
    //  { path: '/finance',           component: resolve => require(['home.saas.indexModule'],resolve) }

   ]

   return routes;

});

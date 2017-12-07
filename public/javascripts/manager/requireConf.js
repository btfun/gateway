(function(factory,win,fn){
  fn(factory(),win);
})(function(){
'use strict';

 return {
   //////////////////lib//////////////////////
   text:        'javascripts/lib/requireJS/requireJS-text',
   vue:         'javascripts/lib/vue/vue',
   vueRouter:   'javascripts/lib/vue/vue-router/vue-router',
   vueResource: 'javascripts/lib/vue/vue-resource/vue-resource',
   axios:       'javascripts/lib/vue/axios.min',
   vuex:        'javascripts/lib/vue/vuex/vuex',
   ELEMENT:     'javascripts/lib/element/element.min',
   echarts:     'javascripts/lib/echarts.common.min',

   //base
   globalUri:   'javascripts/base/globalUri',
   globalUtil:  'javascripts/base/globalUtil',
   //////////////////主入口/////////////////////
   homeIndex:   'javascripts/manager/homeIndex',
   routerIndex: 'javascripts/manager/homeRouter',
   //////////////////公用组件///////////////////
   homeTopComponent: 'components/global/layout/home-top/topComponent',
   homeTopTmpl:      'components/global/layout/home-top/topHtml',

   home: {
     //主页
    indexModule: 'components/manager/home/indexModule',
    indexTmpl:   'components/manager/home/indexHtml'

   }

   },



 };


},this||window,function(pathMods,win){
  'use strict';
  //pathMods 层级对象抹平，最多支持三级对象属性
  var path={};
  for(let attr in pathMods){
    if(typeof pathMods[attr]==='string'){
      path[attr]=pathMods[attr];
    }else if(typeof pathMods[attr]==='object'){
        for(let att in pathMods[attr]){
            if(typeof pathMods[attr][att]==='object' ){
                  for(let at in pathMods[attr][att]){
                    path[attr+'.'+att+'.'+at]=pathMods[attr][att][at];
                    if(typeof pathMods[attr][att][at]==='object')return alert('警告require配置对象不能有三级对象属性');
                  }
            }else{
              path[attr+'.'+att]=pathMods[attr][att];
            }
        }
    }
  }

  if(typeof define !== 'undefined' && define.amd){
     //浏览器
     win.requirejs.config({
       baseUrl:  GLOBAL.resourcesUrl||'/',
       urlArgs: GLOBAL.version,
       paths: path
     });
     win.require(['homeIndex']);//这里的不能被替换MD5后缀
   }else if(typeof module !== 'undefined' && module.exports){
     //node环境
     module.exports=path;
   }




  win.logPath=function(pwd,conf){
      if(pwd!==123456)return;
      for(var ins in path){
        if(conf){
          if(ins.indexOf(conf)>-1)console.log(ins,':',path[ins]);
        }else{
          console.log(ins,':',path[ins]);
        }
      }
    }
});

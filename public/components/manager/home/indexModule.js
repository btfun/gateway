define(function(require){
  'use strict'
  // var globalUtil=require('globalUtil');
  var that;

  return  {
      template: require('text!home.indexTmpl.html'),
      data:function(){
        return {
          activeRouter: localStorage.getItem('activeRouter')||'1'
        }
      },
      created:function(){
        that=this;
      },
      methods:{

      }
    }


});

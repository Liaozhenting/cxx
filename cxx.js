;(function (global, factory) {
  "use strict";
  //commonJS,Node.js是commonJS规范.
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports =       
    //Node.js也能使用
    factory(global,true)

   /***没有document就不用的针对浏览器使用情况***/
    // global.document ?
    // factory(global, true) :
    // function (w) {
    //   if (!w.document) {
    //     throw new Error("cxx requires a window with a document");
    //   }
    //   return factory(w);
    // };
  } else {
    factory(global);
  }

  //noGlobla is boolean
})(typeof window !== 'undefined' ? window : global, function (window, noGlobal) {
  var push = Array.prototype.push;
  var slice = Array.prototype.slice;

  var cxx = function (html) {
    return new cxx.fn.init(html)
  }
  cxx.fn = cxx.prototype = {
    selector: "",
    type: 'cxx',
    constructor: cxx,
    length: 0,
    init: function (html) {

    }
  }

  cxx.extend = cxx.fn.extend = function (obj) {
    for (var k in obj) {
      this[k] = obj[k];
    }
  }

  cxx.fn.init.prototype = cxx.fn;


  //判断
  cxx.extend({
    isString: function (str) {
      return (typeof str === "string");
    },
    isFuncton: function (func) {
      return (typeof func === "function");
    },
    isDOM: function (dom) {
      return !!(dom.nodeType);
    },
    isObeject: function (obj) {
      return (typeof obj === "object");
    }
  })

  //浏览器的一些方法,兼容相关
  cxx.extend({
    getStyle:function(obj,attr){
      if(window.getComputedStyle){
        //read only
        return window.getComputedStyle(obj)[attr];
      } else{
        //IE
        return obj.currentStyle[attr];
      }
    },
    pageX:function(event){
      return event.pageX||event.clientX+document.documentElement.scrollLeft;
    },
    pageY:function(){
      return event.pageY || event.clientY +document.documentElement.scrollTop;
    }
  })
  //AMD
  if (typeof define === "function" && define.amd) {
    define("cxx", [], function () {
      return cxx;
    });
  }
  //普通插件
  if (!noGlobal) {
    window.cxx = window.C = cxx;
  }
  return cxx;
})
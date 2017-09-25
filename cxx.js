(function (global, factory) {
  "use strict";

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ?
      factory(global, true) :
      //Node.js就算没有document也能使用
      factory(global, true)

      
      /***没有document的情况***/
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
  if (typeof define === "function" && define.amd) {
    define("cxx", [], function () {
      return cxx;
    });
  }
  if (!noGlobal) {
    window.cxx = window.C = cxx;
  }
  return cxx;
})
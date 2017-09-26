; (function (global, factory) {
  "use strict";
  //commonJS,Node.js是commonJS规范.
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports =
      //Node.js也能使用
      factory(global, true)

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
  var parseHMTL = function (html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    var res = [];
    for (var i = 0; i < div.childNodes.length; i++) {
      res.push(div.childNodes[i]);
    }
    return res;
  }
  var cxx = function (html) {
    return new cxx.fn.init(html)
  }
  cxx.fn = cxx.prototype = {
    selector: "",
    type: 'cxx',
    constructor: cxx,
    length: 0,
    init: function (html) {
      this.events = {};
      if (html == null || html === '') {
        return;
      }

      if (typeof html === 'function') {
        var oldFn = window.onload;

        if (typeof oldFn === 'function') {
          window.onload = function () {
            oldFn();
            html();
          }
        }
        else {
          window.onload = html;
        }
      }
      if (cxx.isString(html)) {
        if (/^</.test(html)) {
          push.apply(this, parseHMTL(html));
        }
        else {
          push.apply(this, cxx.select(html));
          this.selector = html;
        }
      }

      if (html.type === 'cxx') {
        push.apply(this, html);
        this.selector = html.selector;
        //把参数html的events属性赋值给当前的this
        this.events = html.events;
      }
      //dom对象,这里转成cxx对象
      if (html.nodeType) {
        push.apply(this, [html])
      }
    }
  }

  cxx.extend = cxx.fn.extend = function (obj) {
    for (var k in obj) {
      this[k] = obj[k];
    }
  }

  cxx.fn.init.prototype = cxx.fn;


  //工具方法
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
    getStyle: function (obj, attr) {
      if (window.getComputedStyle) {
        //read only
        return window.getComputedStyle(obj)[attr];
      } else {
        //IE
        return obj.currentStyle[attr];
      }
    },
    pageX: function (event) {
      return event.pageX || event.clientX + document.documentElement.scrollLeft;
    },
    pageY: function () {
      return event.pageY || event.clientY + document.documentElement.scrollTop;
    }
  })

  //实例对象方法,用于dom
  cxx.fn.extend({
    toArray: function () {
      return slice.call(this, 0)
    },
    get: function (index) {
      if (index === undefined) {
        return this.toArray()
      }

      return this[index];
    },
    eq: function (index) {
      var dom;
      if (index >= 0) {
        dom = this.get(index)
      }
      else {
        dom = this.get(this.length + index);
      }

      return cxx(dom);
    },
    each: function (func) {
      return cxx.each(this, func)
    },
    map: function (func) {
      return cxx.map(this, func);
    }
  })
  //静态方法写在后面,改写了each,map.因为cxx.fn.extend 就是 cxx.extend
  cxx.extend({
    each: function (arr, func) {
      var i;
      if (Array.isArray(arr) || arr.length >= 0) {
        for (i = 0; i < arr.length; i++) {
          //跟es6 each的参数顺序一致
          func.call(arr[i], arr[i], i);
        }
      }
      else {
        for (i in arr) {
          func.call(arr[i], arr[i], i);
        }
      }
      return arr;
    },
    map: function (arr, func) {
      var i, res = [], tmp;
      if (Array.isArray(arr) || arr.length >= 0) {
        for (i = 0; i < arr.length; i++) {
          tmp = func(arr[i], i);
          if (tmp != null) {
            res.push(tmp);
          }
        }
      }
      else {
        for (i in arr) {
          tmp = func(arr[i], i);
          if (tmp != null) {
            res.push(tmp);
          }
        }
      }
      return res;
    }
  })

  //dom操作



  //兼容AMD
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
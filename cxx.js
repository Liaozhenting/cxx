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
  cxx.fn.extend({
    appendTo: function (dom) {
      var targetObj = cxx(dom);
      var newObj = cxx();
      for (var i = 0; i < this.length; i++) {
        for (var j = 0; j < targetObj.length; j++) {
          var temp = (j == targetObj.length - 1 ? this[i] : this[i].cloneNode(true));

          target[j].appendChild(temp);
          push.call(newObj, temp);
        }
      }
      return newObj;
    },
    append: function (dom) {
      cxx(dom).appendTo(this);
      return this;
    },
    prependTo: function (dom) {
      var targetObj = cxx(dom);
      var newObj = cxx();
      for (var i = 0; i < this.length; i++) {
        for (var j = 0; j < target.length; j++) {
          var temp = (j === target.length - 1 ? this[i] : this[i].cloneNode(true));
          var firstChild = targetObj[j].firstChild;
          targetObj[j].insertBefore(temp, firstChild);
          push.call(newObj, temp)
        }
      }
      return newObj;
    },
    prepend: function (dom) {
      cxx(dom).prependTo(this);
      return this;
    }
  })

  //选择器引擎
  var select = (function () {
    var rnative = /\{\s*\[native/;
    var rBaseSeletor = /^(?:\#([\w\-]+)|\.([\w\-]+)|(\*)|(\w+))$/;
    var rtrim = /^\s+|\s+$/g
    var support = {};
    //方法定义检测
    support.qsa = rnative.test(document.querySelectorAll + '');
    support.getElementsByClassName = rnative.test(document.getElementsByClassName + '');
    support.trim = rnative.test("".trim + '');
    support.indexOf = rnative.test(Array.prototype.indexOf + '');
    //support.qsa = false;




    //兼容的getElementsByClassName方法
    function getByClassName(className, node) {
      node = node || document;
      var allElem, res = [], i;

      if (support.getElementsByClassName) {
        var result = document.getElementsByClassName(className);
        push.apply(res, result);
        return res;
      }
      else {
        allElem = document.getElementsByTagName("*");
        for (i = 0; i < allElem.length; i++) {
          if ((" " + allElem[i].className + " ").indexOf(" " + className + " ") >= 0) {
            push(allElem[i]);
          }
        }
        return res;
      }
    }



    //函数myTrim，去除掉str前后的空格，并返回str
    //str :  "  hello   "  =>  myTrim(str)   =>  "hello"
    function myTrim(str) {
      //如果系统支持trim方法，就使用trim方法去除掉字符串前后的空格
      if (support.trim) {
        return str.trim();
      }
      //如果系统不支持trim方法，那就使用正则将字符串前后的空格替换为''
      else {
        return str.replace(rtrim, '');
      }
    }
    //实现兼容的indexOf方法，因为ie6,7,8不支持数组的indexOf方法
    //返回对应元素的下标  
    //array : [1,2,3,4]  ,search: 3
    //myIndexOf(array,search)   =>  在array数组中查找search元素，并返回search所在的下标
    //返回的下标就是2.  如果没有找到元素就会返回-1
    function myIndexOf(array, search, startIndex) {
      startIndex = startIndex || 0;
      //如果系统支持indexOf方法
      if (support.indexOf) {
        return array.indexOf(search, startIndex);
      }
      else {	//自己实现indexOf方法
        for (var i = startIndex; i < array.length; i++) {
          //如果循环的第i个元素和要查找的search元素一致
          if (array[i] === search) {	//返回该元素的下标
            return i;
          }
        }
        //如果循环完毕没有找到一致的元素，就返回-1表示没有找到一致的元素
        return -1;
      }
    }
    //元素去重函数：去除掉参数array数组中的重复元素
    //array : [1,2,3,3,4,5,1]  =>  unique(array)  =>  array:[1,2,3,4,5];
    function unique(array) {	//定义一个空数组
      var resArray = [];
      //循环array中的所有元素
      for (var i = 0; i < array.length; i++) {	//判断resArray数组中是否包含了array[i]元素，如果没有包含
        if (myIndexOf(resArray, array[i]) == -1) {	//就把这个元素添加到resArray数组中来。
          resArray.push(array[i]);
        }
      }
      //返回去重后的数组
      return resArray;
    }


    //选择器函数select，通过该函数可以选择页面中的某些元素
    //参数解释：selector 传递选择器字符串  。  results  传入一个数组，将查询到的元素加入该数组
    //如何调用select函数：  
    /*
        select("#dv");  select(".cc");  select("*");  select("div");
        select("#dv,  .cc ,  div");
    */

    //在node节点中查找选择器字符串为selector的内容
    //document 找 selector是#dv的元素
    function basicSelect(selector, node) {
      var results = [];

      var m = rBaseSeletor.exec(selector);
      if (m) {
        if (m[1]) {
          var temp = document.getElementById(m[1]);
          if (temp) {
            results.push(temp);
          }
        }
        else if (m[2]) {
          push.apply(results, getByClassName(m[2], node));
        }
        else if (m[3] || m[4]) {
          push.apply(results, node.getElementsByTagName(selector));
        }
      }

      //返回包含了元素的数组
      return unique(results);
    }
    //获得后代选择器选择的元素
    function select2(selector, results) {
      results = results || [];
      //进来的selector是'div      div'=>把多个空格换成一个空格
      selectors.replace(/\s+/g, " ");
      //假定selectors => ['div','div']
      var selectors = selector.split(' ');

      //arr存的是所有的div
      var arr = [], node = [document];
      //循环空格分隔出来的选择器字符串
      for (var j = 0; j < selectors.length; j++) {
        for (var i = 0; i < node.length; i++) {
          //basicSelect(selectors[0], node[i] )：在document中寻找所有的div元素
          //把这些元素添加到arr数组中
          push.apply(arr, basicSelect(selectors[j], node[i]));
        }
        node = arr; //arr里有所有的div，  node里也有所有的div
        arr = []; //arr里面什么都没有了，  
      }
      push.apply(results, node);

      return results;
    }
    //select函数是选择器引擎，入口函数,用户调用select函数来获得对应的元素
    //select('div');  select("#dv");  select(".cc"); select("*");
    //select("div,#dv,.cc"); 组合选择器
    //select('div div,div p,div p .c');
    function select(selector, results) {
      results = results || [];
      if (typeof selector != 'string') {
        return results;
      }
      //如果系统支持qsa，就使用qsa获得元素
      if (support.qsa) {
        push.apply(results, document.querySelectorAll(selector));
        return results;
      }
      else//否则自己实现
      {
        //按照逗号分隔选择器字符串 select('div div,div p,div p .c','span');
        //=>['div div','div p','div p .c','span']
        var selectors = selector.split(",");
        //循环所有的选择器字符串
        for (var i = 0; i < selectors.length; i++) {	//对循环的那一个字符串去除前后空格
          var subSelector = myTrim(selectors[i]);
          //用正则表达式匹配选择器字符串，
          //如果匹配成功代表肯定是id选择器，类选择器，*，标签名其中一种
          if (rBaseSeletor.test(subSelector)) {
            push.apply(results, basicSelect(subSelector, document));
          }
          //如果匹配不成功，表示不是基本选择器的四种形式，应该就是后代选择器
          else {	//使用select2函数获得后代选择器的元素
            results = select2(subSelector, results);
          }
        }
      }
      //返回去重复了的元素数组
      return unique(results);
    }

    //返回select函数作为沙箱的结果
    return select;


  })();

  cxx.select = select;



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
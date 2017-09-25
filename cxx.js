(function (window) {
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

    window.cxx = window.C = cxx;

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
})(window)
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        require(['nesting/define'], factory);
    } else if (typeof exports === 'object') {
        factory(require('./nesting/define')); 
    } else {
        factory(root.nesting.define);
    }
})(this, function(define) {

    define(this, 'nesting', ['nesting/parser'], function(require, exports) {
        exports.parse = require('nesting/parser').Parser;
    });

});
/*!
 * Nesting.js v1.0.0
 * Copyright (c) 2013 Nathaniel Higgins; Licensed MIT
 * Built on 2013-07-24 
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory((root.nesting = {}));
    }
}(this, function (exports) {

    exports.parse = function() {

    };

}));
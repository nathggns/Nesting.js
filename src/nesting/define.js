(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('nesting/define', [], function() {
            var o = {};
            factory(o, 'define');

            return o.define;
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(module, 'exports');
    } else {
        // Browser globals
        // 
        if (typeof root.nesting === 'undefined') {
            root.nesting = {};
        }

        factory(root.nesting, 'define');
    }
}(this, function (exports, key) {

    var define = function(root, name, dependencies, factory) {

        var parent = (typeof module === 'object' && ((module.children && module.children[module.children.length - 1]) || module.parent)) || false;

        if (typeof root.define === 'function' && root.define.amd) {
            root.define(name, ['require', 'exports'].concat(dependencies), factory);
        } else if (parent) {

            factory(function(name) {
                var module;

                try {
                    module = require(name);
                } catch (e) {
                    try {
                        module = require('../' + name);
                    } catch (f) {
                        module = require('./' + name);
                    }
                }

                return module;
            }, parent.exports);
        } else {
            // Browser
            var parts = name.split('/');
            var obj = root;

            for (var i = 0, l = parts.length; i < l; i++) {
                var part = parts[i];

                if (i > 0) {
                    if (typeof obj._modules !== 'object') {
                        obj._modules = {};
                    }

                    obj = obj._modules;
                }

                if (typeof obj[part] !== 'object') {
                    obj[part] = {};
                }

                obj = obj[part];
            }

            factory(function(name) {
                var parts = name.split('/');
                var obj = root;

                for (var i = 0, l = parts.length; i < l; i++) {
                    var part = parts[i];

                    if (i > 0) {
                        obj = obj._modules;
                    }

                    obj = obj[part];
                }

                return obj;
            }, obj);
        }
    };

    exports[key] = define;

}));
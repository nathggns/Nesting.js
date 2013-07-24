var overload = require('../index.js');
var should = require('should');

describe('nesting', function() {
    describe('parse', function() {
        it('should exist', function() {
            overload.should.have.property('parse');
        });
    });
});
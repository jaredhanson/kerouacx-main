/* global describe, it */

var expect = require('chai').expect;


describe('@kerouac/main', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have namespace metadata', function() {
      expect(json.namespace).to.equal('org.kerouacjs');
    });
    
    it('should have components metadata', function() {
      expect(json.components).to.have.length(1);
      expect(json.components).to.include('main');
    });
    
    it('should have directories metadata', function() {
      expect(json.directories).to.be.an('object');
      expect(json.directories.com).to.equal('com');
    });
  });
  
});

/* global describe, it */

var expect = require('chai').expect;


describe('@kerouac/main', function() {
  
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have component metadata', function() {
      expect(json.namespace).to.equal('org.kerouacjs');
      expect(json.components).to.have.length(1);
      expect(json.components).to.include('main');
    });
  });
  
});

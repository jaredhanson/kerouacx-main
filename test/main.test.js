/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../com/main');
var kerouac = require('kerouac');


describe('main', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/main');
  });
  
  describe('when app uses default site', function(done) {
    var site = sinon.stub(kerouac());
    site.generate.yields(null);
    
    var error = new Error('something went wrong');
    error.code = 'IMPLEMENTATION_NOT_FOUND';
    error.interface = 'app/site';
    
    var container = new Object();
    container.create = sinon.stub();
    container.create.withArgs('app/site').rejects(error)
    container.create.withArgs('./site').resolves(site);
    
    before(function(done) {
      factory(container).then(done, done);
    });
    
    it('should create site', function() {
      expect(container.create).to.be.calledTwice;
      expect(container.create.getCall(0)).to.be.calledWith('app/site');
      expect(container.create.getCall(1)).to.be.calledWith('./site');
    });
    
    it('should generate site', function() {
      expect(site.generate).to.be.called;
    });
  }); // when app uses default site
  
  describe('when app provides app-specific site', function(done) {
    var site = sinon.stub(kerouac());
    site.generate.yields(null);
    
    var container = new Object();
    container.create = sinon.stub().resolves(site);
    
    before(function(done) {
      factory(container).then(done, done);
    });
    
    it('should create site', function() {
      expect(container.create).to.be.calledOnce;
      expect(container.create).to.be.calledWith('app/site');
    });
    
    it('should generate site', function() {
      expect(site.generate).to.be.called;
    });
  }); // when app provides app-specific site
  
});

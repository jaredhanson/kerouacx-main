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
    
    var logger = new Object();
    logger.info = sinon.spy();
    
    before(function(done) {
      factory(container, logger).then(done, done);
    });
    
    it('should create site', function() {
      expect(container.create).to.be.calledTwice;
      expect(container.create.getCall(0)).to.be.calledWith('app/site');
      expect(container.create.getCall(1)).to.be.calledWith('./site');
    });
    
    it('should generate site', function() {
      expect(site.generate).to.be.calledOnce;
    });
  }); // when app uses default site
  
  describe('when app provides app-specific site', function(done) {
    var site = sinon.stub(kerouac());
    site.generate.yields(null);
    
    var container = new Object();
    container.create = sinon.stub().resolves(site);
    
    var logger = new Object();
    logger.info = sinon.spy();
    
    before(function(done) {
      factory(container, logger).then(done, done);
    });
    
    it('should create site', function() {
      expect(container.create).to.be.calledOnce;
      expect(container.create).to.be.calledWith('app/site');
    });
    
    it('should generate site', function() {
      expect(site.generate).to.be.called;
    });
  }); // when app provides app-specific site
  
  describe('when app provides app-specific site that fails to be created', function(done) {
    var site = sinon.stub(kerouac());
    site.generate.yields(null);
    
    var container = new Object();
    container.create = sinon.stub().rejects(new Error('something went wrong'));
    
    var logger = new Object();
    logger.info = sinon.spy();
    
    var error;
    
    before(function(done) {
      factory(container, logger).then(
        function() {
          return done(new Error('should not create site'));
        },
        function(err) {
          error = err;
          return done();
        });
    });
    
    it('should attempt to create site', function() {
      expect(container.create).to.be.calledOnce;
      expect(container.create).to.be.calledWith('app/site');
    });
    
    it('should not generate site', function() {
      expect(site.generate).to.not.be.called;
    });
    
    it('should rethrow error', function() {
      expect(error.message).to.equal('something went wrong');
    });
  }); // when app provides app-specific site that fails to be created
  
  describe('when site generation fails', function(done) {
    var site = sinon.stub(kerouac());
    site.generate.yieldsAsync(new Error('Something went wrong'));
    
    var container = new Object();
    container.create = sinon.stub().resolves(site);
    
    var logger = new Object();
    logger.error = sinon.spy();
    
    before(function(done) {
      factory(container, logger).then(done, done);
    });
    
    it('should create site', function() {
      expect(container.create).to.be.calledOnce;
      expect(container.create).to.be.calledWith('app/site');
    });
    
    it('should generate site', function() {
      expect(site.generate).to.be.called;
    });
    
    it('should log messages', function() {
      expect(logger.error).to.be.called;
      expect(logger.error.getCall(0)).to.be.calledWith('Something went wrong');
    });
  }); // when site generation fails
  
  describe('when site generation fails with code', function(done) {
    var site = sinon.stub(kerouac());
    var error = new Error('Something went wrong');
    error.code = 'SOMETHING_WENT_WRONG';
    site.generate.yieldsAsync(error);
    
    var container = new Object();
    container.create = sinon.stub().resolves(site);
    
    var logger = new Object();
    logger.error = sinon.spy();
    
    before(function(done) {
      factory(container, logger).then(done, done);
    });
    
    it('should create site', function() {
      expect(container.create).to.be.calledOnce;
      expect(container.create).to.be.calledWith('app/site');
    });
    
    it('should generate site', function() {
      expect(site.generate).to.be.called;
    });
    
    it('should log messages', function() {
      expect(logger.error).to.be.called;
      expect(logger.error.getCall(0)).to.be.calledWith('Something went wrong code=SOMETHING_WENT_WRONG');
    });
  }); // when site generation fails with code
  
});

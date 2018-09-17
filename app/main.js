exports = module.exports = function(IoC, logger) {
  
  return IoC.create('site')
    .catch(function(err) {
      console.log(err)
      
      // TODO: Check that the error is failure to create app/service
      return IoC.create('./site');
      throw err;
    })
    .then(function(site) {
      site.generate(function(err) {
        if (err) {
          console.error(err.message);
          console.error(err.stack);
          return;
        }
      });
    });
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.bixbyjs.org/Main';
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];

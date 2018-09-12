exports = module.exports = function(IoC, logger) {
  var kerouac = require('kerouac');
  
  
  var root = kerouac();
  
  return Promise.resolve(root)
    .then(function(root) {
      var components = IoC.components('http://i.kerouacjs.org/Site');
  
      return Promise.all(components.map(function(comp) { return comp.create(); } ))
        .then(function(sites) {
          sites.forEach(function(site, i) {
            var component = components[i]
              , path = component.a['@path'];
            
            logger.info('Loaded WWW site: ' + path);
            if (path) {
              root.use(path, site);
            } else {
              root.use(site);
            }
          });
        })
        .then(function() {
          return root;
        });
    })
    .then(function(site) {
      return site;
    });
};

exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];

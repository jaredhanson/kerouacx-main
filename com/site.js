exports = module.exports = function(IoC, settings, logger) {
  var kerouac = require('kerouac');
  
  
  var root = kerouac();
  // TODO: Load dynamically
  //root.engine('pug', require('pug'));
  root.set('base url', settings.get('site/baseURL'));
  root.set('layout engine', 'pug');
  root.locals.pretty = true;
  
  return Promise.resolve(root)
    .then(function(root) {
      var components = IoC.components('http://i.kerouacjs.org/Site');
  
      return Promise.all(components.map(function(component) { return component.create(); } ))
        .then(function(sites) {
          sites.forEach(function(site, i) {
            var component = components[i]
              , path = component.a['@path'];
            
            if (path) {
              logger.debug('Mounted WWW site "' + component.id + '" at "' + path + '"');
              root.use(path, site);
            } else {
              logger.debug('Mounted WWW site "' + component.id + '" at "/"');
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
  'http://i.bixbyjs.org/Settings',
  'http://i.bixbyjs.org/Logger'
];

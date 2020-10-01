/**
 * Main script.
 *
 * This component provides a main script that generates a site using the Kerouac
 * framework.
 *
 * This package provides a default site component which eliminates the
 * boilerplate typically used in most sites.  It is expected that most sites
 * will take advantage of this capability.  However, the main script will
 * preferrentially load an app-specific component, accomodating sites that need
 * to override the standard boilerplate.
 *
 * Once the site is created, static files will be generated.
 */
exports = module.exports = function(IoC, logger) {
  
  return IoC.create('app/site')
    .catch(function(err) {
      // No application-specific site component is provided.  Create the default
      // site component, which eliminates boilerplate in the application itself.
      if (err.code == 'IMPLEMENTATION_NOT_FOUND' && err.interface == 'app/site') {
        return IoC.create('./site');
      }
      
      throw err;
    })
    .then(function(site) {
      site.generate(function(err) {
        if (err) {
          logger.error(err.message);
          return;
        }
      });
    });
};

exports['@implements'] = 'http://i.bixbyjs.org/main';
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];

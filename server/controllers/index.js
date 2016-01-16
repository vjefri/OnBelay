//it drops all the files of /api folders into here
var apiRoutes = require('./api');

exports.climbOn = function(app) {
  app.use('/api', apiRoutes);
};
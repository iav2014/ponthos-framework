var logger = require('../logger/logger').logger(__filename);
var mongoConnector = require('../connectors/mongodb_connector');
var config = require('../../config/config');
function mongodbLoader(callback) {
  var mC = new mongoConnector(logger,
		config.nosql.database_policy.retry,
		config.nosql.test2);
  mC.init(function (err) {
    if (err){
			logger.info(config.nosql.fail + JSON.stringify(config.nosql.test2));
			callback(err);
    }
    else{
      logger.info(config.nosql.ok + JSON.stringify(config.nosql.test2));
      callback();
    }

  });
}
module.exports.mongodbLoader = mongodbLoader;
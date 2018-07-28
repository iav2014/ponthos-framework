let logger = require('../logger/logger').logger(__filename);
let mongoConnector = require('../connectors/mongodb_connector');
let config = require('../../config/config');

let mongodbLoader = (callback) => {
	var mC = new mongoConnector(logger,
		config.nosql.database_policy.retry,
		config.nosql.test);
	mC.init((err) => {
		if (err) {
			logger.error(config.nosql.fail + JSON.stringify(config.nosql.test));
			callback(err);
		}
		else {
			logger.info(config.nosql.ok + JSON.stringify(config.nosql.test));
			callback();
		}
		
	});
	//callback();
};

module.exports.mongodbLoader = mongodbLoader;
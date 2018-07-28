let logger = require('../logger/logger').logger(__filename);
let mongoConnector = require('../connectors/mongodb_connector');
let config = require('../../config/config');
let mongodbLoader = (callback) => {
	let mC = new mongoConnector(logger,
		config.nosql.database_policy.retry,
		config.nosql.test2);
	mC.init((err) => {
		if (err) {
			logger.info(config.nosql.fail + JSON.stringify(config.nosql.test2));
			callback(err);
		}
		else {
			logger.info(config.nosql.ok + JSON.stringify(config.nosql.test2));
			callback();
		}
		
	});
}
module.exports.mongodbLoader = mongodbLoader;
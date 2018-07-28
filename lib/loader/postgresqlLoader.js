let logger = require('../logger/logger').logger(__filename);
let config = require('../../config/config');
let postgreConnector = require('../connectors/postgreSQL_connector');

let postgresqlLoader = (callback) => {
	postgreConnector(config.sql.postgres, (err, result) => {
		if (err) {
			logger.error(err);
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}
module.exports.postgresqlLoader = postgresqlLoader;
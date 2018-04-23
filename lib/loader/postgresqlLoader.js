var logger = require('../logger/logger').logger(__filename);
var config = require('../../config/config');
var postgreConnector = require('../connectors/postgreSQL_connector');

function postgresqlLoader(callback) {
	postgreConnector(config.sql.postgres, function (err, result) {
		if (err) {
			logger.error(err);
			return callback(err);
		} else {
			return callback(null,result);
		}
	});
}
module.exports.postgresqlLoader = postgresqlLoader;
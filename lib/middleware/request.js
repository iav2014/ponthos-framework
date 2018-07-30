const moment = require('moment');
const logger = require('../logger/logger').logger(__filename);
const config = require('../../config/config');

function post (service) {
	return (req, res, next) => {
		const entryParams = {
			...req.body,
			logItem : req.logItem,
		};
		service.entry(entryParams, (err, result) => {
			const access = 'end';
			if (err) {
				const logJson = {
					...req.logItem,
					access,
					ts: moment().format(config.log.timeStampFormat),
					msg: JSON.stringify(err),
				};
				logger.error(JSON.stringify(logJson));
				res.sendStatus(err);
			} else {
				const logJson = {
					...req.logItem,
					access,
					ts: moment().format(config.log.timeStampFormat),
					response: JSON.stringify(result),
				};
				logger.debug(JSON.stringify(logJson));
				res.send(result);
			}
		});
	};
}

function get (service) {
	return (req, res, next) => {
		const entryParams = {
			...req.query,
			logItem : req.logItem,
		};
		service.entry(entryParams, (err, result) => {
			const access = 'end';
			if (err) {
				const logJson = {
					...req.logItem,
					access,
					ts: moment().format(config.log.timeStampFormat),
					msg: JSON.stringify(err),
				};
				logger.error(JSON.stringify(logJson));
				res.sendStatus(err);
			} else {
				const logJson = {
					...req.logItem,
					access,
					ts: moment().format(config.log.timeStampFormat),
					response: JSON.stringify(result),
				};
				logger.debug(JSON.stringify(logJson));
				res.send(result);
			}
		});
	};
}

module.exports.post = post;
module.exports.get = get;
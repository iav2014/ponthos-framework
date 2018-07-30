const moment = require('moment');
const mcache = require('memory-cache');
const config = require('../../config/config');
const logger = require('../logger/logger').logger(__filename);
const duration = config.cache.duration;

function post(service) {
	return (req, res, next) => {
		const url = req.originalUrl;
		const body = req.body;
		const key = '__express__' + JSON.stringify(body) + url;
		const cachedBody = mcache.get(key);
		if (cachedBody) {
			const access = 'end';
			const logJson = {
				...req.logItem,
				access,
				ts: moment().format(config.log.timeStampFormat),
				response: JSON.stringify(cachedBody),
			};
			logger.debug(logJson);
			res.send(cachedBody);
			return;
		} else {
			const entryParams = {
				...req.body,
				logItem: req.logItem,
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
					logger.error(logJson);
					res.send(logJson);
				} else {
					const logJson = {
						...req.logItem,
						access,
						ts: moment().format(config.log.timeStampFormat),
						response: JSON.stringify(result),
					};
					logger.debug(logJson);
					mcache.put(key, result, duration * 1000);
					res.send(result);
				}
			});
		}
	};
}

function get(service) {
	return (req, res, next) => {
		const url = req.originalUrl;
		const body = req.body;
		const key = '__express__' + JSON.stringify(body) + url;
		const cachedBody = mcache.get(key);
		if (cachedBody) {
			const access = 'end';
			const logJson = {
				...req.logItem,
				access,
				ts: moment().format(config.log.timeStampFormat),
				response: JSON.stringify(cachedBody),
			};
			logger.debug(logJson);
			res.send(cachedBody);
			return;
		} else {
			const entryParams = {
				...req.query,
				logItem: req.logItem,
			};
			console.log(req.query);
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
					console.error(err);
					res.sendStatus(err);
				} else {
					const logJson = {
						...req.logItem,
						access,
						ts: moment().format(config.log.timeStampFormat),
						response: JSON.stringify(result),
					};
					logger.debug(logJson);
					mcache.put(key, result, duration * 1000);
					res.sendStatus(result);
				}
			});
		}
	};
}

module.exports.post = post;
module.exports.get = get;
const uuid = require('uuid/v1');
const moment = require('moment');
const logger = require('../logger/logger').logger(__filename);
const config = require('../../config/config');

module.exports = (mod) => (req, res, next) => {
	const component = 'API';
	const msgId = uuid();
	const access = 'start';
	const module = mod;
	req.logItem = {
		component,
		msgId,
		module,
	};
	
	const logJson = {
		...req.logItem,
		access,
		ts: moment().format(config.log.timeStampFormat),
		request: JSON.stringify({
			url: req.originalUrl,
			body: req.body,
		}),
	};
	logger.debug(JSON.stringify(logJson));
	next();
};
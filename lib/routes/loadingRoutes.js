/* list of all routes */
let translatorRoute = require('./mobile/translator');
let pingRoute = require('./mobile/ping');
let mongoRoute = require('./mongo/mongo');
let redisRoute = require('./redis/redis');
let postgresRoute = require('./postgres/postgres');
let mysqlRoute = require('./mysql/mysql');

let register = (app) => {
	translatorRoute.registerRoutes(app);
	pingRoute.registerRoutes(app);
	// add your routes here ,,,,
	// mongo route example
	mongoRoute.registerRoutes(app);
	redisRoute.registerRoutes(app);
	postgresRoute.registerRoutes(app);
	mysqlRoute.registerRoutes(app);
};

module.exports.register = register;
/* list of all routes */
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../config/swagger.json');
const config = require('../../config/config');
const translatorRoute = require('./mobile/translator');
const pingRoute = require('./mobile/ping');
const mongoRoute = require('./mongo/mongo');
const redisRoute = require('./redis/redis');
const postgresRoute = require('./postgres/postgres');
const mysqlRoute = require('./mysql/mysql');

let register = (app) => {
	if (config.enviroment === 'dev') {
		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	}
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
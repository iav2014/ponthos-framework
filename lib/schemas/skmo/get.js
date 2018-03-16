var schema = {
	properties: {
		ip: {
			type: 'string',
			required: true,
			message: 'ip a.b.c.d  property is required'
		}
	}
}
module.exports.schema = schema;

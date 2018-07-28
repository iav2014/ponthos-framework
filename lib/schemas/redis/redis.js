let schema = {
	properties: {
		key: {
			type: 'string',
			required: true,
			message: 'key field  property is required'
		}
	}
}
module.exports.schema = schema;
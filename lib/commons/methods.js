/*
Here we are some commons methods ready to use by services,,,
validate register, check post params with the correct schema validator,,,
 */
let validator = require('../utils/validator');

let validateRegister = (register, schema, callback) => {
	let result = validator.validate(register, schema.schema);
	callback(result, register);
}
module.exports.validateRegister = validateRegister;

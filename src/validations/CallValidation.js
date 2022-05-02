const Joi = require('@hapi/joi')

//call validation
exports.CallValidation = Joi.object({
  phoneNumber: Joi.string().required().label('Phone Number')
});

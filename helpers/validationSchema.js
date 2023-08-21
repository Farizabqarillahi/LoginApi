//memvalidasi email dan password
const Joi = require('@hapi/joi')

const authSchema = Joi.object({
    email: Joi.string().lowercase().required()
        .email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),  //untuk parameter email

    password: Joi.string().required().min(8)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),                    //untuk parameter password

    repeat_password: Joi.string().min(8)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),                        //untuk konfirmasi password

    isAdmin: Joi.boolean().required()
})

module.exports = {authSchema}
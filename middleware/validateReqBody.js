const Joi = require("joi")

const validator = (schema)=>{(payload)=>{
    schema.validate(payload);
}}




const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password : Joi.string().min(6).max(10).required(),
    name: Joi.string().required(),
    phoneNumber: Joi.string().required()

})

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password : Joi.string().min(6).max(10).required(),
    

})

exports.signUpValidator = validator(signUpSchema)
exports.signUpValidator = validator(signUpSchema)
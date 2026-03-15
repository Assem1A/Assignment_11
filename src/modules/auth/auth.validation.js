
import Joi from 'joi';
export const loginSchema=Joi.object().keys({
    email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/)).required(),
})
export const signupSchema=loginSchema.append().keys({
    username:Joi.string().pattern(new RegExp(/^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/)).required(),
    confirmPassword:Joi.string().valid(Joi.ref("password")).required(),
    phone:Joi.string().pattern(new RegExp(/^(00201|\+201|01)(0|1|2|5)\d{8}$/)).required(),
    role:Joi.number().valid(0,1).required()
})
export const confirmEmailSchema=Joi.object().keys({
    email:Joi.string().email().required(),
otp:Joi.string().pattern(new RegExp(/^\d{6}$/)).required()
})
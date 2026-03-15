import Joi from "joi";
import { Types } from "mongoose";
import { fileFieldValidation } from "../../common/utils/multer.js";
export const validsss=Joi.object().keys({
    userID:Joi.string().custom((val)=>{
        return Types.ObjectId.isValid(val)?true:console.log("invalid id");
        
    }).required()
    }).required()
export const profileImage112={
    file:Joi.object().keys({
           fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid(...Object.values(fileFieldValidation.Image)).required(),
        finalPath:Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().required()
})
}
export const profileCoverImage={
    files:Joi.array().items(
        Joi.object().keys({
                    fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid(...Object.values(fileFieldValidation.Image)).required(),
        finalPath:Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().required()
        }).required()
    ).min(1).max(5).required()
}
export const updatePasswordValids=Joi.object().keys({
        password:Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/)).required(),
        newPassword:Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/)).required(),
        newPasswordConfirm:Joi.string().valid(Joi.ref("newPassword")).required()
})
export const forgetPasswordValids=Joi.object().keys({
        otp:Joi.required(),
        newPassword:Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/)).required(),
        newPasswordConfirm:Joi.string().valid(Joi.ref("newPassword")).required(),    email:Joi.string().email().required(),
        
})
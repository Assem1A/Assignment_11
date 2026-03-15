import { confirmEmailSchema, loginSchema, signupSchema } from "../modules/auth/auth.validation.js"
import {  forgetPasswordValids, profileCoverImage, profileImage112, updatePasswordValids, validsss } from "../modules/user/user.validation.js";

export const valid=(req,res,next)=>{
        const validation=signupSchema.validate(req.body,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   next()
}
export const validationElConfirm=(req,res,next)=>{
        const validation=confirmEmailSchema.validate(req.body,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   next()
}
export const valil=(req,res,next)=>{
        const validation=loginSchema.validate(req.body,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   next()
}
export const validss=(req,res,next)=>{
        const validation=validsss.validate(req.params.userID,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   next()
}
export const imageValiddssdfs=(req,res,next)=>{
       const validation=profileImage112.file.validate(req.file,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   console.log("done validationm elsora");
   next()
}
export const imageBeValid=(req,res,next)=>{
       const validation=profileCoverImage.files.validate(req.files,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   console.log("done validationm elsora");
   next()
}
export const updatePasswordValidation=(req,res,next)=>{
          const validation=updatePasswordValids.validate(req.body,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   console.log("done validationm elupdate");
   next()
}
export const forgetPasswordValidation=(req,res,next)=>{
          const validation=forgetPasswordValids.validate(req.body,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   console.log("done validationm elupdate");
   next()
}
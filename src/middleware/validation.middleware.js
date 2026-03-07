import { loginSchema, signupSchema } from "../modules/auth/auth.validation.js"
import {  profileCoverImage, profileImage112, validsss } from "../modules/user/user.validation.js";

export const valid=(req,res,next)=>{
        const validation=signupSchema.validate(req.body,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   console.log("done validationm");
   next()
}
export const valil=(req,res,next)=>{
        const validation=loginSchema.validate(req.body,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   console.log("done validationm");
   next()
}
export const validss=(req,res,next)=>{
        const validation=validsss.validate(req.params.userID,{abortEarly:false})
        if(validation.error){
            throw new 
Error("validation error", { cause: { status: 409 } })     
   }
   console.log("done validationm");
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
import { Router } from "express";
import { _2stepVerification, _2stepVerificationVerify, forgetPassword, forgetPassword2, logout, profile, profileCoverImage, profileImage, shareProfile, updatePassword } from "./user.service.js";
import { auth, authorization } from "../../middleware/auth.middleware.js";
import { forgetPasswordValidation, imageBeValid, imageValiddssdfs, updatePasswordValidation, validss } from "../../middleware/validation.middleware.js";
import { localFileUpload ,fileFieldValidation} from "../../common/utils/multer.js";
const router=Router()
router.post("/logout",auth,async (req,res,next)=>{
        console.log(req.body.flag);
        
        const status=await logout(req.body.flag,req.user,req.decoded)
        return res.status(200).json({message:"Profile" , status})

})  
router.post("/_2stepVerification",auth,async (req,res,next)=>{
        
        const status=await _2stepVerification(req.user.email)
        return res.status(200).json({message:"Profile" , status})

})  
router.post("/update-password",auth,updatePasswordValidation,async (req,res,next)=>{
        console.log(req.user);
        
        const status=await updatePassword(req.body.password,req.body.newPassword,req.user)
        return res.status(200).json({message:"password updated successfully" , status})

}) 
router.post("/forget-password",forgetPasswordValidation,async (req,res,next)=>{
        
        const status=await forgetPassword(`${req.body.otp}`,req.body.newPassword,req.body.email)
        return res.status(200).json({message:"password updated successfully" , status})

}) 
router.post("/forget-password-otp",async (req,res,next)=>{
        
        const status=await forgetPassword2(req.body.email)
        return res.status(200).json({message:"password updated successfully" , status})

}) 
router.post("/_2stepVerification-verify",auth,async (req,res,next)=>{
        
        const status=await _2stepVerificationVerify(req.body)
        return res.status(200).json({message:"Profile" , status})

})  
router.patch('/profile-image',auth,localFileUpload(fileFieldValidation.Image).single("avatar"),imageValiddssdfs,async(req,res,next)=>{
        const acc=await profileImage(req.file,req.user)
    return res.status(200).json({message:"Profile" , result:req.file,acc})

})
router.patch('/profile-cover-image',auth,localFileUpload(fileFieldValidation.Image).array("avatars"),imageBeValid,async(req,res,next)=>{
    
        const acc=await profileCoverImage(req.files,req.user)
    return res.status(200).json({message:"Profile" , acc})

})
router.get("/" ,auth,authorization([0]), async(req,res,next)=>{
    
    const result  =await profile(req.user.id)
    return res.status(200).json({message:"Profile" , result})
})
router.get("/share-profile/:userID" ,validss, async(req,res,next)=>{
    console.log(req.params.userID);
    
    const result  =await shareProfile(req.params.userID)
    return res.status(200).json({message:"Profile" , result})
})
export default router
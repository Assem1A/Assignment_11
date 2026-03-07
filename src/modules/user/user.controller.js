import { Router } from "express";
import { logout, profile, profileCoverImage, profileImage, shareProfile } from "./user.service.js";
import { auth, authorization } from "../../middleware/auth.middleware.js";
import { imageBeValid, imageValiddssdfs, validss } from "../../middleware/validation.middleware.js";
import { localFileUpload ,fileFieldValidation} from "../../common/utils/multer.js";
const router=Router()
router.post("/logout",auth,async (req,res,next)=>{
        const status=await logout(req.body,req.user,req.decoded)
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
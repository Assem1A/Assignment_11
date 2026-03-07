import multer from "multer";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { fileFilter1 } from "./validation.multer.js";
export const fileFieldValidation={
    Image: ['image/jpeg','image/jpg','image/png']
    ,video:['video/mp4']
}
export const localFileUpload = (   validations=[]
) => {
  let customPath="general"
  const uploadPath = resolve('../', "uploads"); 
    
    
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      file.finalPath=`uploads/${randomUUID()}_${file.originalname}`
      cb(null, `${randomUUID()}_${file.originalname}`)

}});


  return multer({ fileFilter:fileFilter1([...validations]),storage });
};
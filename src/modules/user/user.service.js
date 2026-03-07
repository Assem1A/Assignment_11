import {userModel, users} from '../../DB/model/index.js'
import { tokenModel } from '../../DB/model/token.model.js'
export const profile   = async(id)=>{
    const user = await userModel.findById(id)
    return user
}
export const shareProfile=async(userID)=>{
const acc = await userModel.findOne({ _id: userID }).select("-password");
    if(!acc)throw new Error("user not found", { cause: { status: 404 } })
    return acc
}
export const profileImage   = async(file,user)=>{
  user.profileImage =  file.finalPath;  
  
  await user.save();
  
  return user
}
export const profileCoverImage   = async(files,user)=>{
  user.profileCoverPic =  files.map(file=>file.finalPath );  
  
  await user.save();
  
  return user
}
export const logout   = async(flag,user,{jti,iat})=>{
  let status=200
  
  await user.save();
  switch(flag){
    case 1:
      user.CCT = new Date
  
  await user.save();
  await tokenModel.deleteMany({userID:user._id})
  break;
  default:
    await tokenModel.create({
      userID:user._id,
      jti,
      expiresIn:new Date((iat + 7 * 24 * 60 * 60) * 1000)

    })
    status=201
  }
  return status
}
import { compare, hash } from "bcrypt"
import { ProviderEnum } from "../../common/enum/provider/enum.js"
import { userModel } from "../../DB/model/index.js"
import { JWT_EXPIRES, JWT_SECRET, REFRESH_SECRET, SALT_ROUND } from "../../../config/config.service.js"
import jwt from 'jsonwebtoken'

export const signup = async (inputs) => {
const {email,password,username}=inputs
const user=await userModel.findOne({email})
const hashed=await hash(password,SALT_ROUND)
if(user)throw new Error("duplicated email",{cause:{status:409}})

const [addedUser]=await userModel.create([{username,password:hashed,email,provider:ProviderEnum.System}])

return addedUser
}
export const login = async (body) => {
    const {email,password}=body
    const user = await userModel.findOne({ email })
    if (!user) throw new Error("invalid email or password", { cause: { status: 404 } });
    const wrongPassword=!await compare(password,user.password)
    if(wrongPassword)throw new Error("invalid email or password", { cause: { status: 404 } });

    const token = jwt.sign(
        { id: user._id, email,email },
       JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
   const refreshToken = jwt.sign(
        { sub: user.id },
        REFRESH_SECRET,
        { expiresIn: "7d" }
    );
    return {user,token,refreshToken}
}
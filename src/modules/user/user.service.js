import { compare, hash } from 'bcrypt'
import { EMAIL_APP, SALT_ROUND } from '../../../config/config.service.js'
import { ProviderEnum } from '../../common/enum/provider/enum.js'
import { userModel, users } from '../../DB/model/index.js'
import { tokenModel } from '../../DB/model/token.model.js'
import { delete1, get1, keys, set } from '../../DB/redis/resis.service.js'
import { generateOtpAndSendEmail } from '../auth/auth.service.js'
export const profile = async (id) => {
  const user = await userModel.findById(id)
  return user
}
export const revokeTokenKey = (userID, jti) => {
  console.log(userID, jti);

  return `revokecToken::${userID}::${jti}`
}
export const shareProfile = async (userID) => {
  const acc = await userModel.findOne({ _id: userID }).select("-password");
  if (!acc) throw new Error("user not found", { cause: { status: 404 } })
  return acc
}
export const profileImage = async (file, user) => {
  user.profileImage = file.finalPath;

  await user.save();

  return user
}
export const profileCoverImage = async (files, user) => {
  user.profileCoverPic = files.map(file => file.finalPath);

  await user.save();

  return user
}
export const logout = async (flag, user, { jti, iat, id }) => {
  let status = 200
  // console.log({userID:id,jti});

  switch (flag) {
    case 1:
      user.CCT = new Date

      await user.save();
      console.log(await keys(`revokecToken::${id}`));
      console.log(221);

      await delete1(await keys(`revokecToken::${id}`))
      break;
    default:

      await set({
        key: revokeTokenKey(id, jti),
        val: jti,
        ttl: (iat + 7 * 24 * 60 * 60)
      })
      status = 201
  }
  return status
}
export const _2stepVerification = async (email) => {
  await generateOtpAndSendEmail(email)
  return true
}
export const _2stepVerificationVerify = async (inputs) => {
  const { email, otp } = inputs
  let user1 = await userModel.findOne({ email, provider: ProviderEnum.System })
  if (!user1) throw new Error("user not ffounds", { cause: { status: 409 } })
  console.log(inputs);

  const hasshedOTP = await get1(`OTP::User::${email}`)
  if (!hasshedOTP) {
    throw new Error("ma t2ool enta meen ya 3m", { cause: { status: 404 } })
  }
  if (!await compare(otp, hasshedOTP)) {
    throw new Error("ana mesh 3arf enta mesh 3ayz t2ol enta meen leeh", { cause: { status: 404 } })

  }
  user1._2stepVerification = new Date()
  await user1.save()
  await delete1(`OTP::User::${email}`)
  await delete1(`OTP::User::blocked::${email}`)
  await delete1(`otp:max:req:${email}`)
}
export const updatePassword = async (password, newPassword, user) => {

  const match = await compare(password, user.password)

  if (!match) {
    throw new Error("wrong password", { cause: { status: 401 } })
  }

  if (await compare(newPassword, user.password)) {
    throw new Error("new password must be different", { cause: { status: 400 } })
  }

  const hashedPassword = await hash(newPassword, SALT_ROUND)

  user.password = hashedPassword

  await user.save()

  return true
}
export const forgetPassword = async (otp, newPassword, email) => {

  const hashedOtp = await get1(`OTP::User::${email}`)

  if (!hashedOtp) {
    throw new Error("otp expired", { cause: { status: 404 } })
  }

  const match = await compare(otp, hashedOtp)

  if (!match) {
    throw new Error("wrong otp", { cause: { status: 401 } })
  }

  const user = await userModel.findOne({ email ,confirmEmail:{$exists:true},provider:ProviderEnum.System})

  if (!user) {
    throw new Error("user not found", { cause: { status: 404 } })
  }

  const hashedPassword = await hash(newPassword, SALT_ROUND)

  user.password = hashedPassword

  await user.save()

  await delete1(`OTP::User::${email}`)
  await delete1(`otp:max:req:${email}`)
  await delete1(`OTP::User::blocked::${email}`)

  return true
}
export const forgetPassword2 = async (email) => {
  generateOtpAndSendEmail(email)
  

  return true
}
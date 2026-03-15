import { compare, hash } from "bcrypt"
import { ProviderEnum } from "../../common/enum/provider/enum.js"
import { userModel } from "../../DB/model/index.js"
import { JWT_EXPIRES, JWT_SECRET, REFRESH_SECRET, SALT_ROUND } from "../../../config/config.service.js"
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library';
import { randomUUID } from 'node:crypto'
import { sendEmail } from "../../common/utils/sendEmail.js"
import { funcs } from "../../common/utils/emailTemplate.js"
import { createNumberOtp } from "../../common/utils/otp.js"
import { delete1, get1, inc, set, TTL, update } from "../../DB/redis/resis.service.js"
   export const generateOtpAndSendEmail = async (email) => {
    if (await TTL(`OTP::User::blocked::${email}`) > 0) {
        throw new Error("you are already blocked", { cause: { status: 409 } })
    }
    const cmo = Number(await get1(`otp:max:req:${email}`))
    if (cmo >= 3) {
        await set({
            key: `OTP::User::blocked::${email}`,
            val: 0,
            ttl: 300
        })

        throw new Error("you are blocked", { cause: { status: 409 } })
    }
    const code = `${createNumberOtp()}`;
    const hashedCode = await hash(code, SALT_ROUND)
    await set({ key: `OTP::User::${email}`, val: `${hashedCode}`, ttl: 120 })
    cmo>0?await inc(`otp:max:req:${email}`)            :     await set({ key: `otp:max:req:${email}`, val: 1, ttl: 300 })
    await sendEmail(email,
        null, null, "confirm-email",
        funcs(code, "confirm-email")
    )
}
export const signup = async (inputs) => {
    const { email, password, username, phone } = inputs
    let user1 = await userModel.findOne({ email })
    const hashed = await hash(password, SALT_ROUND)
    if (user1) throw new Error("duplicated email", { cause: { status: 409 } })
    console.log(inputs);

    const [addedUser] = await userModel.create([{ username, password: hashed, email, provider: ProviderEnum.System, phone }])
    const user = addedUser[0];
    generateOtpAndSendEmail(email)
    return user
}
export const confirmEmail = async (inputs) => {
    const { email, otp } = inputs
    let user1 = await userModel.findOne({ email, confirmEmail: { $exists: false }, provider: ProviderEnum.System })
    if (!user1) throw new Error("user not ffound", { cause: { status: 409 } })
    console.log(inputs);

    const hasshedOTP = await get1(`OTP::User::${email}`)
    if (!hasshedOTP) {
        throw new Error("ma t2ool enta meen ya 3m", { cause: { status: 404 } })
    }
    if (!await compare(otp, hasshedOTP)) {
        throw new Error("ana mesh 3arf enta mesh 3ayz t2ol enta meen leeh", { cause: { status: 404 } })
                  
    }
    user1.confirmEmail = new Date()
    await user1.save()
    
    user1.verificationExpires = ""
        await user1.save()

    await delete1(`OTP::User::${email}`)
    await delete1(`OTP::User::blocked::${email}`)
    await delete1(`otp:max:req:${email}`)
}
export const reSendConfirmEmail = async (inputs) => {
    const { email } = inputs
    let user1 = await userModel.findOne({ email, confirmEmail: { $exists: false }, provider: ProviderEnum.System })
    if (!user1) throw new Error("user not ffound", { cause: { status: 404 } })
    console.log(await TTL(email));

    // if (await TTL(`OTP::User::${email}`) > 0) {
    //     throw new Error("enta aslan m3ak otp", { cause: { status: 409 } })
    // }
    const hasshedOTP=await get1(`OTP::User::${email}`)


    generateOtpAndSendEmail(email)


}
export const login = async (body) => {
    const { email, password } = body
        const gettings=(Number(await get1(`wrongPAssword${email}`)))||0
        console.log(gettings);
        
       const blockedTTL=Number(await TTL(`blockedwrongPAssword${email}`))
       if(blockedTTL>0){
            throw new Error(`you are blocked for${blockedTTL}`, { cause: { status: 404 } });

       }
        if(gettings>=5){ 
            await set({
                key:`blockedwrongPAssword${email}`,
                val:1,
                ttl:300
            })
        }

    const user = await userModel.findOne({ email, confirmEmail: { $exists: true } })
    
    if (!user) throw new Error("invalid email or password", { cause: { status: 404 } });
    const wrongPassword = !(await compare(password, user.password))
    if (wrongPassword){
        gettings>0?await inc(`wrongPAssword${email}`):await set({ key: `wrongPAssword${email}`, val: 1, ttl: 300 })


throw new Error("invalid email or password", { cause: { status: 404 } });
    } 
    if(!user._2stepVerification){
    const jwtid = randomUUID()
    const token = jwt.sign(
        { id: user._id, email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES, jwtid }
    );
    const refreshToken = jwt.sign(
        { sub: user.id },
        REFRESH_SECRET,
        { expiresIn: "7d", jwtid }
    );
    await delete1(`wrongPAssword${email}`)
    return { user, token, refreshToken }}
    else{
        generateOtpAndSendEmail(email)
        return true
    }
}
export const signupwithgmail = async ({ idToken }) => {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken,
        audience: ""
    });
    const payload = ticket.getPayload();
    console.log(payload);
    let user = await userModel.findOne({ email: payload.email })
    console.log(user);
    if (user && user.provider == ProviderEnum.System) {

        throw new Error("js", { cause: { status: 409 } })

    } else {
        if (!user) {
            user = await userModel.create({
                firstName: payload.given_name,
                lastName: payload.family_name,
                email: payload.email,
                provider: ProviderEnum.Google,
                confirmEmail: new Date()
            })
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );
        const refreshToken = jwt.sign(
            { sub: user._id },
            REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        return { user, token, refreshToken }
    }

}
export const loginwithgmail = async ({ idToken }) => {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken,
        audience: ""
    });
    const payload = ticket.getPayload();
    console.log(payload);
    let user = await userModel.findOne({ email: payload.email })
    console.log(user);
    if (!user || user.provider == ProviderEnum.System) {

        throw new Error("js", { cause: { status: 409 } })

    } else {

        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );
        const refreshToken = jwt.sign(
            { sub: user._id },
            REFRESH_SECRET,
            { expiresIn: "7d" }
        );
        return { user, token, refreshToken }
    }

}
export const loginOtp=async({email,otp})=>{
 let user1 = await userModel.findOne({ email, confirmEmail: { $exists: true }, provider: ProviderEnum.System ,_2stepVerification:{$exists:true}})
    if (!user1) throw new Error("user not ffound", { cause: { status: 409 } })

    const hasshedOTP = await get1(`OTP::User::${email}`)
    if (!hasshedOTP) {
        throw new Error("ma t2ool enta meen ya 3m", { cause: { status: 404 } })
    }
    if (!await compare(otp, hasshedOTP)) {
        throw new Error("ana mesh 3arf enta mesh 3ayz t2ol enta meen leeh", { cause: { status: 404 } })
                  
    }
    await delete1(`OTP::User::${email}`)
    await delete1(`OTP::User::blocked::${email}`)
    await delete1(`otp:max:req:${email}`)
       const jwtid = randomUUID()
    const token = jwt.sign(
        { id: user1._id, email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES, jwtid }
    );
    const refreshToken = jwt.sign(
        { sub: user1.id },
        REFRESH_SECRET,
        { expiresIn: "7d", jwtid }
    );
    return { user1, token, refreshToken }
}
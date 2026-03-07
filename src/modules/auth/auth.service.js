import { compare, hash } from "bcrypt"
import { ProviderEnum } from "../../common/enum/provider/enum.js"
import { userModel } from "../../DB/model/index.js"
import { JWT_EXPIRES, JWT_SECRET, REFRESH_SECRET, SALT_ROUND } from "../../../config/config.service.js"
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library';
import {randomUUID}from 'node:crypto'
export const signup = async (inputs) => {
    const { email, password, username,phone } = inputs
    const user = await userModel.findOne({ email })
    const hashed = await hash(password, SALT_ROUND)
    if (user) throw new Error("duplicated email", { cause: { status: 409 } })
        console.log(inputs);
        
    const [addedUser] = await userModel.create([{ username, password: hashed, email, provider: ProviderEnum.System,phone }])
    console.log({addedUser:addedUser});
    
    return addedUser[0]
}
export const login = async (body) => {
    const { email, password } = body
    const user = await userModel.findOne({ email })
    if (!user) throw new Error("invalid email or password", { cause: { status: 404 } });
    const wrongPassword = !(await compare(password, user.password))
    if (wrongPassword) throw new Error("invalid email or password", { cause: { status: 404 } });
    const jwtid=randomUUID()
    const token = jwt.sign(
        { id: user._id, email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES,jwtid }
    );
    const refreshToken = jwt.sign(
        { sub: user.id },
        REFRESH_SECRET,
        { expiresIn: "7d" ,jwtid}
    );
    return { user, token, refreshToken }
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
       if(!user){  user = await userModel.create({
            firstName: payload.given_name,
            lastName: payload.family_name,
            email: payload.email,
            provider: ProviderEnum.Google,
            confirmEmail: new Date()
        })}
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
import { JWT_SECRET } from "../../config/config.service.js";
import { tokenModel } from "../DB/model/token.model.js";
import { userModel } from "../DB/model/user.model.js";
import jwt from 'jsonwebtoken'

export const auth = async (req, res, next) => {
    const authorization = req.headers.authorization
    let decoded

    try {


        decoded = jwt.verify(authorization, JWT_SECRET);

        if(decoded.jti&&await tokenModel.findOne({jti:decoded.jti})){
                    res.status(403).json({ message: "Invalid  token type" });

        }


    } catch (err) {
        res.status(403).json({ message: "Invalid  token type" });
    }
    const user = await userModel.findById(decoded.id)
    if (!user) throw new Error("user not found", { cause: { status: 404 } })
    req.user = user
    req.decoded=decoded
    console.log(user.CCT.getTime(), decoded.iat * 1000);
    if(user.CCT&&user.CCT.getTime()>= decoded.iat * 1000){
                res.status(403).json({ message: "Invalid  login session" });

    }
    next()

}
export const authorization = (roles = []) => {


    return async (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            throw new Error("not allowed account", { cause: { status: 403 } })
        }
        next()
    }
}
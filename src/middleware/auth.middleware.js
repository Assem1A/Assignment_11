import { JWT_SECRET } from "../../config/config.service.js";
import { userModel } from "../DB/model/user.model.js";
import jwt from 'jsonwebtoken'

export const auth = async (req, res, next) => {
    const authorization = req.headers.authorization
    var decoded

    decoded = jwt.verify(authorization, JWT_SECRET);
    const user = await userModel.findById(decoded.id)
    if (!user) throw new Error("user not found", { cause: { status: 404 } })
    req.user = user
    next()

}

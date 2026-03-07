import { Router } from 'express'
import { login, loginwithgmail, signup, signupwithgmail } from './auth.service.js';
import { auth } from '../../middleware/auth.middleware.js';
import { JWT_SECRET, REFRESH_SECRET } from '../../../config/config.service.js';
import jwt from "jsonwebtoken"
import { userModel } from '../../DB/model/user.model.js';
import * as validators from './auth.validation.js';
import { valid, valil } from '../../middleware/validation.middleware.js';
const router = Router();

router.post("/signup", valid,async (req, res, next) => {
    const result = await signup(req.body)    
    
    return res.status(201).json({ message: "Done signup", result     })
})

router.post("/login",valil, async (req, res, next) => {
    const result = await login(req.body)
    return res.status(200).json({ message: "Done login", result })
})
router.get('/re-token',async(req, res, next) => {

    const refreshToken = req.headers.authorization;
    console.log(refreshToken);

    if (!refreshToken) {
        return res.status(401).json({ message: "invalid refresh token" });
    }

    try {
        

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        
        const user=await userModel.findById(decoded.sub)
        const newAccessToken = jwt.sign(
            { sub: decoded.sub ,email:user.email},
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
});
router.post('/signup/gmail',async(req,res,next)=>{
    console.log(req.body);
    
    const acc=await signupwithgmail(req.body);
        return res.status(200).json({ message: "Done sigunup", acc })
    
})
router.post('/login/gmail',async(req,res,next)=>{
    console.log(req.body);
    
    const acc=await loginwithgmail(req.body);
        return res.status(200).json({ message: "Done login", acc })
    
})

export default router
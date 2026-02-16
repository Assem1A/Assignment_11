import { Router } from 'express'
import { login, signup } from './auth.service.js';
import { auth } from '../../middleware/auth.middleware.js';
import { JWT_SECRET, REFRESH_SECRET } from '../../../config/config.service.js';
import jwt from "jsonwebtoken"
const router = Router();
router.post("/signup", async (req, res, next) => {
    const result = await signup(req.body)
    return res.status(201).json({ message: "Done signup", result })
})

router.post("/login", async (req, res, next) => {
    const result = await login(req.body)
    return res.status(200).json({ message: "Done login", result })
})
router.get('/re-token', (req, res, next) => {

    const refreshToken = req.headers.authorization;
    console.log(refreshToken);

    if (!refreshToken) {
        return res.status(401).json({ message: "invalid refresh token" });
    }

    try {

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            { sub: decoded.sub ,email:req.body.email},
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
});

export default router
import { Request, Response } from "express";
import bcrypt  from "bcryptjs";
import { User,RefreshToken  } from "../models";
import authConfig from "../config/auth";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,

        });
        res.status(201).json({
            message: "đăng kí thành công",
        user: {
                id: newUser.get("id"),
                username: newUser.get("username"),
                email: newUser.get("email"),
            },
        });
    } catch (error) {
        res.status(500).json({ error: "đăng kí thất bại" })
    }
};

const createRefreshToken = async (userId: number) => {
    const refreshToken = jwt.sign (
    {id: userId},
    authConfig.refreshSecret,
    {expiresIn: "7d" as any}
);
const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await RefreshToken.create({
        token: refreshToken ,
        userId : userId,
        expiryDate: expiryDate,
})
}


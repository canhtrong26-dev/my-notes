import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, RefreshToken } from "../models";
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
    const refreshToken = jwt.sign(
        { id: userId },
        authConfig.refreshSecret,
        { expiresIn: "7d" as any }
    );
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await RefreshToken.create({
        token: refreshToken,
        userId: userId,
        expiryDate: expiryDate,
    })

    return refreshToken;
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ error: "User không tồn tại" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.get("password") as string);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Mật khẩu không hợp lệ" });
        }
        const userId = user.get("id") as number;

        const accessToken = jwt.sign(
            { id: userId },
            authConfig.secret,
            { expiresIn: "15m" as any }
        );

        const refreshToken = await createRefreshToken(userId);
        res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });


    } catch (error) {
        res.status(500).json({ error: "Đăng nhập thất bại" });
    }
};



export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const tokenInDB = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!tokenInDB) {
      return res.status(404).json({ error: "Token không hợp lệ" });
    }

    const expiryDate = tokenInDB.get("expiryDate") as Date;
    if (expiryDate < new Date()) {
      return res.status(401).json({ error: "Token đã hết hạn" });
    }

    const decoded = jwt.verify(refreshToken, authConfig.refreshSecret) as {
      id: number;
    };

    const accessToken = jwt.sign(
      { id: decoded.id },
      authConfig.secret,
      { expiresIn: "15m" as any }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: "Refresh token thất bại" });
  }
};




export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        await RefreshToken.destroy({
            where: { token: refreshToken },
        });

        res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (error) {
        res.status(500).json({ error: "Đăng xuất thất bại" });
    }
};
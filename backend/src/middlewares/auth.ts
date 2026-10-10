import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Không có token" });
    }

    try {
         const decoded = jwt.verify(token , authConfig.secret) as {id: number};
        (req as any).userId  = decoded.id;
        next();
    } catch (error) {
    return res.status(401).json({error: "Token không hợp lệ"})
}
};  
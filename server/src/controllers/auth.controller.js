import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        //primero valido al usuario
        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(400).json(["El email ya existe"]);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });

        //guardo el usuario y creo el token
        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id });

        //DEPLOY PRODUCTION
        res.cookie("token", token, {
            httpOnly: true, // Solo accesible desde el backend
            secure: process.env.NODE_ENV === "production", // Solo enviar sobre HTTPS en producción
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // None para cross-site en producción, Lax en desarrollo
        });

        //res.cookie("token", token);
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        //.compare devuelve true o false
        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        const token = await createAccessToken({ id: userFound._id });

        // Configurar la cookie con el token
        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production", // Solo enviar sobre HTTPS en producción
            //sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // None para cross-site en producción, Lax en desarrollo
            sameSite: "none", // Lax es generalmente seguro para la mayoría de aplicaciones
        });
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            token,
        });

        //DEPLOY PRODUCTION
        //res.cookie("token", token, {
        //    httpOnly: true,
        //    secure: true,
        //    sameSite: "None",
        //});

        //res.cookie("token", token);
        //res.json({
        //    id: userFound._id,
        //    username: userFound.username,
        //    email: userFound.email,
        //    createdAt: userFound.createdAt,
        //    updatedAt: userFound.updatedAt,
        //});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//verifica si el usuario existe
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "No autorizado" });
    } else {
        jwt.verify(token, TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.status(401).json({ message: "No autorizado" });
            }

            console.log("token: ", token);
            console.log("NODE_ENV: ", process.env.NODE_ENV);

            const userFound = await User.findById(user.id);
            if (!userFound) {
                return res.status(401).json({ message: "No autorizado" });
            } else {
                return res.json({
                    id: userFound._id,
                    username: userFound.username,
                    email: userFound.email,
                });
            }
        });
    }
};

export const logout = (req, res) => {
    //DEPLOY PRODUCTION
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo enviar sobre HTTPS en producción
        expires: new Date(0),
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // None para cross-site en producción, Lax en desarrollo
    });
    return res.sendStatus(200);

    //res.cookie("token", "", {
    //    httpOnly: true,
    //    secure: true,
    //    expires: new Date(0),
    //});
    //return res.sendStatus(200);
};

//export const profile = async (req, res) => {
//    //console.log(req.user);
//    const userFound = await User.findById(req.user.id);
//
//    if (!userFound) return res.status(400).json({ message: "User not found" });
//
//    return res.json({
//        id: userFound._id,
//        username: userFound.username,
//        email: userFound.email,
//        createdAt: userFound.createdAt,
//        updatedAt: userFound.updatedAt,
//    });
//};

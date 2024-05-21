import { verify } from 'jsonwebtoken';
import { createError } from './errorHandling';
import { config } from '../config/token';
import { NextFunction } from 'express';

export const verifyToken = (req : any,res : any,next:any)=>{

    // const token = req.cookies.access_token;
    const token = req.headers['authorization'];

    if(!token) return next(createError(401,'You are not authenticated!'));

    verify(token, config.secret, (err :any,user:any)=>{

        if(err) return next(createError(403, 'Token is not valid!'));

        req.user = user;
        next();
    });
}
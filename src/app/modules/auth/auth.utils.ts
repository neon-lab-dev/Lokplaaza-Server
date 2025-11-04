import jwt from 'jsonwebtoken';

export const createToekn = (jwtPayload : {email:string, role:string, userId:string}, secret:string, expiresIn:string) => {
    return jwt.sign(jwtPayload, secret, {expiresIn});
};
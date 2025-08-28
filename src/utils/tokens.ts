import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/v1/config';
import logger from '../logger/v1/logger';
import crypto from 'crypto';

class TokenService {
    private jwtSecret: string;
    constructor() {
        this.jwtSecret = config['jwtSecret'];
    }

    // Function to verify a JWT token
    public verifyJwtToken = (token: string): JwtPayload | string => {
        try {
            return jwt.verify(token, this.jwtSecret) as JwtPayload;
        } catch (error) {
            logger.error(`Error on verifyJWT: ${error}`);
            throw new Error("Invalid or expired token");
        }
    };

    public generateRandomToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

}

const tokenService = new TokenService();
export default tokenService;
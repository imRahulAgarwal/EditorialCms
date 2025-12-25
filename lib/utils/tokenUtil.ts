import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

export type JwtPayload = {
	id: string;
	role: string;
};

export function signToken(payload: JwtPayload, expiresIn: number) {
	return jwt.sign(payload, jwtSecret, { expiresIn });
}

export function verifyToken(token: string) {
	return jwt.verify(token, jwtSecret) as JwtPayload;
}

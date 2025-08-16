import * as jwt from "jsonwebtoken";

export class VerifyJwtToken {
	public async run<TargetType>(
		jwtToken: string,
	): Promise<jwt.JwtPayload & TargetType> {
		return jwt.verify(jwtToken, process.env.JWT_PRIVATE_KEY) as jwt.JwtPayload &
			TargetType;
	}
}

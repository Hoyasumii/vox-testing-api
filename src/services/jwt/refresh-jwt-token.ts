import * as jwt from "jsonwebtoken";

export class RefreshJwtToken {
	public async run(token: string): Promise<string> {
		const currentToken = jwt.verify(
			token,
			process.env.JWT_PRIVATE_KEY,
		) as jwt.JwtPayload & { userId: string };

		const {
			sub: _1,
			aud: _2,
			exp: _3,
			iat: _4,
			iss: _5,
			jti: _6,
			nbf: _7,
			...content
		} = currentToken;

		return jwt.sign(content, process.env.JWT_PRIVATE_KEY, {
			expiresIn: "1h",
		});
	}
}

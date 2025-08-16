import * as jwt from "jsonwebtoken";

export class SignJwtToken {
	async run(
		content: string | object | Buffer<ArrayBufferLike>,
	): Promise<string> {
		return jwt.sign(content, process.env.JWT_PRIVATE_KEY, {
			expiresIn: "1h",
		});
	}
}

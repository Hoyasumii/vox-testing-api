import * as argon2 from "argon2";

export class PasswordHasher {
	private readonly secret: Buffer<ArrayBuffer>;

	constructor(secret: string) {
		this.secret = Buffer.from(secret);
	}

	async hash(content: string): Promise<string> {
		return await argon2.hash(content, { secret: this.secret });
	}

	async verify(hashedContent: string, content: string): Promise<boolean> {
		return await argon2.verify(hashedContent, content, {
			secret: this.secret,
		});
	}
}

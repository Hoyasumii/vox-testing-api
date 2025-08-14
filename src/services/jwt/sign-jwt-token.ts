import type { EmptyRepository } from "@/repositories";
import { Service } from "@/types";
import * as jwt from "jsonwebtoken";

export class SignJwtToken extends Service<EmptyRepository, string, string> {
	async run(
		content: string | object | Buffer<ArrayBufferLike>,
	): Promise<string> {
		return jwt.sign(content, process.env.JWT_PRIVATE_KEY, {
			expiresIn: "1h",
		});
	}
}

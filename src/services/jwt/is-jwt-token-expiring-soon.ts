import type { EmptyRepository } from "@/repositories";
import { Service } from "@/types";
import * as jwt from "jsonwebtoken";

export class IsJwtTokenExpiringSoon extends Service<EmptyRepository, string, boolean> {
	public limitTime = 60 * 15;

	public async run(token: string): Promise<boolean> {
		const jwtTokenVerified = jwt.verify(
			token,
			process.env.JWT_PRIVATE_KEY,
		) as jwt.JwtPayload;

		const now = Math.floor(Date.now() / 1000);

		return jwtTokenVerified.exp! - now <= this.limitTime;
	}
}

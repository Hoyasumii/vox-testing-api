import z from "zod";

export const EnvDTO = z.object({
	PORT: z.string().describe("Desired PORT"),
	POSTGRESQL_USERNAME: z.string(),
	POSTGRESQL_PASSWORD: z.string(),
	POSTGRESQL_DATABASE: z.string(),
	DATABASE_URL: z.string(),
	ARGON_SECRET: z.string().describe("Argon2 Secret"),
	JWT_PRIVATE_KEY: z.string().describe("JWT Private Key")
});

export type EnvDTO = z.infer<typeof EnvDTO>;

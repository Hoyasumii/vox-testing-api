import { z } from "zod";

export const AuthorizationHeaderDTO = z.object({
	authorization: z.string().min(1, "Token de autorização é obrigatório").describe("Token JWT para autenticação"),
}).describe("Header de autorização necessário para acessar recursos protegidos");

export type AuthorizationHeaderDTO = z.infer<typeof AuthorizationHeaderDTO>;

import { z } from "zod";

export const RefreshTokenDTO = z.object({
	authorization: z.string().min(1, "Token de autorização é obrigatório").describe("Token JWT para renovação"),
}).describe("Dados necessários para renovar um token de acesso");

export type RefreshTokenDTO = z.infer<typeof RefreshTokenDTO>;

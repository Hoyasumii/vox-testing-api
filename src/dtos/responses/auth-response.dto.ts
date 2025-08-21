import { z } from "zod";

export const AuthResponseDTO = z.object({
	token: z.string().describe("JWT token para autenticação"),
}).describe("Resposta de autenticação bem-sucedida");

export type AuthResponseDTO = z.infer<typeof AuthResponseDTO>;

import { z } from "zod";

export const ErrorResponseDTO = z.object({
	message: z.string().describe("Mensagem de erro"),
	statusCode: z.number().describe("Código de status HTTP"),
	timestamp: z.string().describe("Timestamp do erro"),
	path: z.string().describe("Caminho da requisição que gerou o erro"),
}).describe("Resposta padrão de erro da API");

export type ErrorResponseDTO = z.infer<typeof ErrorResponseDTO>;

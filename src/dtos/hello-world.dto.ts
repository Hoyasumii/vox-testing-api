import { z } from "zod";

export const HelloWorldResponseDTO = z.object({
	message: z.string().describe("Mensagem de saudação"),
}).describe("Resposta padrão do endpoint hello world");

export type HelloWorldResponseDTO = z.infer<typeof HelloWorldResponseDTO>;

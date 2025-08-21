import { z } from "zod";

export const CreateUserResponseDTO = z.object({
	id: z.string().uuid().describe("ID único do usuário criado"),
}).describe("Resposta de criação de usuário bem-sucedida");

export type CreateUserResponseDTO = z.infer<typeof CreateUserResponseDTO>;

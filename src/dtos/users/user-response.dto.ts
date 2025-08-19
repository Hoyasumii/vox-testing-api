import { z } from "zod";
import { UserType } from "./user-types";

export const UserResponseDTO = z.object({
	id: z.uuid().describe("Identificador único do usuário"),
	name: z.string().describe("Nome completo do usuário"),
	email: z.email().describe("Endereço de email do usuário"),
	type: UserType,
	createdAt: z.date().describe("Data e hora de criação do usuário"),
	updatedAt: z.date().describe("Data e hora da última atualização do usuário"),
}).describe("Dados públicos de resposta de um usuário, excluindo informações sensíveis como senha");

export type UserResponseDTO = z.infer<typeof UserResponseDTO>;

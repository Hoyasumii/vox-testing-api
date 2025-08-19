import { z } from "zod";
import { UserType } from "./user-types";
import { UserPasswordDTO } from "./user-password.dto";

export const UpdateUserDTO = z.object({
	name: z.string().min(1, "Nome é obrigatório").optional().describe("Nome completo do usuário"),
	email: z.email("Email deve ter um formato válido").optional().describe("Endereço de email único do usuário"),
	type: UserType.optional(),
	password: UserPasswordDTO.optional(),
}).describe("Dados opcionais para atualizar informações de um usuário existente");

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

import { z } from "zod";
import { UserPasswordDTO } from "./user-password.dto";

export const UserAuthResponseDTO = z.object({
	id: z.uuid().describe("Identificador único do usuário"),
	password: UserPasswordDTO,
}).describe("Dados internos de resposta para autenticação de usuário, incluindo informações sensíveis");

export type UserAuthResponseDTO = z.infer<typeof UserAuthResponseDTO>;

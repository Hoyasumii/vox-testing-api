import { z } from "zod";
import { UserPasswordDTO } from "./user-password.dto";

export const AuthenticateUserDTO = z.object({
	email: z.email("Email deve ter um formato válido").describe("Email do usuário para autenticação"),
	password: UserPasswordDTO,
}).describe("Dados necessários para autenticar um usuário no sistema");

export type AuthenticateUserDTO = z.infer<typeof AuthenticateUserDTO>;

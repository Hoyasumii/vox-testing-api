import { z } from "zod";
import { UserPasswordDTO } from "./user-password.dto";

export const AuthenticateUserDTO = z.object({
	email: z.email("Email deve ter um formato válido"),
	password: UserPasswordDTO,
});

export type AuthenticateUserDTO = z.infer<typeof AuthenticateUserDTO>;

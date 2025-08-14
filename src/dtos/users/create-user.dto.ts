import { z } from "zod";
import { UserType } from "./user-types";
import { UserPasswordDTO } from "./user-password.dto";

export const CreateUserDTO = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	email: z.email("Email deve ter um formato válido"),
	password: UserPasswordDTO,
	type: UserType.optional(),
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

import { z } from "zod";
import { UserType } from "./user-types";
import { UserPasswordDTO } from "./user-password.dto";

export const UpdateUserDTO = z.object({
	name: z.string().min(1, "Nome é obrigatório").optional(),
	email: z.email("Email deve ter um formato válido").optional(),
	type: UserType.optional(),
	password: UserPasswordDTO.optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

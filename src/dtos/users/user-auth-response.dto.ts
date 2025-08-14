import { z } from "zod";
import { UserPasswordDTO } from "./user-password.dto";

export const UserAuthResponseDTO = z.object({
	id: z.uuid(),
	password: UserPasswordDTO,
});

export type UserAuthResponseDTO = z.infer<typeof UserAuthResponseDTO>;

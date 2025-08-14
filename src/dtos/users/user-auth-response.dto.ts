import { z } from "zod";
import { UserPasswordDTO } from "./user-password.dto";

export const UserAuthResponseDto = z.object({
	id: z.uuid(),
	password: UserPasswordDTO,
});

export type UserAuthResponseDto = z.infer<typeof UserAuthResponseDto>;

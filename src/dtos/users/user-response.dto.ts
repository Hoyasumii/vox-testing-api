import { z } from "zod";
import { UserType } from "./user-types";

export const UserResponseDTO = z.object({
	id: z.uuid(),
	name: z.string(),
	email: z.email(),
	type: UserType,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type UserResponseDTO = z.infer<typeof UserResponseDTO>;

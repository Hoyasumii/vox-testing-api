import { z } from "zod";

export const DeleteUserDto = z.object({
	id: z.uuid("ID deve ser um UUID válido"),
});

export type DeleteUserDto = z.infer<typeof DeleteUserDto>;

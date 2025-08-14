import { z } from "zod";

export const GetUserByIdDto = z.object({
	id: z.uuid("ID deve ser um UUID válido"),
});

export type GetUserByIdDto = z.infer<typeof GetUserByIdDto>;

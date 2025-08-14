import { z } from "zod";

export const GetUserByEmailDto = z.object({
	email: z.email("Email deve ter um formato válido"),
});

export type GetUserByEmailDto = z.infer<typeof GetUserByEmailDto>;

import { z } from "zod";

export const GetUserByEmailDTO = z.email("Email deve ter um formato válido");

export type GetUserByEmailDTO = z.infer<typeof GetUserByEmailDTO>;

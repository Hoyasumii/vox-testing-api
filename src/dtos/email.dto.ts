import z from "zod";

export const email = z.email().describe("Endereço de email válido");

export type email = z.infer<typeof email>;

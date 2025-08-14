import z from "zod";

export const email = z.email();

export type email = z.infer<typeof email>;

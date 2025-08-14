import z from "zod";

export const uuid = z.uuid();

export type uuid = z.infer<typeof uuid>;

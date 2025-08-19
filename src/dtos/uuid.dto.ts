import z from "zod";

export const uuid = z.uuid().describe("Identificador único universal (UUID)");

export type uuid = z.infer<typeof uuid>;

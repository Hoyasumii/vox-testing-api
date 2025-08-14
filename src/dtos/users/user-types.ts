import { z } from "zod";

export const UserType = z.enum(["DOCTOR", "PATIENT"]);

export type UserType = z.infer<typeof UserType>;

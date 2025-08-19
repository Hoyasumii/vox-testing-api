import { z } from "zod";

export const DoctorIdParamDTO = z.object({
	id: z.string().uuid("ID deve ser um UUID válido").describe("ID único do médico"),
}).describe("Parâmetro de rota contendo o ID do médico");

export type DoctorIdParamDTO = z.infer<typeof DoctorIdParamDTO>;

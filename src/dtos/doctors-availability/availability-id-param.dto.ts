import { z } from "zod";
import { uuid } from "../uuid.dto";

export const DoctorAvailabilityIdParamDTO = z.object({
	id: uuid.describe("ID da disponibilidade do médico"),
}).describe("Parâmetro de rota para identificar uma disponibilidade específica de médico");

export type DoctorAvailabilityIdParamDTO = z.infer<typeof DoctorAvailabilityIdParamDTO>;

import { DoctorsRepository } from "@/repositories/prisma";
import { DoctorExistsService } from "@/services/doctors";

export function makeDoctorExistsFactory() {
	const repository = new DoctorsRepository();

	return new DoctorExistsService(repository);
}

import { DoctorsRepository } from "@/repositories/prisma";
import { CreateDoctorService } from "@/services/doctors";

export function makeCreateDoctorFactory() {
	const repository = new DoctorsRepository();

	return new CreateDoctorService(repository);
}

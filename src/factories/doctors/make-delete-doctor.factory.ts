import { DoctorsRepository } from "@/repositories/prisma";
import { DeleteDoctorService } from "@/services/doctors";

export function makeDeleteDoctorFactory() {
	const repository = new DoctorsRepository();

	return new DeleteDoctorService(repository);
}

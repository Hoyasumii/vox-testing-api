import { MemoryCache } from "../../cache";
import { DoctorsRepository } from "../../repositories";
import { DoctorExistsService } from "@/services/doctors";

export function makeDoctorExistsFactory() {
	const cache = new MemoryCache();
	const repository = new DoctorsRepository(cache, chanels);

	return new DoctorExistsService(repository);
}

import { MemoryCache } from "../../cache";
import { DoctorsAvailabilityRepository } from "../../repositories";
import { FindByDoctorIdService } from "@/services/doctors-availability";

export function makeFindByDoctorIdFactory() {
	const cache = new MemoryCache();
	const repository = new DoctorsAvailabilityRepository(cache);

	return new FindByDoctorIdService(repository);
}

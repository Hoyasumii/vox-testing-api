import { MemoryCache } from "../../cache";
import { DoctorsAvailabilityRepository } from "../../repositories";
import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";

export function makeCreateDoctorAvailabilityFactory() {
	const cache = new MemoryCache();
	const repository = new DoctorsAvailabilityRepository(cache);

	return new CreateDoctorAvailabilityService(repository);
}

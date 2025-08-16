import { MemoryCache } from "../../cache";
import { DoctorsAvailabilityRepository } from "../../repositories";
import { UpdateDoctorAvailabilityService } from "@/services/doctors-availability";

export function makeUpdateDoctorAvailabilityFactory() {
	const cache = new MemoryCache();
	const repository = new DoctorsAvailabilityRepository(cache);

	return new UpdateDoctorAvailabilityService(repository);
}

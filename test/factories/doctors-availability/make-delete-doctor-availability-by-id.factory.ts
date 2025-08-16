import { MemoryCache } from "../../cache";
import { DoctorsAvailabilityRepository } from "../../repositories";
import { DeleteDoctorAvailabilityByIdService } from "@/services/doctors-availability";

export function makeDeleteDoctorAvailabilityByIdFactory() {
	const cache = new MemoryCache();
	const repository = new DoctorsAvailabilityRepository(cache);

	return new DeleteDoctorAvailabilityByIdService(repository);
}

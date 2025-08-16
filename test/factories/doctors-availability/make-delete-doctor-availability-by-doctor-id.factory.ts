import { MemoryCache } from "../../cache";
import { DoctorsAvailabilityRepository } from "../../repositories";
import { DeleteDoctorAvailabilityByDoctorIdService } from "@/services/doctors-availability";

export function makeDeleteDoctorAvailabilityByDoctorIdFactory() {
	const cache = new MemoryCache();
	const repository = new DoctorsAvailabilityRepository(cache);

	return new DeleteDoctorAvailabilityByDoctorIdService(repository);
}

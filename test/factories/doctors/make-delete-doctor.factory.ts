import { MemoryCache } from "../../cache";
import { DoctorsRepository } from "../../repositories";
import { DeleteDoctorService } from "@/services/doctors";

export function makeDeleteDoctorFactory() {
	const cache = new MemoryCache();
	const repository = new DoctorsRepository(cache);

	return new DeleteDoctorService(repository);
}

import { testChannel } from "t/channels";
import { MemoryCache } from "../../cache";
import { DoctorsRepository } from "../../repositories";
import { CreateDoctorService } from "@/services/doctors";

export function makeCreateDoctorFactory() {
	const cache = new MemoryCache();
	const channels = testChannel;
	const repository = new DoctorsRepository(cache);

	return new CreateDoctorService(repository);
}

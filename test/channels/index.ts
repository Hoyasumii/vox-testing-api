import { ChannelImpl } from "@/channels/channel-impl";
import type { uuid } from "@/dtos";
import { CreateDoctorService, DoctorExistsService } from "@/services/doctors";
import { IsDoctorAvailabilityExistsService } from "@/services/doctors-availability";
import type { RepositoryBase } from "@/types";
import { MemoryCache } from "t/cache";
import {
	DoctorsAvailabilityRepository,
	DoctorsRepository,
} from "t/repositories";

export const testChannel: ChannelImpl & {
	repositories: Array<RepositoryBase>;
} = new ChannelImpl() as ChannelImpl & { repositories: Array<RepositoryBase> };

const cache = new MemoryCache();
const doctorsRepository = new DoctorsRepository(cache, testChannel);

const doctorAvailabilityRepository = new DoctorsAvailabilityRepository(
	cache,
	testChannel,
);

testChannel.register<uuid, boolean>("doctor:exists", async (id: uuid) => {
	const service = new DoctorExistsService(doctorsRepository);

	return await service.run(id);
});

testChannel.register<uuid, boolean>("doctor:create", async (id: uuid) => {
	const service = new CreateDoctorService(doctorsRepository);

	return await service.run(id);
});

testChannel.register<uuid, boolean>(
	"doctor-availability:exists",
	async (id: uuid) => {
		const service = new IsDoctorAvailabilityExistsService(
			doctorAvailabilityRepository,
		);

		return await service.run(id);
	},
);

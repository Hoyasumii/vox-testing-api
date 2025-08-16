import { ChannelImpl } from "@/channels/channel-impl";
import type { uuid } from "@/dtos";
import { CreateDoctorService, DoctorExistsService } from "@/services/doctors";
import type { RepositoryBase } from "@/types";
import { MemoryCache } from "t/cache";
import { DoctorsRepository } from "t/repositories";

export const testChannel: ChannelImpl & {
	repositories: Array<RepositoryBase>;
} = new ChannelImpl() as ChannelImpl & { repositories: Array<RepositoryBase> };

const cache = new MemoryCache();
const doctorsRepository = new DoctorsRepository(cache, testChannel);

testChannel.register<uuid, boolean>("doctor:exists", async (id: uuid) => {
	const service = new DoctorExistsService(doctorsRepository);

	return await service.run(id);
});

testChannel.register<uuid, boolean>("doctor:create", async (id: uuid) => {
	const service = new CreateDoctorService(doctorsRepository);

	return await service.run(id);
});

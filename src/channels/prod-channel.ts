import type { uuid } from "@/dtos";
import {
	makeCreateDoctorFactory,
	makeDoctorExistsFactory,
} from "@/factories/doctors";
import { ChannelImpl } from "./channel-impl";

export const prodChannel = new ChannelImpl();

prodChannel.register<uuid, boolean>("doctor:exists", async (id: uuid) => {
	const service = makeDoctorExistsFactory();

	return await service.run(id);
});

prodChannel.register<uuid, boolean>("doctor:create", async (id: uuid) => {
	const service = makeCreateDoctorFactory();

	return await service.run(id);
});

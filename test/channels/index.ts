import { ChannelImpl } from "@/channels/channel-impl";
import type { uuid } from "@/dtos";
import { makeDoctorExistsFactory, makeCreateDoctorFactory } from "t/factories";

export const testChannel = new ChannelImpl();

testChannel.register<uuid, boolean>("doctor:exists", async (id: uuid) => {
  const service = makeDoctorExistsFactory();

  return await service.run(id);
});

testChannel.register<uuid, boolean>("doctor:create", async (id: uuid) => {
  const service = makeCreateDoctorFactory();

  return await service.run(id);
});

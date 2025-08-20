import { GetAvailableSlotsController } from "@/controllers/availability";
import { makeGetAvailableSlotsFactory } from "@/factories/schedule";
import { GetAvailableSlotsSerice } from "@/services/schedule";
import { Module } from "@nestjs/common";

@Module({
	controllers: [GetAvailableSlotsController],
	providers: [
		{
			provide: GetAvailableSlotsSerice,
			useFactory: makeGetAvailableSlotsFactory,
		},
	],
})
export class GetAvailableSlotsModule {}

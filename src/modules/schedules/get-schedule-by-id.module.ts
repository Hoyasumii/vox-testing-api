import { GetScheduleByIdController } from "@/controllers/schedules";
import { makeGetScheduleByIdFactory } from "@/factories/schedule";
import { GetScheduleByIdService } from "@/services/schedule";
import { Module } from "@nestjs/common";

@Module({
	controllers: [GetScheduleByIdController],
	providers: [
		{
			provide: GetScheduleByIdService,
			useFactory: makeGetScheduleByIdFactory,
		},
	],
})
export class GetScheduleByIdModule {}

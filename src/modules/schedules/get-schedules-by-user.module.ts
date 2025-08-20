import { GetSchedulesByUserController } from "@/controllers/schedules";
import { makeGetScheduleByPatientIdFactory } from "@/factories/schedule";
import { GetScheduleByPatientIdService } from "@/services/schedule";
import { Module } from "@nestjs/common";

@Module({
	controllers: [GetSchedulesByUserController],
	providers: [
		{
			provide: GetScheduleByPatientIdService,
			useFactory: makeGetScheduleByPatientIdFactory,
		},
	],
})
export class GetSchedulesByUserModule {}

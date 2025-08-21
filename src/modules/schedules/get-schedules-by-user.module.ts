import { GetSchedulesByUserController } from "@/controllers/schedules";
import { makeGetScheduleByPatientIdFactory, makeGetScheduleByDoctorIdFactory } from "@/factories/schedule";
import { GetScheduleByPatientIdService, GetScheduleByDoctorIdService } from "@/services/schedule";
import { Module } from "@nestjs/common";

@Module({
	controllers: [GetSchedulesByUserController],
	providers: [
		{
			provide: GetScheduleByPatientIdService,
			useFactory: makeGetScheduleByPatientIdFactory,
		},
		{
			provide: GetScheduleByDoctorIdService,
			useFactory: makeGetScheduleByDoctorIdFactory,
		},
	],
})
export class GetSchedulesByUserModule {}

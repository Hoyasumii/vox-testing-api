import { GetDoctorSchedulesController } from "@/controllers/schedules";
import { makeGetScheduleByDoctorIdFactory } from "@/factories/schedule";
import { GetScheduleByDoctorIdService } from "@/services/schedule";
import { Module } from "@nestjs/common";

@Module({
	controllers: [GetDoctorSchedulesController],
	providers: [
		{
			provide: GetScheduleByDoctorIdService,
			useFactory: makeGetScheduleByDoctorIdFactory,
		},
	],
})
export class GetDoctorSchedulesModule {}

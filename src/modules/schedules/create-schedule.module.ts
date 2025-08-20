import { CreateScheduleController } from "@/controllers/schedules";
import { makeCreateScheduleFactory } from "@/factories/schedule";
import { CreateScheduleService } from "@/services/schedule";
import { Module } from "@nestjs/common";

@Module({
	controllers: [CreateScheduleController],
	providers: [
		{
			provide: CreateScheduleService,
			useFactory: makeCreateScheduleFactory,
		},
	],
})
export class CreateScheduleModule {}

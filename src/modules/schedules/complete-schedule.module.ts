import { CompleteScheduleController } from "@/controllers/schedules";
import { makeCompleteScheduleFactory } from "@/factories/schedule";
import { CompleteScheduleService } from "@/services/schedule";
import { Module } from "@nestjs/common";

@Module({
	controllers: [CompleteScheduleController],
	providers: [
		{
			provide: CompleteScheduleService,
			useFactory: makeCompleteScheduleFactory,
		},
	],
})
export class CompleteScheduleModule {}

import { CancelScheduleController } from "@/controllers/schedules";
import { makeCancelScheduleFactory } from "@/factories/schedule";
import { CancelScheduleService } from "@/services/schedule";
import { Module } from "@nestjs/common";

@Module({
	controllers: [CancelScheduleController],
	providers: [
		{
			provide: CancelScheduleService,
			useFactory: makeCancelScheduleFactory,
		},
	],
})
export class CancelScheduleModule {}

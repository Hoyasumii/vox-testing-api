import { DeleteScheduleController } from "@/controllers/schedules";
import { makeDeleteScheduleFactory } from "@/factories/schedule";
import { DeleteScheduleService } from "@/services/schedule";
import { Module } from "@nestjs/common";

@Module({
	controllers: [DeleteScheduleController],
	providers: [
		{
			provide: DeleteScheduleService,
			useFactory: makeDeleteScheduleFactory,
		},
	],
})
export class DeleteScheduleModule {}

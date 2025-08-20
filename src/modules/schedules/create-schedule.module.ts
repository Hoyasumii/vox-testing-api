import { CreateScheduleController } from "@/controllers/schedules";
import { makeCreateScheduleFactory } from "@/factories/schedule";
import { CreateScheduleService } from "@/services/schedule";
import { Module } from "@nestjs/common";
import { GuardsModule } from "../guards/guards.module";

@Module({
	imports: [GuardsModule],
	controllers: [CreateScheduleController],
	providers: [
		{
			provide: CreateScheduleService,
			useFactory: makeCreateScheduleFactory,
		},
	],
})
export class CreateScheduleModule {}

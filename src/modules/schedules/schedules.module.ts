import { Module } from "@nestjs/common";
import { CreateScheduleModule } from "./create-schedule.module";
import { GetSchedulesByUserModule } from "./get-schedules-by-user.module";
import { GetScheduleByIdModule } from "./get-schedule-by-id.module";
import { CancelScheduleModule } from "./cancel-schedule.module";
import { CompleteScheduleModule } from "./complete-schedule.module";
import { DeleteScheduleModule } from "./delete-schedule.module";

@Module({
	imports: [
		CreateScheduleModule,
		GetSchedulesByUserModule,
		GetScheduleByIdModule,
		CancelScheduleModule,
		CompleteScheduleModule,
		DeleteScheduleModule,
	],
})
export class SchedulesModule {}

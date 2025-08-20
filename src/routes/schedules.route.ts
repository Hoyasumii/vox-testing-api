import {
	SchedulesModule,
	CreateScheduleModule,
	GetSchedulesByUserModule,
	GetScheduleByIdModule,
	CancelScheduleModule,
	CompleteScheduleModule,
	DeleteScheduleModule,
} from "@/modules/schedules";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

@Module({
	imports: [
		SchedulesModule,
		RouterModule.register([
			{
				path: "schedules",
				children: [
					{
						path: "/",
						module: CreateScheduleModule,
					},
					{
						path: "/me",
						module: GetSchedulesByUserModule,
					},
					{
						path: "/:id",
						module: GetScheduleByIdModule,
					},
					{
						path: "/:id/cancel",
						module: CancelScheduleModule,
					},
					{
						path: "/:id/complete",
						module: CompleteScheduleModule,
					},
					{
						path: "/:id",
						module: DeleteScheduleModule,
					},
				],
			},
		]),
	],
})
export class SchedulesRoute {}

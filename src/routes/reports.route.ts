import {
	GetDoctorSchedulesModule,
} from "@/modules/schedules";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

@Module({
	imports: [
		GetDoctorSchedulesModule,
		RouterModule.register([
			{
				path: "doctors/:doctorId/schedules",
				module: GetDoctorSchedulesModule,
			},
		]),
	],
})
export class ReportsRoute {}

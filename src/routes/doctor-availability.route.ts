import {
	DoctorAvailabilityModule,
	CreateDoctorAvailabilityModule,
	GetDoctorAvailabilityModule,
	UpdateDoctorAvailabilityModule,
	DeleteDoctorAvailabilityByIdModule,
	DeleteDoctorAvailabilityByDoctorIdModule,
} from "@/modules/doctor-availability";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

@Module({
	imports: [
		DoctorAvailabilityModule,
		RouterModule.register([
			{
				path: "doctors/:doctorId/availability",
				children: [
					{
						path: "/",
						module: CreateDoctorAvailabilityModule,
					},
					{
						path: "/",
						module: GetDoctorAvailabilityModule,
					},
					{
						path: "/:id",
						module: UpdateDoctorAvailabilityModule,
					},
					{
						path: "/:id",
						module: DeleteDoctorAvailabilityByIdModule,
					},
					{
						path: "/",
						module: DeleteDoctorAvailabilityByDoctorIdModule,
					},
				],
			},
		]),
	],
})
export class DoctorAvailabilityRoute {}

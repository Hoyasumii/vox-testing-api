import { UpdateDoctorAvailabilityController } from "@/controllers/doctor-availability";
import { makeUpdateDoctorAvailabilityFactory } from "@/factories/doctors-availability";
import { UpdateDoctorAvailabilityService } from "@/services/doctors-availability";
import { Module } from "@nestjs/common";

@Module({
	controllers: [UpdateDoctorAvailabilityController],
	providers: [
		{
			provide: UpdateDoctorAvailabilityService,
			useFactory: makeUpdateDoctorAvailabilityFactory,
		},
	],
})
export class UpdateDoctorAvailabilityModule {}

import { CreateDoctorAvailabilityController } from "@/controllers/doctor-availability";
import { makeCreateDoctorAvailabilityFactory } from "@/factories/doctors-availability";
import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";
import { Module } from "@nestjs/common";

@Module({
	controllers: [CreateDoctorAvailabilityController],
	providers: [
		{
			provide: CreateDoctorAvailabilityService,
			useFactory: makeCreateDoctorAvailabilityFactory,
		},
	],
})
export class CreateDoctorAvailabilityModule {}

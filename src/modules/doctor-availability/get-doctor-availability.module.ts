import { GetDoctorAvailabilityController } from "@/controllers/doctor-availability";
import { makeFindByDoctorIdFactory } from "@/factories/doctors-availability";
import { FindByDoctorIdService } from "@/services/doctors-availability";
import { Module } from "@nestjs/common";

@Module({
	controllers: [GetDoctorAvailabilityController],
	providers: [
		{
			provide: FindByDoctorIdService,
			useFactory: makeFindByDoctorIdFactory,
		},
	],
})
export class GetDoctorAvailabilityModule {}

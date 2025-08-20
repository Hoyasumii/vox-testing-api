import { DeleteDoctorAvailabilityByIdController } from "@/controllers/doctor-availability";
import { makeDeleteDoctorAvailabilityByIdFactory } from "@/factories/doctors-availability";
import { DeleteDoctorAvailabilityByIdService } from "@/services/doctors-availability";
import { Module } from "@nestjs/common";

@Module({
	controllers: [DeleteDoctorAvailabilityByIdController],
	providers: [
		{
			provide: DeleteDoctorAvailabilityByIdService,
			useFactory: makeDeleteDoctorAvailabilityByIdFactory,
		},
	],
})
export class DeleteDoctorAvailabilityByIdModule {}

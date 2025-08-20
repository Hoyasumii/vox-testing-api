import { DeleteDoctorAvailabilityByDoctorIdController } from "@/controllers/doctor-availability";
import { makeDeleteDoctorAvailabilityByDoctorIdFactory } from "@/factories/doctors-availability";
import { DeleteDoctorAvailabilityByDoctorIdService } from "@/services/doctors-availability";
import { Module } from "@nestjs/common";

@Module({
	controllers: [DeleteDoctorAvailabilityByDoctorIdController],
	providers: [
		{
			provide: DeleteDoctorAvailabilityByDoctorIdService,
			useFactory: makeDeleteDoctorAvailabilityByDoctorIdFactory,
		},
	],
})
export class DeleteDoctorAvailabilityByDoctorIdModule {}

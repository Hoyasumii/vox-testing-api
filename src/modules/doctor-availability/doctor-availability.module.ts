import { Module } from "@nestjs/common";
import { CreateDoctorAvailabilityModule } from "./create-doctor-availability.module";
import { GetDoctorAvailabilityModule } from "./get-doctor-availability.module";
import { UpdateDoctorAvailabilityModule } from "./update-doctor-availability.module";
import { DeleteDoctorAvailabilityByIdModule } from "./delete-doctor-availability-by-id.module";
import { DeleteDoctorAvailabilityByDoctorIdModule } from "./delete-doctor-availability-by-doctor-id.module";

@Module({
	imports: [
		CreateDoctorAvailabilityModule,
		GetDoctorAvailabilityModule,
		UpdateDoctorAvailabilityModule,
		DeleteDoctorAvailabilityByIdModule,
		DeleteDoctorAvailabilityByDoctorIdModule,
	],
})
export class DoctorAvailabilityModule {}

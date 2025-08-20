import { Module } from "@nestjs/common";
import { GetAvailableSlotsModule } from "./get-available-slots.module";

@Module({
	imports: [GetAvailableSlotsModule],
})
export class AvailabilityModule {}

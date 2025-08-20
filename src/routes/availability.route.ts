import {
	AvailabilityModule,
	GetAvailableSlotsModule,
} from "@/modules/availability";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

@Module({
	imports: [
		AvailabilityModule,
		RouterModule.register([
			{
				path: "availability",
				children: [
					{
						path: "/slots",
						module: GetAvailableSlotsModule,
					},
				],
			},
		]),
	],
})
export class AvailabilityRoute {}

import { Module } from "@nestjs/common";
import { AuthRoute } from "./auth.route";
import { UsersRoute } from "./users.route";
import { DoctorAvailabilityRoute } from "./doctor-availability.route";
import { SchedulesRoute } from "./schedules.route";
import { AvailabilityRoute } from "./availability.route";
import { ReportsRoute } from "./reports.route";

@Module({
	imports: [
		AuthRoute, 
		UsersRoute, 
		DoctorAvailabilityRoute, 
		SchedulesRoute, 
		AvailabilityRoute,
		ReportsRoute
	],
})
export default class {}

import { Test, TestingModule } from "@nestjs/testing";
import { UpdateDoctorAvailabilityModule } from "./update-doctor-availability.module";
import { UpdateDoctorAvailabilityController } from "@/controllers/doctor-availability";
import { UpdateDoctorAvailabilityService } from "@/services/doctors-availability";

describe("UpdateDoctorAvailabilityModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [UpdateDoctorAvailabilityModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o UpdateDoctorAvailabilityController registrado", () => {
		const controller = module.get<UpdateDoctorAvailabilityController>(UpdateDoctorAvailabilityController);
		expect(controller).toBeInstanceOf(UpdateDoctorAvailabilityController);
	});

	it("deve ter o UpdateDoctorAvailabilityService registrado", () => {
		const service = module.get<UpdateDoctorAvailabilityService>(UpdateDoctorAvailabilityService);
		expect(service).toBeInstanceOf(UpdateDoctorAvailabilityService);
	});

	it("deve injetar UpdateDoctorAvailabilityService no UpdateDoctorAvailabilityController", () => {
		const controller = module.get<UpdateDoctorAvailabilityController>(UpdateDoctorAvailabilityController);
		expect(controller["service"]).toBeInstanceOf(UpdateDoctorAvailabilityService);
	});
});

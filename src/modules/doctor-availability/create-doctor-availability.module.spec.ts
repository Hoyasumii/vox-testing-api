import { Test, TestingModule } from "@nestjs/testing";
import { CreateDoctorAvailabilityModule } from "./create-doctor-availability.module";
import { CreateDoctorAvailabilityController } from "@/controllers/doctor-availability";
import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";

describe("CreateDoctorAvailabilityModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [CreateDoctorAvailabilityModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o CreateDoctorAvailabilityController registrado", () => {
		const controller = module.get<CreateDoctorAvailabilityController>(CreateDoctorAvailabilityController);
		expect(controller).toBeInstanceOf(CreateDoctorAvailabilityController);
	});

	it("deve ter o CreateDoctorAvailabilityService registrado", () => {
		const service = module.get<CreateDoctorAvailabilityService>(CreateDoctorAvailabilityService);
		expect(service).toBeInstanceOf(CreateDoctorAvailabilityService);
	});

	it("deve injetar CreateDoctorAvailabilityService no CreateDoctorAvailabilityController", () => {
		const controller = module.get<CreateDoctorAvailabilityController>(CreateDoctorAvailabilityController);
		expect(controller["service"]).toBeInstanceOf(CreateDoctorAvailabilityService);
	});
});

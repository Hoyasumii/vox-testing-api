import { Test, TestingModule } from "@nestjs/testing";
import { GetDoctorAvailabilityModule } from "./get-doctor-availability.module";
import { GetDoctorAvailabilityController } from "@/controllers/doctor-availability";
import { FindByDoctorIdService } from "@/services/doctors-availability";

describe("GetDoctorAvailabilityModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [GetDoctorAvailabilityModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o GetDoctorAvailabilityController registrado", () => {
		const controller = module.get<GetDoctorAvailabilityController>(GetDoctorAvailabilityController);
		expect(controller).toBeInstanceOf(GetDoctorAvailabilityController);
	});

	it("deve ter o FindByDoctorIdService registrado", () => {
		const service = module.get<FindByDoctorIdService>(FindByDoctorIdService);
		expect(service).toBeInstanceOf(FindByDoctorIdService);
	});

	it("deve injetar FindByDoctorIdService no GetDoctorAvailabilityController", () => {
		const controller = module.get<GetDoctorAvailabilityController>(GetDoctorAvailabilityController);
		expect(controller["service"]).toBeInstanceOf(FindByDoctorIdService);
	});
});

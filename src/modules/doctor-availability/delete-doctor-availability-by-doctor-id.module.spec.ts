import { Test, TestingModule } from "@nestjs/testing";
import { DeleteDoctorAvailabilityByDoctorIdModule } from "./delete-doctor-availability-by-doctor-id.module";
import { DeleteDoctorAvailabilityByDoctorIdController } from "@/controllers/doctor-availability";
import { DeleteDoctorAvailabilityByDoctorIdService } from "@/services/doctors-availability";

describe("DeleteDoctorAvailabilityByDoctorIdModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [DeleteDoctorAvailabilityByDoctorIdModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o DeleteDoctorAvailabilityByDoctorIdController registrado", () => {
		const controller = module.get<DeleteDoctorAvailabilityByDoctorIdController>(DeleteDoctorAvailabilityByDoctorIdController);
		expect(controller).toBeInstanceOf(DeleteDoctorAvailabilityByDoctorIdController);
	});

	it("deve ter o DeleteDoctorAvailabilityByDoctorIdService registrado", () => {
		const service = module.get<DeleteDoctorAvailabilityByDoctorIdService>(DeleteDoctorAvailabilityByDoctorIdService);
		expect(service).toBeInstanceOf(DeleteDoctorAvailabilityByDoctorIdService);
	});

	it("deve injetar DeleteDoctorAvailabilityByDoctorIdService no DeleteDoctorAvailabilityByDoctorIdController", () => {
		const controller = module.get<DeleteDoctorAvailabilityByDoctorIdController>(DeleteDoctorAvailabilityByDoctorIdController);
		expect(controller["service"]).toBeInstanceOf(DeleteDoctorAvailabilityByDoctorIdService);
	});
});

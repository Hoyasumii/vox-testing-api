import { Test, TestingModule } from "@nestjs/testing";
import { DeleteDoctorAvailabilityByIdModule } from "./delete-doctor-availability-by-id.module";
import { DeleteDoctorAvailabilityByIdController } from "@/controllers/doctor-availability";
import { DeleteDoctorAvailabilityByIdService } from "@/services/doctors-availability";

describe("DeleteDoctorAvailabilityByIdModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [DeleteDoctorAvailabilityByIdModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o DeleteDoctorAvailabilityByIdController registrado", () => {
		const controller = module.get<DeleteDoctorAvailabilityByIdController>(DeleteDoctorAvailabilityByIdController);
		expect(controller).toBeInstanceOf(DeleteDoctorAvailabilityByIdController);
	});

	it("deve ter o DeleteDoctorAvailabilityByIdService registrado", () => {
		const service = module.get<DeleteDoctorAvailabilityByIdService>(DeleteDoctorAvailabilityByIdService);
		expect(service).toBeInstanceOf(DeleteDoctorAvailabilityByIdService);
	});

	it("deve injetar DeleteDoctorAvailabilityByIdService no DeleteDoctorAvailabilityByIdController", () => {
		const controller = module.get<DeleteDoctorAvailabilityByIdController>(DeleteDoctorAvailabilityByIdController);
		expect(controller["service"]).toBeInstanceOf(DeleteDoctorAvailabilityByIdService);
	});
});

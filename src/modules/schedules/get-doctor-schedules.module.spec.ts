import { Test, TestingModule } from "@nestjs/testing";
import { GetDoctorSchedulesModule } from "./get-doctor-schedules.module";
import { GetDoctorSchedulesController } from "@/controllers/schedules";
import { GetScheduleByDoctorIdService } from "@/services/schedule";

describe("GetDoctorSchedulesModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [GetDoctorSchedulesModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o GetDoctorSchedulesController registrado", () => {
		const controller = module.get<GetDoctorSchedulesController>(GetDoctorSchedulesController);
		expect(controller).toBeInstanceOf(GetDoctorSchedulesController);
	});

	it("deve ter o GetScheduleByDoctorIdService registrado", () => {
		const service = module.get<GetScheduleByDoctorIdService>(GetScheduleByDoctorIdService);
		expect(service).toBeInstanceOf(GetScheduleByDoctorIdService);
	});

	it("deve injetar GetScheduleByDoctorIdService no GetDoctorSchedulesController", () => {
		const controller = module.get<GetDoctorSchedulesController>(GetDoctorSchedulesController);
		expect(controller["service"]).toBeInstanceOf(GetScheduleByDoctorIdService);
	});
});

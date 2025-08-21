import { Test, TestingModule } from "@nestjs/testing";
import { GetSchedulesByUserModule } from "./get-schedules-by-user.module";
import { GetSchedulesByUserController } from "@/controllers/schedules";
import { GetScheduleByPatientIdService, GetScheduleByDoctorIdService } from "@/services/schedule";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { VerifyJwtToken } from "@/services/jwt";
import { GetUserContentByIdService } from "@/services/users";

describe("GetSchedulesByUserModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [GetSchedulesByUserModule],
		})
		.overrideGuard(JwtAuthGuard)
		.useValue({
			canActivate: () => true,
		})
		.overrideProvider(VerifyJwtToken)
		.useValue({
			verify: jest.fn(),
		})
		.overrideProvider(GetUserContentByIdService)
		.useValue({
			execute: jest.fn(),
		})
		.compile();
	});

	afterEach(async () => {
		if (module) {
			await module.close();
		}
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o GetSchedulesByUserController registrado", () => {
		const controller = module.get<GetSchedulesByUserController>(GetSchedulesByUserController);
		expect(controller).toBeInstanceOf(GetSchedulesByUserController);
	});

	it("deve ter o GetScheduleByPatientIdService registrado", () => {
		const service = module.get<GetScheduleByPatientIdService>(GetScheduleByPatientIdService);
		expect(service).toBeInstanceOf(GetScheduleByPatientIdService);
	});

	it("deve ter o GetScheduleByDoctorIdService registrado", () => {
		const service = module.get<GetScheduleByDoctorIdService>(GetScheduleByDoctorIdService);
		expect(service).toBeInstanceOf(GetScheduleByDoctorIdService);
	});

	it("deve injetar os serviços no GetSchedulesByUserController", () => {
		const controller = module.get<GetSchedulesByUserController>(GetSchedulesByUserController);
		expect(controller["patientService"]).toBeInstanceOf(GetScheduleByPatientIdService);
		expect(controller["doctorService"]).toBeInstanceOf(GetScheduleByDoctorIdService);
	});
});

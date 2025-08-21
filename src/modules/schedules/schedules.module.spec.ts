import { Test, TestingModule } from "@nestjs/testing";
import { SchedulesModule } from "./schedules.module";
import { CreateScheduleModule } from "./create-schedule.module";
import { GetScheduleByIdModule } from "./get-schedule-by-id.module";
import { GetSchedulesByUserModule } from "./get-schedules-by-user.module";
import { DeleteScheduleModule } from "./delete-schedule.module";
import { CancelScheduleModule } from "./cancel-schedule.module";
import { CompleteScheduleModule } from "./complete-schedule.module";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { VerifyJwtToken } from "@/services/jwt";
import { GetUserContentByIdService } from "@/services/users";

describe("SchedulesModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [SchedulesModule],
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

	it("deve importar todos os sub-módulos de schedules", () => {
		const moduleImports = Reflect.getMetadata('imports', SchedulesModule) || [];
		
		expect(moduleImports).toContain(CreateScheduleModule);
		expect(moduleImports).toContain(GetScheduleByIdModule);
		expect(moduleImports).toContain(GetSchedulesByUserModule);
		expect(moduleImports).toContain(DeleteScheduleModule);
		expect(moduleImports).toContain(CancelScheduleModule);
		expect(moduleImports).toContain(CompleteScheduleModule);
	});
});

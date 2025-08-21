import { Test, TestingModule } from "@nestjs/testing";
import { DoctorAvailabilityModule } from "./doctor-availability.module";
import { CreateDoctorAvailabilityModule } from "./create-doctor-availability.module";
import { GetDoctorAvailabilityModule } from "./get-doctor-availability.module";
import { UpdateDoctorAvailabilityModule } from "./update-doctor-availability.module";
import { DeleteDoctorAvailabilityByIdModule } from "./delete-doctor-availability-by-id.module";
import { DeleteDoctorAvailabilityByDoctorIdModule } from "./delete-doctor-availability-by-doctor-id.module";

describe("DoctorAvailabilityModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [DoctorAvailabilityModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve importar todos os sub-módulos de doctor availability", () => {
		const moduleImports = Reflect.getMetadata('imports', DoctorAvailabilityModule) || [];
		
		expect(moduleImports).toContain(CreateDoctorAvailabilityModule);
		expect(moduleImports).toContain(GetDoctorAvailabilityModule);
		expect(moduleImports).toContain(UpdateDoctorAvailabilityModule);
		expect(moduleImports).toContain(DeleteDoctorAvailabilityByIdModule);
		expect(moduleImports).toContain(DeleteDoctorAvailabilityByDoctorIdModule);
	});
});

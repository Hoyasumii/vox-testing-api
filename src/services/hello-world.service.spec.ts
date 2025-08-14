import { HelloWorldService } from "./hello-world.service";
import { EmptyRepository } from "@/repositories";

describe("HelloWorldService", () => {
	let service: HelloWorldService;
	let repository: EmptyRepository;

	beforeEach(() => {
		repository = new EmptyRepository();
		service = new HelloWorldService(repository);
	});

	describe("run", () => {
		it("deve retornar 'Hello World!'", async () => {
			// Act
			const result = await service.run();

			// Assert
			expect(result).toBe("Hello World!");
		});

		it("deve sempre retornar a mesma mensagem", async () => {
			// Act
			const result1 = await service.run();
			const result2 = await service.run();
			const result3 = await service.run();

			// Assert
			expect(result1).toBe("Hello World!");
			expect(result2).toBe("Hello World!");
			expect(result3).toBe("Hello World!");
			expect(result1).toBe(result2);
			expect(result2).toBe(result3);
		});

		it("deve ser do tipo string", async () => {
			// Act
			const result = await service.run();

			// Assert
			expect(typeof result).toBe("string");
		});
	});
});

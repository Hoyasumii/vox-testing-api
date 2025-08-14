import { type INestApplication } from "@nestjs/common";
import { EnvDTO } from "./dtos";
import { NestFactory } from "@nestjs/core";
import { logger, exposeEnvErrors } from "@/utils";

export class AppBuilder {
	private constructor() {}

	private verify(): boolean {
		const verifyingEnvironment = EnvDTO.safeParse(process.env);

		if (!verifyingEnvironment.success) {
			exposeEnvErrors(verifyingEnvironment.error);
			return false;
		}

		return true;
	}

	static async build(
		appModule: unknown & { name: string },
	): Promise<INestApplication> {
		const factory = new AppBuilder();

		if (!factory.verify()) {
			process.exit(0);
		}

		return await NestFactory.create(appModule as never, {
			logger: logger(),
			bodyParser: true,
		});
	}
}

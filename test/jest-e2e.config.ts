import { pathsToModuleNameMapper, type JestConfigWithTsJest } from "ts-jest";
import { compilerOptions } from "../tsconfig.json";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.testing" });

export default {
	moduleFileExtensions: ["js", "ts"],
	rootDir: "../",
	testEnvironment: "node",
	testRegex: ".e2e-spec.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	preset: "ts-jest",
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: "<rootDir>/",
	}),
	setupFilesAfterEnv: ["<rootDir>/test/setup-e2e.ts"],
	testTimeout: 30000,
	maxWorkers: 1, // Para evitar conflitos no banco de dados
	forceExit: true,
	detectOpenHandles: true,
} as JestConfigWithTsJest;

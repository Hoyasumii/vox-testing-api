import { pathsToModuleNameMapper, type JestConfigWithTsJest } from "ts-jest";
import { compilerOptions } from "../tsconfig.json";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env.testing" });

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
} as JestConfigWithTsJest;

import { pathsToModuleNameMapper, type JestConfigWithTsJest } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

export default {
	moduleFileExtensions: ["js", "ts"],
	rootDir: ".",
	testRegex: ".*\\.spec\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	collectCoverageFrom: ["**/*.(t|j)s"],
	coverageDirectory: "../coverage",
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: "<rootDir>/",
	}),
} as JestConfigWithTsJest;

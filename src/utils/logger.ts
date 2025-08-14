import { ConsoleLogger } from "@nestjs/common";

export function logger() {
	return new ConsoleLogger({
		prefix: "∆",
		timestamp: false,
		compact: true,
		logLevels: ["log", "warn", "error"],
	});
}

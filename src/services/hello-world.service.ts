import type { EmptyRepository } from "@/repositories";
import { Service } from "@/types";

export class HelloWorldService extends Service<EmptyRepository, never, string> {
	async run() {
		return "Hello World!";
	}
}

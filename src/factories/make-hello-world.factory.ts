import { EmptyRepository } from "@/repositories";
import { HelloWorldService } from "@/services";

export function makeHelloWorldFactory() {
	const repo = new EmptyRepository();

	return new HelloWorldService(repo);
}

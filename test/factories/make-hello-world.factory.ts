import { HelloWorldService } from "@/services";

export function makeHelloWorldFactory() {
	return new HelloWorldService();
}

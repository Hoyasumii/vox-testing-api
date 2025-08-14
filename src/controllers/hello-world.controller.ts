import { Controller, Get } from "@nestjs/common";
import { makeHelloWorldFactory } from "@/factories";

@Controller("/hello-world")
export class HelloWorldController {
	private readonly service = makeHelloWorldFactory();

	@Get()
	async getHello(): Promise<string> {
		return await this.service.run();
	}
}

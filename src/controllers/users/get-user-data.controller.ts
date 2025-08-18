import { GetUserContentByIdService } from "@/services/users";
import { Controller, Get, Headers } from "@nestjs/common";

@Controller()
export class GetUserDataController {
	constructor(private service: GetUserContentByIdService) {}

	@Get()
	async get(@Headers("authorization") authorization: string) {
		return await this.service.run(authorization);
	}
}

import type { AuthenticateUserDTO } from "@/dtos/users";
import { AuthenticateUserService } from "@/services/users";
import { Body, Controller, Post } from "@nestjs/common";

@Controller()
export class LoginController {
	constructor(private service: AuthenticateUserService) {}

	@Post()
	async auth(@Body() body: AuthenticateUserDTO) {
		return await this.service.run(body);
	}
}

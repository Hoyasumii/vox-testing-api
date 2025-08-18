import type { CreateUserDTO } from "@/dtos/users";
import { CreateUserService } from "@/services/users";
import { Body, Controller, Post } from "@nestjs/common";

@Controller()
export class RegisterController {
	constructor(private service: CreateUserService) {}

	@Post()
	async create(@Body() body: CreateUserDTO) {
		return await this.service.run(body);
	}
}

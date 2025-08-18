import type { UpdateUserDTO } from "@/dtos/users";
import { UpdateUserService } from "@/services/users";
import { Body, Controller, Headers, Put } from "@nestjs/common";

@Controller()
export class UpdateUserController {
	constructor(private service: UpdateUserService) {}

	@Put()
	async update(
		@Headers("authorization") id: string,
		@Body() data: UpdateUserDTO,
	) {
		return await this.service.run({ id, data });
	}
}

import { DeleteUserService } from "@/services/users";
import { Controller, Delete, Headers } from "@nestjs/common";

@Controller()
export class DeleteUserController {
	constructor(private service: DeleteUserService) {}

	@Delete()
	async remove(@Headers("authorization") authorization: string) {
		return this.service.run(authorization);
	}
}

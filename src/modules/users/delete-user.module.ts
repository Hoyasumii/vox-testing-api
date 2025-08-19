import { Module } from "@nestjs/common";
import { DeleteUserController } from "@/controllers/users";
import { DeleteUserService } from "@/services/users";
import { makeDeleteUserFactory } from "@/factories/users";

@Module({
	controllers: [DeleteUserController],
	providers: [
		{
			provide: DeleteUserService,
			useFactory: makeDeleteUserFactory,
		},
	],
})
export class DeleteUserModule {}

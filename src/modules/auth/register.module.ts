import { RegisterController } from "@/controllers/auth";
import { makeCreateUserFactory } from "@/factories/users";
import { CreateUserService } from "@/services/users";
import { Module } from "@nestjs/common";

@Module({
	controllers: [RegisterController],
	providers: [
		{
			provide: CreateUserService,
			useFactory: makeCreateUserFactory,
		},
	],
})
export class AuthRegisterModule {}

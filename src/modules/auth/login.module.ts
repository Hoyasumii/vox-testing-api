import { LoginController } from "@/controllers/auth";
import { makeAuthenticateUserFactory } from "@/factories/users";
import { AuthenticateUserService } from "@/services/users";
import { Module } from "@nestjs/common";

@Module({
	controllers: [LoginController],
	providers: [
		{
			provide: AuthenticateUserService,
			useFactory: makeAuthenticateUserFactory,
		},
	],
})
export class AuthLoginModule {}

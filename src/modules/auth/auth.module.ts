import { Module } from "@nestjs/common";
import { AuthLoginModule } from "./login.module";
import { AuthRegisterModule } from "./register.module";
import { AuthRefreshTokenModule } from "./refresh-token.module";

@Module({
	imports: [
		AuthLoginModule,
		AuthRegisterModule,
		AuthRefreshTokenModule,
	],
})
export class AuthModule {}

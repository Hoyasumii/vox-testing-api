import { AuthLoginModule, AuthRegisterModule, AuthRefreshTokenModule } from "@/modules/auth";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

@Module({
	imports: [
		AuthLoginModule,
		AuthRegisterModule,
		AuthRefreshTokenModule,
		RouterModule.register([
			{
				path: "auth",
				children: [
					{
						path: "/",
						module: AuthLoginModule,
					},
					{
						path: "/new",
						module: AuthRegisterModule,
					},
					{
						path: "/refresh",
						module: AuthRefreshTokenModule,
					},
				],
			},
		]),
	],
})
export class AuthRoute {}

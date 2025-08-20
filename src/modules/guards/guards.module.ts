import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { VerifyJwtToken } from "@/services/jwt";
import { makeGetUserContentByIdFactory } from "@/factories/users";
import { GetUserContentByIdService } from "@/services/users";

@Module({
	providers: [
		VerifyJwtToken,
		{
			provide: GetUserContentByIdService,
			useFactory: makeGetUserContentByIdFactory,
		},
		JwtAuthGuard,
		RolesGuard,
	],
	exports: [
		VerifyJwtToken,
		GetUserContentByIdService,
		JwtAuthGuard,
		RolesGuard,
	],
})
export class GuardsModule {}

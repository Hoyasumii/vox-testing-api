import { RefreshTokenController } from "@/controllers/auth";
import { RefreshJwtToken, VerifyJwtToken } from "@/services/jwt";
import { Module } from "@nestjs/common";

@Module({
	controllers: [RefreshTokenController],
	providers: [VerifyJwtToken, RefreshJwtToken],
})
export class AuthRefreshTokenModule {}

import { Module, Global } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from './';
import { VerifyJwtToken } from '@/services/jwt';

@Global()
@Module({
	providers: [
		JwtAuthGuard,
		RolesGuard,
		VerifyJwtToken,
	],
	exports: [
		JwtAuthGuard,
		RolesGuard,
		VerifyJwtToken,
	],
})
export class GuardsModule {}

import { Module } from "@nestjs/common";
import { HelloWorldController } from "@/controllers";
import { ConfigModule } from "@nestjs/config";
import { GuardsModule } from "@/guards";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import routes from "./routes";

@Module({
	imports: [
		ConfigModule.forRoot(),
		ThrottlerModule.forRoot([
			{
				name: "short",
				ttl: 1000, // 1 segundo
				limit: 3, // 3 requests por segundo
			},
			{
				name: "medium",
				ttl: 10000, // 10 segundos
				limit: 20, // 20 requests por 10 segundos
			},
			{
				name: "long",
				ttl: 60000, // 1 minuto
				limit: 100, // 100 requests por minuto
			},
		]),
		GuardsModule,
		routes,
	],
	controllers: [HelloWorldController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { HelloWorldController } from "@/controllers";
import { ConfigModule } from "@nestjs/config";
import { GuardsModule } from "@/guards";
import routes from "./routes";

@Module({
	imports: [ConfigModule.forRoot(), GuardsModule, routes],
	controllers: [HelloWorldController],
	providers: [],
})
export class AppModule {}

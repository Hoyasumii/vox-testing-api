import { Module } from "@nestjs/common";
import { HelloWorldController } from "@/controllers";
import { ConfigModule } from "@nestjs/config";
import routes from "./routes";

@Module({
	imports: [ConfigModule.forRoot(), routes],
	controllers: [HelloWorldController],
	providers: [],
})
export class AppModule {}

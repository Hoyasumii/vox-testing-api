import { Module } from "@nestjs/common";
import { HelloWorldController } from "@/controllers";
import { ConfigModule } from "@nestjs/config";
import { AuthRoute } from "./routes/auth.route";

@Module({
	imports: [ConfigModule.forRoot(), AuthRoute],
	controllers: [HelloWorldController],
	providers: [],
})
export class AppModule {}

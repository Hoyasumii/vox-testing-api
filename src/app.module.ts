import { Module } from "@nestjs/common";
import { HelloWorldController } from "@/controllers";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule.forRoot()],
	controllers: [HelloWorldController],
	providers: [],
})
export class AppModule {}

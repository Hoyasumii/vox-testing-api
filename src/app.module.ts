import { Module } from "@nestjs/common";
import { HelloWorldController } from "@/controllers";

@Module({
	imports: [],
	controllers: [HelloWorldController],
	providers: [],
})
export class AppModule {}

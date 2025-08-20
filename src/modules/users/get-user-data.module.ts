import { Module } from "@nestjs/common";
import { GetUserDataController } from "@/controllers/users";
import { GetUserContentByIdService } from "@/services/users";
import { makeGetUserContentByIdFactory } from "@/factories/users";
import { GuardsModule } from "../guards/guards.module";

@Module({
	imports: [GuardsModule],
	controllers: [GetUserDataController],
	providers: [
		{
			provide: GetUserContentByIdService,
			useFactory: makeGetUserContentByIdFactory,
		},
	],
})
export class GetUserDataModule {}

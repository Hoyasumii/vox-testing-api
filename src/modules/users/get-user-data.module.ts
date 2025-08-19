import { Module } from "@nestjs/common";
import { GetUserDataController } from "@/controllers/users";
import { GetUserContentByIdService } from "@/services/users";
import { makeGetUserContentByIdFactory } from "@/factories/users";

@Module({
	controllers: [GetUserDataController],
	providers: [
		{
			provide: GetUserContentByIdService,
			useFactory: makeGetUserContentByIdFactory,
		},
	],
})
export class GetUserDataModule {}

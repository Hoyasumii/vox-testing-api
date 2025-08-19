import { Module } from "@nestjs/common";
import { DeleteUserModule } from "./delete-user.module";
import { GetUserDataModule } from "./get-user-data.module";
import { UpdateUserModule } from "./update-user.module";

@Module({
	imports: [
		DeleteUserModule,
		GetUserDataModule,
		UpdateUserModule,
	],
})
export class UsersModule {}

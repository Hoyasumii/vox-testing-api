import { UpdateUserModule, DeleteUserModule, GetUserDataModule } from "@/modules/users";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

@Module({
	imports: [
		UpdateUserModule,
		DeleteUserModule,
		GetUserDataModule,
		RouterModule.register([
			{
				path: "/users",
				children: [
					{
						path: "/me",
						module: GetUserDataModule,
					},
					{
						path: "/me",
						module: UpdateUserModule
					},
					{
						path: "/me",
						module: DeleteUserModule
					}
				],
			},
		]),
	],
})
export class UsersRoute {}

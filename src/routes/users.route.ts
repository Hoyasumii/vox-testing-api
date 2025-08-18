import { UsersModule } from "@/modules/users";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

@Module({
	imports: [
		UsersModule,
		RouterModule.register([
			{
				path: "users",
				children: [
					{
						path: "/me",
						module: UsersModule,
					},
				],
			},
		]),
	],
})
export class UsersRoute {}

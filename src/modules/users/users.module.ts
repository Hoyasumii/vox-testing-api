import { Module } from "@nestjs/common";
import {
	DeleteUserController,
	GetUserDataController,
	UpdateUserController,
} from "@/controllers/users";
import {
	DeleteUserService,
	GetUserContentByIdService,
	UpdateUserService,
} from "@/services/users";

@Module({
	controllers: [
		DeleteUserController,
		GetUserDataController,
		UpdateUserController,
	],
	providers: [
		DeleteUserService,
		GetUserContentByIdService,
		UpdateUserService,
	],
	exports: [
		DeleteUserService,
		GetUserContentByIdService,
		UpdateUserService,
	],
})
export class UsersModule {}

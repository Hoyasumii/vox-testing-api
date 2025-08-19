import { Module } from "@nestjs/common";
import { AuthRoute } from "./auth.route";
import { UsersRoute } from "./users.route";

@Module({
	imports: [AuthRoute, UsersRoute],
})
export default class {}

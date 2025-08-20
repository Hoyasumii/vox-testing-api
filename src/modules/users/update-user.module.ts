import { Module } from "@nestjs/common";
import { UpdateUserController } from "@/controllers/users";
import { UpdateUserService } from "@/services/users";
import { makeUpdateUserFactory } from "@/factories/users";
import { GuardsModule } from "../guards/guards.module";

@Module({
	imports: [GuardsModule],
	controllers: [UpdateUserController],
	providers: [
		{
			provide: UpdateUserService,
			useFactory: makeUpdateUserFactory,
		},
	],
})
export class UpdateUserModule {}

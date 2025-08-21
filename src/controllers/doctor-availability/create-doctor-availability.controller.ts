import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";
import { Controller, Post, Param, Body, UseGuards, Request, ForbiddenException } from "@nestjs/common";
import { DoctorIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { CreateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";
import { JwtAuthGuard, RolesGuard, Roles } from "@/guards";
import { Throttle } from "@nestjs/throttler";
import type { AuthenticatedRequest } from "@/types";

export class CreateDoctorAvailabilityBody extends createZodDto(CreateDoctorAvailabilityDTO) {}

@ApiTags("📅 Disponibilidades")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DOCTOR')
@Controller()
export class CreateDoctorAvailabilityController {
	constructor(private service: CreateDoctorAvailabilityService) {}

	@Post()
	@Throttle({ medium: { limit: 15, ttl: 60000 } }) // 15 criações de disponibilidade por minuto
	@ApiOperation({ 
		summary: "Criar disponibilidade",
		description: "Cria uma nova disponibilidade de horário para o médico"
	})
	@ApiParam({
		name: "doctorId",
		description: "ID do médico",
		type: "string"
	})
	@ApiResponse({ 
		status: 201, 
		description: "Disponibilidade criada com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	@ApiResponse({ 
		status: 403, 
		description: "Usuário não tem permissão (deve ser médico)" 
	})
	@ApiResponse({ 
		status: 429, 
		description: "Muitas criações de disponibilidade. Aguarde um momento." 
	})
	@ApiResponse({ 
		status: 409, 
		description: "Conflito de horários" 
	})
	async create(
		@Request() req: AuthenticatedRequest,
		@Param() params: DoctorIdParam,
		@Body() body: CreateDoctorAvailabilityBody
	) {
		// Verificar se o médico está tentando criar disponibilidade para si mesmo
		if (params.id !== req.user.id) {
			throw new ForbiddenException('Você só pode gerenciar suas próprias disponibilidades');
		}

		return await this.service.run({
			...body,
			doctorId: params.id
		});
	}
}

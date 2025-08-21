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
		description: "Disponibilidade criada com sucesso",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: true,
					description: "Indica se a operação foi bem-sucedida"
				},
				data: {
					type: "boolean",
					example: true,
					description: "Resultado da operação de criação"
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({ 
		status: 400, 
		description: "Dados de entrada inválidos",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 403, 
		description: "Usuário não tem permissão (deve ser médico)",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 404, 
		description: "Médico não encontrado",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 409, 
		description: "Conflito de horários",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 429, 
		description: "Muitas criações de disponibilidade",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	async create(
		@Request() req: AuthenticatedRequest,
		@Param() params: DoctorIdParam,
		@Body() body: CreateDoctorAvailabilityBody
	): Promise<boolean> {
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

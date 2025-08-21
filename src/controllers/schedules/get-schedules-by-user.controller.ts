import { GetScheduleByPatientIdService, GetScheduleByDoctorIdService } from "@/services/schedule";
import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/guards";
import type { AuthenticatedRequest } from "@/types";

@ApiTags("🗓️ Agendamentos")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class GetSchedulesByUserController {
	constructor(
		private patientService: GetScheduleByPatientIdService,
		private doctorService: GetScheduleByDoctorIdService
	) {}

	@Get()
	@ApiOperation({ 
		summary: "Listar agendamentos do usuário logado",
		description: "Retorna todos os agendamentos do usuário logado (paciente ou médico)"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Lista de agendamentos retornada com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	async get(@Request() req: AuthenticatedRequest) {
		// Determina automaticamente se é paciente ou médico pelo token
		if (req.user.type === 'DOCTOR') {
			return await this.doctorService.run(req.user.id);
		} else {
			return await this.patientService.run(req.user.id);
		}
	}
}

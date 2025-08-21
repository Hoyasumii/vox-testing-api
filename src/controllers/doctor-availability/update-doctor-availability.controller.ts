import { UpdateDoctorAvailabilityService } from "@/services/doctors-availability";
import { Controller, Put, Param, Body } from "@nestjs/common";
import { DoctorAvailabilityIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { UpdateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";

export class UpdateDoctorAvailabilityBody extends createZodDto(UpdateDoctorAvailabilityDTO) {}

@ApiTags("📅 Disponibilidades")
@Controller()
export class UpdateDoctorAvailabilityController {
	constructor(private service: UpdateDoctorAvailabilityService) {}

	@Put()
	@ApiOperation({ 
		summary: "Atualizar disponibilidade",
		description: "Atualiza uma disponibilidade específica do médico"
	})
	@ApiParam({
		name: "doctorId",
		description: "ID do médico",
		type: "string"
	})
	@ApiParam({
		name: "id",
		description: "ID da disponibilidade",
		type: "string"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Disponibilidade atualizada com sucesso",
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
					description: "Confirmação da atualização",
					example: true
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({ 
		status: 404, 
		description: "Médico ou disponibilidade não encontrada",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				}
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
				}
			}
		}
	})
	async update(
		@Param("id") availabilityIdParam: DoctorAvailabilityIdParam,
		@Body() body: UpdateDoctorAvailabilityBody
	): Promise<boolean> {
		return await this.service.run({
			id: availabilityIdParam.id,
			content: body
		});
	}
}

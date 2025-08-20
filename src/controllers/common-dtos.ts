import { createZodDto } from "nestjs-zod";
import { AuthorizationHeaderDTO, RefreshTokenDTO } from "@/dtos/users";
import { DoctorIdParamDTO } from "@/dtos/doctors";
import { HelloWorldResponseDTO } from "@/dtos";
import { ScheduleIdParamDTO, GetAvailableSlotsQueryDTO } from "@/dtos/schedules";
import { DoctorAvailabilityIdParamDTO } from "@/dtos/doctors-availability";

// Classes reutilizáveis para diferentes controllers
export class AuthorizationHeader extends createZodDto(AuthorizationHeaderDTO) {}
export class RefreshToken extends createZodDto(RefreshTokenDTO) {}
export class DoctorIdParam extends createZodDto(DoctorIdParamDTO) {}
export class HelloWorldResponse extends createZodDto(HelloWorldResponseDTO) {}
export class ScheduleIdParam extends createZodDto(ScheduleIdParamDTO) {}
export class GetAvailableSlotsQuery extends createZodDto(GetAvailableSlotsQueryDTO) {}
export class DoctorAvailabilityIdParam extends createZodDto(DoctorAvailabilityIdParamDTO) {}

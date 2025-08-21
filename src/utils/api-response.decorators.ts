import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { createErrorResponseSchema, createSuccessResponseSchema } from "./openapi-schema.utils";

interface OpenApiSchemaProperty {
	type: string;
	format?: string;
	enum?: string[];
	description?: string;
	example?: unknown;
}

interface ApiResponseConfig {
	status: number;
	description: string;
	schema?: Record<string, unknown>;
	isError?: boolean;
}

/**
 * Decorador para aplicar múltiplas respostas de API de uma vez
 */
export function ApiResponses(...configs: ApiResponseConfig[]) {
	const decorators = configs.map(config => {
		if (config.isError && !config.schema) {
			// Se for um erro e não tem schema customizado, usa o schema padrão de erro
			return ApiResponse({
				status: config.status,
				description: config.description,
				schema: createErrorResponseSchema(config.description, config.status)
			});
		}
		
		return ApiResponse({
			status: config.status,
			description: config.description,
			schema: config.schema
		});
	});
	
	return applyDecorators(...decorators);
}

/**
 * Decorador para resposta de sucesso tipada
 */
export function ApiSuccessResponse(
	status: number, 
	description: string, 
	properties: Record<string, OpenApiSchemaProperty>, 
	required?: string[]
) {
	return ApiResponse({
		status,
		description,
		schema: createSuccessResponseSchema(properties, required)
	});
}

/**
 * Decorador para resposta de erro
 */
export function ApiErrorResponse(status: number, description: string) {
	return ApiResponse({
		status,
		description,
		schema: createErrorResponseSchema(description, status)
	});
}

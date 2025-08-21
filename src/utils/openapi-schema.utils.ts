interface OpenApiSchema {
	type: string;
	format?: string;
	enum?: string[];
	items?: OpenApiSchema;
	properties?: Record<string, OpenApiSchema>;
	required?: string[];
	example?: unknown;
	description?: string;
}

/**
 * Cria um schema de resposta de erro padrão (como retornado pelos exception filters)
 */
export function createErrorResponseSchema(message: string, statusCode: number): OpenApiSchema {
	return {
		type: "object",
		properties: {
			message: { 
				type: "string", 
				example: message,
				description: "Mensagem de erro"
			},
			statusCode: { 
				type: "number", 
				example: statusCode,
				description: "Código de status HTTP"
			},
			timestamp: { 
				type: "string", 
				format: "date-time",
				description: "Timestamp do erro"
			},
			path: { 
				type: "string",
				description: "Caminho da requisição que gerou o erro"
			}
		}
	};
}

/**
 * Cria um schema de resposta de sucesso (como retornado pelo StandardizeResponse interceptor)
 * - success: sempre true
 * - data: os dados retornados pelo service
 */
export function createStandardizedSuccessResponse(dataSchema: OpenApiSchema): OpenApiSchema {
	return {
		type: "object",
		properties: {
			success: {
				type: "boolean",
				example: true,
				description: "Indica se a operação foi bem-sucedida"
			},
			data: dataSchema
		},
		required: ["success", "data"]
	};
}

/**
 * Schema para resposta de dados primitivos (string, number, boolean)
 */
export function createPrimitiveDataSchema(type: "string" | "number" | "boolean", format?: string, example?: unknown): OpenApiSchema {
	const schema: OpenApiSchema = { type };
	
	if (format) schema.format = format;
	if (example !== undefined) schema.example = example;
	
	return schema;
}

/**
 * Schema para resposta de objeto complexo
 */
export function createObjectDataSchema(properties: Record<string, OpenApiSchema>, required?: string[]): OpenApiSchema {
	const schema: OpenApiSchema = {
		type: "object",
		properties
	};
	
	if (required && required.length > 0) {
		schema.required = required;
	}
	
	return schema;
}

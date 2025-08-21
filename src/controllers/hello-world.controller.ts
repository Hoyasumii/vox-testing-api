import { Controller, Get } from "@nestjs/common";
import { makeHelloWorldFactory } from "@/factories";
import { HelloWorldResponse } from "./common-dtos";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("🔧 Utilitários")
@Controller("/hello-world")
export class HelloWorldController {
	private readonly service = makeHelloWorldFactory();

	@Get()
	@ApiOperation({
		summary: "Verificação de saúde da API",
		description:
			"Endpoint para verificar se a API está funcionando corretamente",
	})
	@ApiResponse({
		status: 200,
		description: "API funcionando corretamente",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: true,
				},
				data: {
					type: "object",
					properties: {
						message: {
							type: "string",
							example: "Hello World!",
							description: "Mensagem de saudação"
						}
					},
					required: ["message"]
				},
			},
			required: ["success", "data"]
		},
	})
	async getHello(): Promise<HelloWorldResponse> {
		const message = await this.service.run();
		return { message };
	}
}

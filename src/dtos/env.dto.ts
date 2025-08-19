import z from "zod";

export const EnvDTO = z.object({
	PORT: z.string().describe("Porta onde o servidor será executado"),
	POSTGRESQL_USERNAME: z.string().describe("Nome de usuário para conexão com PostgreSQL"),
	POSTGRESQL_PASSWORD: z.string().describe("Senha para conexão com PostgreSQL"),
	POSTGRESQL_DATABASE: z.string().describe("Nome do banco de dados PostgreSQL"),
	DATABASE_URL: z.string().describe("URL completa de conexão com o banco de dados"),
	ARGON_SECRET: z.string().describe("Chave secreta para hashing com Argon2"),
	JWT_PRIVATE_KEY: z.string().describe("Chave privada para assinatura de tokens JWT")
}).describe("Variáveis de ambiente necessárias para configuração da aplicação");

export type EnvDTO = z.infer<typeof EnvDTO>;

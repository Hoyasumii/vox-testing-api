import { InternalServerError } from "@/errors";
import { ChannelBase } from "../types/channel-base";
import { IsJwtTokenExpiringSoon, RefreshJwtToken, SignJwtToken, VerifyJwtToken } from "@/services/jwt";

export class ChannelImpl extends ChannelBase {
	private readonly channels: Record<
		string,
		(args: unknown) => Promise<unknown>
	> = {};

	constructor() {
		super();

		this.register<object, string>("jwt:sign", async (content: object) => {
					const service = new SignJwtToken();
		
					return await service.run(content);
				});
		
				this.register<string, boolean>(
					"jwt:is-expiring-soon",
					async (token: string) => {
						const service = new IsJwtTokenExpiringSoon();
		
						return await service.run(token);
					},
				);
		
				this.register<string, string>(
					"jwt:refresh",
					async (token: string) => {
						const service = new RefreshJwtToken();
						return await service.run(token);
					},
				);
		
				this.register<string, boolean>(
					"jwt:verify",
					async (token: string) => {
						const service = new VerifyJwtToken();
						return await service.run(token);
					},
				);
	}

	register<Request, Response>(
		channelName: string,
		handler: (args: Request) => Promise<Response>,
	): void {
		this.channels[channelName] = handler;
	}

	async talk<Request, Response>(
		channelName: string,
		message: Request,
	): Promise<Response> {
		if (!(channelName in this.channels)) throw new InternalServerError();

		const response = (await this.channels[channelName](message)) as Response;

		return response;
	}
}



export abstract class ChannelBase {
	abstract register<Request, Response>(
		channelName: string,
		handler: (args: Request) => Promise<Response>,
	): void;

	abstract talk<Request, Response>(
		channelName: string,
		message: Request,
	): Promise<Response>;
}

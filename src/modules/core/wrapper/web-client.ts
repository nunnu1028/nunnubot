export interface CWebClient {
	new (_host: string): IWebClient;
}

export interface IWebClient {
	request(
		method: string,
		path: string,
		headers: Record<string | number, unknown>,
		data?: string
	): Promise<{
		statusCode: number;
		headers: Record<string | number, unknown>;
		body: string;
	}>;
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
export class WebClient implements IWebClient {
	public static classConstructor: CWebClient = WebClient;

	constructor(private readonly _host: string) {}

	public async request(
		method: string,
		path: string,
		headers: Record<string | number, unknown>,
		data?: string
	): Promise<{
		statusCode: number;
		headers: Record<string | number, unknown>;
		body: string;
	}> {
		// No definition for org.jsoup.Jsoup

		/* @ts-ignore */
		const connection = org.jsoup.Jsoup.connect(this._host + path)
			.headers(headers)
			.ignoreContentType(true)
			/* @ts-ignore */
			.method(org.jsoup.Connection.Method.valueOf(method));

		if (data) connection.requestBody(data);
		const result = connection.execute();

		return {
			statusCode: result.statusCode(),
			headers: result.headers(),
			body: result.body()
		};
	}
}

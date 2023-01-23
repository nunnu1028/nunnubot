export class WebClient {
	constructor(private readonly _host: string) {}

	public request(
		method: string,
		path: string,
		headers: Record<any, any>,
		data?: string
	): {
		statusCode: number;
		headers: Record<any, any>;
		body: string;
	} {
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

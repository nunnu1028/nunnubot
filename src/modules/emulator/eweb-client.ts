import axios from "axios";
import { IWebClient } from "core";

export class EWebClient implements IWebClient {
	constructor(private readonly _host: string) {}

	public async request(
		method: string,
		path: string,
		headers: Record<string | number, never>,
		data?: string
	): Promise<{
		statusCode: number;
		headers: Record<string | number, unknown>;
		body: string;
	}> {
		const res = await axios({
			method,
			url: this._host + path,
			headers: {
				...headers
			},
			responseType: "text",
			data
		});

		return {
			statusCode: res.status,
			headers: res.headers,
			body: res.data
		};
	}
}

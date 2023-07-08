import { OperationType, RSPCError, Transport } from "@rspc/client";

export class FetchTransport implements Transport {
  private url: string;
  clientSubscriptionCallback?: (id: string, key: string, value: any) => void;
  private fetch: typeof globalThis.fetch;

  constructor(url: string, fetch?: typeof globalThis.fetch) {
    this.url = url;
    this.fetch = fetch || globalThis.fetch.bind(globalThis);
  }

  async doRequest(
    operation: OperationType,
    key: string,
    input: any
  ): Promise<any> {
    if (operation === "subscription" || operation === "subscriptionStop") {
      throw new Error(
        `Subscribing to '${key}' failed as the HTTP transport does not support subscriptions! Maybe try using the websocket transport?`
      );
    }

    let method = "GET";
    let body = undefined as any;
    let headers = new Headers();

    const params = new URLSearchParams();
    if (operation === "query") {
      if (input !== undefined) {
        params.append("input", JSON.stringify(input));
      }
    } else if (operation === "mutation") {
      method = "POST";
      body = JSON.stringify(input || {});
      headers.set("Content-Type", "application/json");
    }
    const paramsStr = params.toString();
    const resp = await this.fetch(
      `${this.url}/${key}${paramsStr.length > 0 ? `?${paramsStr}` : ""}`,
      {
        method,
        body,
        credentials: "include",
        headers,
      }
    );

    const respBody = await resp.json();
    const { type, data } = respBody.result;
    if (type === "error") {
      const { code, message } = data;
      throw new RSPCError(code, message);
    }
    return data;
  }
}

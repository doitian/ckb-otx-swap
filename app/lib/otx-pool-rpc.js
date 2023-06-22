export class OtxPoolRpcError extends Error {
  constructor(error) {
    super(error.message);
    this.code = error.code;
    this.data = error.data;
  }
}

function expectResult(response) {
  if (response.error) {
    throw new OtxPoolRpcError(response.error);
  }

  return response.result;
}

export default class OtxPoolRpc {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.requestId = 1;
  }

  async call(method, params) {
    const id = this.requestId;
    this.requestId += 1;
    const bodyPayload = {
      jsonrpc: "2.0",
      method,
      id,
    };
    if (params !== undefined) {
      bodyPayload.params = params;
    }
    const body = JSON.stringify(bodyPayload);
    // console.log(`${this.endpoint} ${body}`);
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    return expectResult(await response.json());
  }

  async getAllSwapProposals() {
    return await this.call("get_all_swap_proposals");
  }

  async submitOtx(otx) {
    return await this.call("submit_otx", [otx.toJson()]);
  }
}

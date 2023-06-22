import { Indexer, RPC, config as lumosConfig } from "@ckb-lumos/lumos";

import OtxPoolRpc from "./otx-pool-rpc";
import Wallet from "./wallet";

export const ENV_CKB_CHAIN = "CKB_CHAIN";
export const ENV_CKB_RPC_URL = "CKB_RPC_URL";
export const ENV_OTX_POOL_RPC_URL = "OTX_POOL_RPC_URL";
export const ENV_USER_PRIVATE_KEY = "USER_PRIVATE_KEY";

const ENV_KEYS = [
  ENV_CKB_CHAIN,
  ENV_CKB_RPC_URL,
  ENV_OTX_POOL_RPC_URL,
  ENV_USER_PRIVATE_KEY,
];

const CKB_ENVS = {
  AGGRON4: {
    EXPLORER_URL: "https://pudge.explorer.nervos.org",
    ...lumosConfig.predefined.AGGRON4,
    SCRIPTS: {
      ...lumosConfig.predefined.AGGRON4.SCRIPTS,
      OTXLOCK: {
        CODE_HASH:
          "0x96f5f7c1731ad93acf4d84275e363941180b6417b1fc6dbcbcd6dd034f4b232f",
        HASH_TYPE: "type",
        TX_HASH:
          "0xb136eb95b34898caa716f4dd6815801971dea60167c268b947a636adb4f90028",
        INDEX: "0x0",
        DEP_TYPE: "depGroup",
      },
    },
  },
};

export default class RuntimeConfig {
  constructor(env) {
    this.configured = true;
    this.env = {};
    for (const key of ENV_KEYS) {
      if (env[key] === undefined || env[key] === null) {
        console.log(`env ${key} not configured`);
        this.configured = false;
      }
      this.env[key] = env[key];
    }

    this.ckbChainConfig =
      typeof env[ENV_CKB_CHAIN] === "string"
        ? CKB_ENVS[env[ENV_CKB_CHAIN]]
        : env[ENV_CKB_CHAIN];

    if (this.configured) {
      const privateKey = env[ENV_USER_PRIVATE_KEY];
      delete this.env[ENV_USER_PRIVATE_KEY];
      this.getWallet = () => new Wallet(privateKey, this.ckbChainConfig);
    }
  }

  getCkbRpcUrl() {
    return this.env[ENV_CKB_RPC_URL];
  }

  buildCkbIndexer() {
    return new Indexer(this.getCkbRpcUrl());
  }

  buildCkbRpcClient() {
    return new RPC(this.getCkbRpcUrl());
  }

  getOtxPoolRpcUrl() {
    return this.env[ENV_OTX_POOL_RPC_URL];
  }

  buildOtxPoolRpcClient() {
    return new OtxPoolRpc(this.getOtxPoolRpcUrl());
  }
}

export const injectConfig = (function () {
  let config = undefined;
  return function () {
    if (config === undefined) {
      config = new RuntimeConfig(process.env);
    }

    return config;
  };
})();

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

import { helpers, hd } from "@ckb-lumos/lumos";

function expectHex(key) {
  if (key.startsWith("0x")) {
    return key.substring(2);
  }

  return key;
}

export default class Wallet {
  constructor(privateKey, ckbChainConfig) {
    const keypair = ec.keyFromPrivate(expectHex(privateKey));

    this.pkh = hd.key.publicKeyToBlake160(
      `0x${keypair.getPublic(true, "hex")}`
    );
    this.ckbChainConfig = ckbChainConfig;
  }

  // Return a script that uses the wallet pubkey hash as args
  pkhScript(script) {
    return {
      codeHash: script.CODE_HASH,
      hashType: script.HASH_TYPE,
      args: this.pkh,
    };
  }

  pkhScriptByScriptName(scriptName) {
    return this.pkhScript(this.ckbChainConfig.SCRIPTS[scriptName]);
  }

  secp256k1LockScript() {
    return this.pkhScriptByScriptName("SECP256K1_BLAKE160");
  }

  secp256k1Address() {
    return helpers.encodeToAddress(this.secp256k1LockScript(), {
      config: this.ckbChainConfig,
    });
  }

  otxLockScript() {
    return this.pkhScriptByScriptName("OTXLOCK");
  }

  otxAddress() {
    return helpers.encodeToAddress(this.otxLockScript(), {
      config: this.ckbChainConfig,
    });
  }
}

import { ec as EC } from "elliptic";
import { helpers, hd, commons, utils } from "@ckb-lumos/lumos";

const ec = new EC("secp256k1");

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

    this.signTx = (txSkeleton) => {
      const txForSigning = commons.common.prepareSigningEntries(txSkeleton);
      const signatures = txForSigning
        .get("signingEntries")
        .map(({ message }) =>
          hd.key.signRecoverable(message, `0x${keypair.getPrivate("hex")}`)
        );
      return helpers.sealTransaction(txForSigning, signatures.toJSON());
    };
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

  sudtTypeScript() {
    const script = this.ckbChainConfig.SCRIPTS["SUDT"];

    return {
      codeHash: script.CODE_HASH,
      hashType: script.HASH_TYPE,
      args: utils.computeScriptHash(this.secp256k1LockScript()),
    };
  }

  otxAddress() {
    return helpers.encodeToAddress(this.otxLockScript(), {
      config: this.ckbChainConfig,
    });
  }
}

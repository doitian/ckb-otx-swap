import { BI } from "@ckb-lumos/lumos";
import { number } from "@ckb-lumos/codec";

export default class AssetsIndexer {
  constructor(indexer, ckbChainConfig) {
    this.indexer = indexer;
    this.ckbChainConfig = ckbChainConfig;
  }

  async listAssets(lock) {
    const SUDT = this.ckbChainConfig.SCRIPTS.SUDT;
    const collector = this.indexer.collector({ lock });

    let ckbBalance = BI.from(0);
    const sudtBalances = {};

    for await (const cell of collector.collect()) {
      const typeScript = cell.cellOutput.type;
      if (typeScript === null) {
        ckbBalance = ckbBalance.add(cell.cellOutput.capacity);
      } else if (
        typeScript.codeHash === SUDT.CODE_HASH &&
        typeScript.hashType === SUDT.HASH_TYPE
      ) {
        const oldBalance = sudtBalances[typeScript.args] ?? BI.from(0);
        sudtBalances[typeScript.args] = oldBalance.add(
          number.Uint128LE.unpack(cell.data)
        );
      }
    }

    const assets = [{ kind: "CKB", identity: "CKB", balance: ckbBalance }];
    for (const [identity, balance] of Object.entries(sudtBalances)) {
      assets.push({ kind: "SUDT", identity, balance });
    }

    return assets;
  }
}

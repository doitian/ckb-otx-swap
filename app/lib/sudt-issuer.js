import { helpers, commons } from "@ckb-lumos/lumos";

const {
  sudt,
  common: { payFeeByFeeRate },
} = commons;

export default class SudtIssuer {
  constructor(wallet, ckbRpcClient, ckbIndexer, ckbChainConfig) {
    this.wallet = wallet;
    this.ckbRpcClient = ckbRpcClient;
    this.ckbIndexer = ckbIndexer;
    this.ckbChainConfig = ckbChainConfig;
  }

  async issue(amount) {
    const ownerAddress = this.wallet.secp256k1Address();

    let txSkeleton = helpers.TransactionSkeleton({
      cellProvider: this.ckbIndexer,
    });
    txSkeleton = await sudt.issueToken(
      txSkeleton,
      ownerAddress,
      amount,
      undefined,
      undefined,
      {
        config: this.ckbChainConfig,
      }
    );

    txSkeleton = await payFeeByFeeRate(
      txSkeleton,
      [ownerAddress],
      1000,
      undefined,
      {
        config: this.ckbChainConfig,
      }
    );

    const tx = this.wallet.signTx(txSkeleton);
    const txHash = await this.ckbRpcClient.sendTransaction(tx, "passthrough");
    return txHash;
  }
}

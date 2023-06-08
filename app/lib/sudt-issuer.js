import { helpers } from "@ckb-lumos/lumos";
import { sudt } from "@ckb-lumos/common-scripts";
import { payFeeByFeeRate } from "@ckb-lumos/common-scripts/lib/common";

export default class SudtIssuer {
  constructor(wallet, ckbRpcClient, ckbIndexer, ckbChainConfig) {
    this.wallet = wallet;
    this.ckbRpcClient = ckbRpcClient;
    this.ckbIndexer = ckbIndexer;
    this.ckbChainConfig = ckbChainConfig;
  }

  async issue(amount) {
    const ownerAddress = this.wallet.secp256k1Address();
    const otxLockScript = this.wallet.otxLockScript();

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

    // modify the target output to use OTX Lock
    txSkeleton = txSkeleton.update("outputs", (outputs) => {
      return outputs.update(0, (cell) => {
        return {
          ...cell,
          cellOutput: {
            ...cell.cellOutput,
            lock: otxLockScript,
          },
        };
      });
    });

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

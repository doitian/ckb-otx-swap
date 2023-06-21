import { BI } from "@ckb-lumos/lumos";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { classnames } from "tailwindcss-classnames";

import AssetsIndexer from "@/app/lib/assets-indexer";
import { injectConfig } from "@/app/lib/runtime-config";
import PageTitle from "@/app/components/page-title";
import { renderAssetBalance } from "@/app/lib/view-utils";
import * as styles from "@/app/styles";

import { swapAssets } from "./actions";

export default async function SwapPage({
  params: { fromKind, fromIdentity, toKind },
  config = injectConfig(),
}) {
  const wallet = config.getWallet();
  const ckbIndexer = config.buildCkbIndexer();
  const indexer = new AssetsIndexer(ckbIndexer, config.ckbChainConfig);
  const assets = await indexer.listAssets(wallet.secp256k1LockScript());
  const fromAsset = assets.find(
    (a) => a.kind === fromKind && a.identity === fromIdentity
  ) ?? {
    kind: fromKind,
    identity: fromIdentity,
    balance: BI.from(0),
  };

  return (
    <div>
      <PageTitle>
        Swap From {fromKind} To {toKind}
      </PageTitle>

      <form action={swapAssets}>
        <div className="mb-4 flex flex-col md:flex-row gap-x-1">
          <fieldset className="flex-1 space-y-1">
            <legend className="block text-sm font-medium mb-2 dark:text-white">
              <label for="from-amount">From {fromKind}</label>
            </legend>
            <input type="hidden" name="fromKind" defaultValue={fromKind} />
            <input
              name="fromIdentity"
              type={fromKind === "CKB" ? "hidden" : "text"}
              defaultValue={fromIdentity}
              className={classnames(styles.disabledInput, "block", "w-full")}
              readonly
            />
            <input
              id="from-amount"
              name="fromAmount"
              type="number"
              className={classnames(styles.input, "block", "w-full")}
              required
            />
            <p class="text-sm text-gray-500 mt-2">
              Owned {renderAssetBalance(fromAsset)}
            </p>
          </fieldset>
          <ArrowLongRightIcon className="w-8 h-8 flex-none self-center" />
          <fieldset className="flex-1 space-y-1">
            <legend className="block text-sm font-medium mb-2 dark:text-white">
              <label for="to-amount">To {toKind}</label>
            </legend>
            <input type="hidden" name="toKind" defaultValue={toKind} />
            <input
              name="toIdentity"
              type={toKind === "CKB" ? "hidden" : "text"}
              className={classnames(styles.input, "block", "w-full")}
              placeholder={toKind === "CKB" ? "CKB" : "0x..."}
              defaultValue={toKind === "CKB" ? "CKB" : ""}
              required
            />
            <input
              id="to-amount"
              name="toAmount"
              type="number"
              className={classnames(styles.input, "block", "w-full")}
              required
            />
          </fieldset>
        </div>
        <div className="text-center">
          <button className={styles.solidButton} type="submit">
            Swap
          </button>
        </div>
      </form>
    </div>
  );
}

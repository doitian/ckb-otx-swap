import { BI } from "@ckb-lumos/lumos";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

import * as styles from "../styles";
import { injectConfig } from "../lib/runtime-config";
import { renderCkbBalance } from "../lib/view-utils";
import AssetsIndexer from "../lib/assets-indexer";
import PageTitle from "../components/page-title";
import AddressText from "../components/address-text";
import { issueSudt } from "./actions";

export const metadata = {
  title: "Issue SUDT",
};

const MIN_OWNER_BALANCE = BI.from(10).pow(8).mul(100);

function Claim({ address, explorerUrl, balance }) {
  return (
    <section className="mb-8">
      <h3 className="text-xl leading-4 mb-4">Insifficient CKB to Issue SUDT</h3>

      <p className="mb-4">
        Current balance is {renderCkbBalance(balance)},<br />
        the minimum required balance is {renderCkbBalance(MIN_OWNER_BALANCE)}.
      </p>

      <p className="mb-4">
        Please claim CKB to the address{" "}
        <AddressText address={address} explorerUrl={explorerUrl} />
      </p>

      <a
        href="https://faucet.nervos.org/"
        target="_blank"
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Claim CKB via Faucet
      </a>
    </section>
  );
}

function IssueForm() {
  return (
    <form className="flex items-baseline space-x-4" action={issueSudt}>
      <label
        className="w-24 text-right text-sm font-medium dark:text-white"
        for="amount"
      >
        Amount
      </label>
      <input
        id="amount"
        name="amount"
        className={styles.input}
        value="10000"
        type="number"
        required
      />

      <button className={styles.solidButton} type="submit">
        Issue
      </button>
    </form>
  );
}

export default async function IssueSudtPage({ config = injectConfig() }) {
  const wallet = config.getWallet();
  const ckbIndexer = config.buildCkbIndexer();
  const indexer = new AssetsIndexer(ckbIndexer, config.ckbChainConfig);

  const ownerScript = wallet.secp256k1LockScript();
  const ownerAssets = await indexer.listAssets(ownerScript);
  const ownerAddress = wallet.secp256k1Address();
  const ckbAssets = [ownerAssets.find((asset) => asset.kind === "CKB")];
  const balanceIsSufficient = ckbAssets[0].balance.gte(MIN_OWNER_BALANCE);

  return (
    <>
      <PageTitle>{metadata.title}</PageTitle>

      <div>
        {balanceIsSufficient ? (
          <IssueForm />
        ) : (
          <Claim
            address={ownerAddress}
            explorerUrl={config.ckbChainConfig.EXPLORER_URL}
            balance={ckbAssets[0].balance}
          />
        )}
      </div>

      <footer className="mt-8">
        <p className="mb-2 text-sm text-indigo-600 font-semibold">
          <InformationCircleIcon className="w-6 h-6 -mt-1 inline" /> This will
          create a cell as following:
        </p>
        <pre className="border rounded p-2 mb-6 leading-8 text-gray-600 whitespace-prewrap text-sm overflow-hidden">
          <code>
            {JSON.stringify(
              {
                lock: wallet.otxAddress(),
                type: wallet.sudtTypeScript(),
                data: "0x{Amount}",
                capacity: 142,
              },
              null,
              2
            )}
          </code>
        </pre>
      </footer>
    </>
  );
}

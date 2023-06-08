import { BI } from "@ckb-lumos/lumos";

import { injectConfig } from "../lib/runtime-config";
import { renderCkbBalance } from "../lib/view-utils";
import AssetsIndexer from "../lib/assets-indexer";
import PageTitle from "../components/page-title";
import AssetsList from "../assets/components/assets-list";
import { issueSudt } from "./actions";

export const metadata = {
  title: "Issue SUDT",
};

const MIN_OWNER_BALANCE = BI.from(10).pow(8).mul(100);

function Claim({ address, balance }) {
  return (
    <section>
      <h3 className="text-xl leading-4 mb-4">Insifficient CKB to Issue SUDT</h3>

      <p className="mb-4">
        Current balance is {renderCkbBalance(balance)}, the minimum required
        balance is {renderCkbBalance(MIN_OWNER_BALANCE)}
      </p>

      <p className="mb-4">Please claim CKB to the address: {address}</p>

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
    <form action={issueSudt}>
      <div className="mb-4">
        <label className="mr-4" for="amount">
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          className="rounded"
          value="10000"
          type="number"
        />
      </div>

      <div className="mb-4">
        <button
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="submit"
        >
          Issue
        </button>
      </div>
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

      <p>SUDT Type Script:</p>
      <pre className="border rounded p-4 my-6 text-lg leading-8 text-gray-600">
        <code>{JSON.stringify(wallet.sudtTypeScript(), null, 2)}</code>
      </pre>

      <div>
        {balanceIsSufficient ? (
          <IssueForm />
        ) : (
          <Claim address={ownerAddress} balance={ckbAssets[0].balance} />
        )}
      </div>
    </>
  );
}

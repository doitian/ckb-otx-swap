import { BI } from "@ckb-lumos/lumos";

import { injectConfig } from "../lib/runtime-config";
import AssetsIndexer from "../lib/assets-indexer";
import PageTitle from "../components/page-title";
import AddressText from "../components/address-text";

export const metadata = {
  title: "Assets",
};

function renderDecimal(number, digits) {
  const integer = number.div(BI.from(10).pow(digits));
  const fraction = number.mod(BI.from(10).pow(digits));
  return `${integer}.${fraction.toString().padStart(digits, "0")}`;
}

function renderBalance(asset) {
  if (asset.kind === "CKB") {
    return renderDecimal(asset.balance, 8);
  }

  return `${asset.balance}`;
}

function AssetsList({ title, address, assets }) {
  return (
    <section>
      <h3>{title}</h3>
      <aside>
        <p>
          <AddressText address={address} />
        </p>
        <p class="text-right p-4">
          <a
            href="https://faucet.nervos.org/"
            target="_blank"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Claim CKB via Faucet
          </a>
        </p>
      </aside>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="px-8">Asset</th>
            <th className="px-8">Balance</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={`${asset.kind}-${asset.identity}`}>
              <th className="px-4">
                {asset.kind} ({asset.identity})
              </th>
              <td className="px-4 text-right">{renderBalance(asset)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default async function AssetsPage({ config = injectConfig() }) {
  const wallet = config.getWallet();
  const ckbIndexer = config.buildCkbIndexer();
  const indexer = new AssetsIndexer(ckbIndexer, config.ckbChainConfig);

  const otxAssets = await indexer.listAssets(wallet.otxLockScript());

  return (
    <>
      <PageTitle>{metadata.title}</PageTitle>
      <AssetsList
        title="OTX Account"
        address={wallet.otxAddress()}
        assets={otxAssets}
      />
    </>
  );
}

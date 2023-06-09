import Link from "next/link";

import { renderCkbBalance } from "../../lib/view-utils";
import AddressText from "../../components/address-text";

export function renderBalance(asset) {
  if (asset.kind === "CKB") {
    return renderCkbBalance(asset.balance);
  }

  return `${asset.balance}`;
}

export default function AssetsList({ title, address, assets }) {
  return (
    <section className="mb-8">
      <h3 className="font-bold leading-4 text-gray-900 sm:truncate sm:tracking-tight">{title}</h3>
      <aside className="mb-8">
        <p className="flex items-baseline">
          <AddressText className="grow" address={address} />
          <a
            href="https://faucet.nervos.org/"
            target="_blank"
            className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Claim CKB via Faucet
          </a>
        </p>
      </aside>

      <table className="w-full mb-8">
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

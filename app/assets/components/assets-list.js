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
